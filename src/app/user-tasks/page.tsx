// self-care-app/src/app/user-tasks/page.tsx

"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs"; // Clerk's browser API
import { Id } from "../../../convex/_generated/dataModel"; // Convex Id type

const UserTasks = () => {
  const { user } = useUser(); // Fetch current user's information

  // Convert Clerk user ID to Convex Id<"users">
  const userId: Id<"users"> | undefined = user
    ? (`users/${user.id}` as Id<"users">)
    : undefined;

  const tasks = useQuery(api.tasks.getTasks, userId ? { userId } : "skip");

  const deleteTask = useMutation(api.tasks.deleteTask);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      {tasks?.map((task) => (
        <div
          key={task._id}
          className="flex gap-4 items-center bg-white shadow-md p-4 rounded-md mb-2"
        >
          <div>
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.content}</p>
          </div>
          <button
            onClick={async () => {
              await deleteTask({ taskId: task._id });
            }}
            className="text-red-500 hover:text-red-700"
          >
            Delete Task
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserTasks;
