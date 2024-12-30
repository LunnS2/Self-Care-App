// self-care-app\src\components\task-form.tsx

"use client";

import React, { useState } from "react";

type TaskFormProps = {
  onSubmit: (title: string, content: string, recurring: boolean) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      alert("Title and Content can't be empty");
      return;
    }
    onSubmit(title, content, recurring);
    setTitle("");
    setContent("");
    setRecurring(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-lg">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={30}
          className="w-full px-4 py-2 mb-4 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter task title"
          required
        />
        <p className="text-sm text-muted-foreground">{title.length}/30 characters</p>
      </div>

      {/* Content Input */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-foreground">
          Task Content
        </label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={35}
          className="w-full px-4 py-2 mb-4 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Describe your task here"
          required
        />
        <p className="text-sm text-muted-foreground">{content.length}/35 characters</p>
      </div>

      {/* Recurring Checkbox */}
      <div className="flex items-center">
        <input
          id="recurring"
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="h-5 w-5 text-primary focus:ring-primary/70 border-muted rounded"
        />
        <label htmlFor="recurring" className="ml-2 text-sm font-medium text-foreground">
          Recurring Task
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/70"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
