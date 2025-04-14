"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const UserTasks = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const me = useQuery(api.users.getMe);
  const tasks = useQuery(
    api.tasks.getTasks,
    me?._id ? { userId: me._id } : "skip"
  );
  const deleteTask = useMutation(api.tasks.deleteTask);
  const completeTask = useMutation(api.tasks.completeTask);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (!me) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8 ml-16 md:ml-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Tasks</h1>
      <p className="text-base md:text-lg text-muted-foreground">
        complete tasks to earn points.
      </p>
      <button
        className="top-0 bg-primary text-primary-foreground font-medium px-4 py-2 rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 m-4"
        onClick={() => router.push("/create-task")}
      >
        Add More Tasks
      </button>

      {tasks?.length ? (
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex flex-col md:flex-row gap-4 items-center bg-card text-card-foreground shadow-md p-4 rounded-md mb-2 w-full max-w-lg"
          >
            <div className="flex-1">
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-muted-foreground">{task.content}</p>
              {task.recurring ? (
                <p className="text-sm text-muted-foreground mt-2">Daily</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  One Time Only
                </p>
              )}
            </div>
            {!task.completed && (
              <button
                onClick={async () => {
                  await completeTask({ taskId: task._id });
                }}
                className="bg-success text-success-foreground px-4 py-2 rounded hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Complete
              </button>
            )}
            <button
              onClick={async () => {
                await deleteTask({ taskId: task._id });
              }}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-base md:text-lg text-muted-foreground">
          No tasks found. Create one to get started!
        </p>
      )}
    </div>
  );
};

export default UserTasks;
