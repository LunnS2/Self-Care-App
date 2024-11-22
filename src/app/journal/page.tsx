//self-care-app\src\app\journal\page.tsx

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const Journal = () => {
  const [journal, setJournal] = useState({
    title: "",
    content: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const me = useQuery(api.users.getMe);
  const userId = me?._id;

  const notes = useQuery(api.journal.getNotes, userId ? { userId } : "skip");
  const addNote = useMutation(api.journal.addNote);
  const deleteNote = useMutation(api.journal.deleteNote);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!journal.title.trim() || !journal.content.trim()) {
      alert("Please provide both a title and content.");
      return;
    }

    if (!me) {
      alert("User information is not available.");
      return;
    }

    try {
      await addNote({
        title: journal.title,
        content: journal.content,
        createdBy: me._id,
        createdAt: Date.now(),
      });
      setJournal({ title: "", content: "" });
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const handleDeleteNote = async (noteId: Id<"journal">) => {
    try {
      await deleteNote({ noteId });
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const filteredNotes = notes?.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Journal</h1>

      {/* Search Bar */}
      <div className="mb-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
        />
      </div>

      {/* Add Note Form */}
      <form
        onSubmit={handleAddNote}
        className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
      >
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Title</label>
          <input
            type="text"
            value={journal.title}
            onChange={(e) =>
              setJournal((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="Enter your title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium mb-2">Content</label>
          <textarea
            value={journal.content}
            onChange={(e) =>
              setJournal((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="Enter your content"
            rows={5}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-700 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500"
        >
          Add Note
        </button>
      </form>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredNotes?.map((note) => (
          <div
            key={note._id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col"
          >
            <h2 className="text-xl font-bold text-gray-200 mb-2">
              {note.title}
            </h2>
            <p className="text-gray-300 mb-4">{note.content}</p>
            <button
              onClick={() => handleDeleteNote(note._id as Id<"journal">)} // Type assertion here
              className="self-end bg-gray-700 text-gray-200 py-1 px-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
