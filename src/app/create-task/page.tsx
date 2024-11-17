// self-care-app/src/app/create-task/page.tsx

"use client";

import React from "react";
import TaskForm from "@/components/task-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel"; // Import Convex Id type

const CreateTaskPage = () => {
  const addTaskMutation = useMutation(api.tasks.addTask);
  const currentUser = useQuery(api.users.getMe);
  const router = useRouter();

  const handleTaskSubmit = async (
    title: string,
    content: string,
    recurring: boolean
  ) => {
    if (!currentUser) {
      alert("You must be logged in to create a task.");
      return;
    }

    // Convert Clerk's user ID to Convex's expected format
    const userId: Id<"users"> = `users/${currentUser._id}` as Id<"users">;

    try {
      await addTaskMutation({
        title,
        content,
        createdBy: userId, // converted userId to the mutation
        recurring,
      });
      alert("Task created successfully!");
      router.push("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create New Task
        </h1>
        <TaskForm onSubmit={handleTaskSubmit} />
      </div>
    </div>
  );
};

export default CreateTaskPage;
