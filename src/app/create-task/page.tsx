"use client";

import React, { useState } from "react";
import TaskForm from "@/components/task-form";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

const CreateTaskPage = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const addTaskMutation = useMutation(api.tasks.addTask);
  const me = useQuery(api.users.getMe);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <p className="text-muted-foreground">Please sign in to create tasks</p>
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

  const handleTaskSubmit = async (
    title: string,
    content: string,
    recurring: boolean
  ) => {
    try {
      setIsSubmitting(true);
      const lastCompleted = undefined;

      await addTaskMutation({
        title,
        content,
        createdBy: me._id,
        recurring,
        lastCompleted,
      });

      router.push("/user-tasks");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground 
      px-6 md:px-12 lg:px-24 transition-all duration-300 ml-16 md:ml-20"
    >
      <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center text-foreground">
          Create New Task
        </h1>
        <p className="text-base md:text-lg text-muted-foreground text-center mb-4">
          Organize your tasks and prioritize your well-being.
        </p>
        <TaskForm onSubmit={handleTaskSubmit} isSubmitting={isSubmitting} />
      </div>
    </main>
  );
};

export default CreateTaskPage;
