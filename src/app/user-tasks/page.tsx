"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";

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

  const [processingTasks, setProcessingTasks] = useState<Set<string>>(
    new Set()
  );

  const handleCompleteTask = async (taskId: Id<"tasks">) => {
    try {
      setProcessingTasks((prev) => new Set(prev).add(taskId.toString()));
      const result = await completeTask({ taskId });
      if (result?.pointsAwarded) {
        alert(`Task completed! You earned ${result.pointsAwarded} points.`);
      }
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Failed to complete task.");
    } finally {
      setProcessingTasks((prev) => {
        const updated = new Set(prev);
        updated.delete(taskId.toString());
        return updated;
      });
    }
  };

  const handleDeleteTask = async (taskId: Id<"tasks">) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      setProcessingTasks((prev) => new Set(prev).add(taskId.toString()));
      await deleteTask({ taskId });
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    } finally {
      setProcessingTasks((prev) => {
        const updated = new Set(prev);
        updated.delete(taskId.toString());
        return updated;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Please sign in to view your tasks
        </p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8 ml-16 md:ml-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Tasks</h1>
      <p className="text-base md:text-lg text-muted-foreground mb-4">
        Complete tasks to earn points. You currently have {me.points || 0}{" "}
        points.
      </p>
      <button
        className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-8"
        onClick={() => router.push("/create-task")}
      >
        Add More Tasks
      </button>

      <div className="w-full max-w-lg space-y-4">
        {tasks === undefined ? (
          <p className="text-center text-muted-foreground">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No tasks found. Create one to get started!
          </p>
        ) : (
          tasks.map((task) => {
            const isProcessing = processingTasks.has(task._id.toString());

            return (
              <div
                key={task._id}
                className="flex flex-col md:flex-row items-center justify-between bg-card text-card-foreground shadow-md p-4 rounded-md w-full"
              >
                {/* Task content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold">{task.title}</h3>
                  <p className="text-muted-foreground">{task.content}</p>
                  <p className="text-sm mt-2">
                    {task.recurring ? "Daily" : "One Time Only"}
                  </p>
                </div>

                {/*Task Status Content*/}
                <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="text-gray-500 hover:text-green-500 transition p-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "..." : <CheckIcon className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-500 hover:text-red-500 transition p-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "..." : <TrashIcon className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserTasks;
