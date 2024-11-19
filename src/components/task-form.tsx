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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Task Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:outline-none"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="recurring"
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Recurring Task</label>
      </div>

      <button
        type="submit"
        className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 focus:outline-none"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
