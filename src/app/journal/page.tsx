//self-care-app\src\app\journal\page.tsx

"use client"; 

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Journal = () => {
  const [journal, setJournal] = useState({
    title: "",
    content: "",
  });

  const me = useQuery(api.users.getMe); // Fetches user information
  const addNote = useMutation(api.journal.addNote); // Mutation to add a journal note

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure title and content are provided
    if (!journal.title.trim() || !journal.content.trim()) {
      alert("Please provide both title and content for your journal entry.");
      return;
    }

    // Validation: Ensure `me` is available
    if (!me) {
      alert("User information is not available. Please try again.");
      return;
    }

    try {
      await addNote({
        title: journal.title,
        content: journal.content,
        createdBy: me._id, // Use the user's ID from the `me` query
        createdAt: Date.now(), // Add a timestamp for creation
      });

      setJournal({
        title: "",
        content: "",
      });
    } catch (err: any) {
      console.error("Error adding journal entry:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Journal</h1>
      <form
        onSubmit={handleSendTextMsg}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={journal.title}
            onChange={(e) =>
              setJournal((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:outline-none"
            placeholder="Enter your title"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={journal.content}
            onChange={(e) =>
              setJournal((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:outline-none"
            placeholder="Enter your content"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default Journal;
