// self-care-app/src/app/user-tasks/page.tsx

"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const UserTasks = () => {
  const router = useRouter();
  const me = useQuery(api.users.getMe);

  const userId = me?._id;

  const tasks = useQuery(api.tasks.getTasks, userId ? { userId } : "skip");

  const deleteTask = useMutation(api.tasks.deleteTask);

  if (!me) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <button
        className="top-0 bg-primary text-primary-foreground font-medium px-4 py-2 rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-4"
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
            </div>
            <button
              onClick={async () => {
                await deleteTask({ taskId: task._id });
              }}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground mt-4">
          No tasks found. Create one to get started!
        </p>
      )}
    </div>
  );
};

export default UserTasks;
