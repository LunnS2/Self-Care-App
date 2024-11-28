// self-care-app/src/app/create-task/page.tsx

"use client";

import React from "react";
import TaskForm from "@/components/task-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const CreateTaskPage = () => {
  const addTaskMutation = useMutation(api.tasks.addTask);
  const me = useQuery(api.users.getMe);
  const router = useRouter();

  const handleTaskSubmit = async (title: string, content: string, recurring: boolean) => {
    try {
      await addTaskMutation({
        title,
        content,
        createdBy: me!._id,
        recurring,
      });
      alert("Task created successfully!");
      router.push("/user-tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">Create New Task</h1>
        <TaskForm onSubmit={handleTaskSubmit} />
      </div>
    </div>
  );
};

export default CreateTaskPage;
