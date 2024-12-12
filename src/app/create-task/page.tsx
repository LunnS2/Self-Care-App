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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 md:p-24">
      <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
          Create New Task
        </h1>
        <p className="text-muted-foreground text-center mb-4">
          Organize your tasks and prioritize your well-being.
        </p>
        <TaskForm onSubmit={handleTaskSubmit} />
      </div>
    </main>
  );
};

export default CreateTaskPage;
