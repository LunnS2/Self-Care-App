//self-care-app\src\app\journal\page.tsx

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TrashIcon, Cross2Icon } from '@radix-ui/react-icons';

const Journal = () => {
  const [journal, setJournal] = useState({ title: "", content: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState<{
    _id: Id<"journal">;
    title: string;
    content: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Id<"journal"> | null>(null);

  const me = useQuery(api.users.getMe);
  const userId = me?._id;

  const notes = useQuery(api.journal.getNotes, userId ? { userId } : "skip");
  const addNote = useMutation(api.journal.addNote);
  const deleteNote = useMutation(api.journal.deleteNote);
  const updateNote = useMutation(api.journal.updateNote);

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
      alert("Error adding note. Please try again.");
      console.error(err);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;

    if (!activeNote.title.trim() || !activeNote.content.trim()) {
      alert("Please provide both a title and content.");
      return;
    }

    try {
      await updateNote({
        noteId: activeNote._id,
        title: activeNote.title,
        content: activeNote.content,
      });
      setActiveNote(null);
    } catch (err) {
      alert("Error updating note.");
      console.error(err);
    }
  };

  const handleDeleteNote = async () => {
    if (!confirmDelete) return;

    try {
      await deleteNote({ noteId: confirmDelete });
      setConfirmDelete(null);
      setActiveNote(null);
    } catch (err) {
      alert("Error deleting note.");
      console.error(err);
    }
  };

  const filteredNotes = notes?.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
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
            className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col cursor-pointer relative"
            onClick={() => setActiveNote(note)}
          >
            <h2
              className="text-xl font-bold text-gray-200 mb-2 truncate"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {note.title}
            </h2>
            <p
              className="text-gray-300 mb-4 truncate"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
              }}
            >
              {note.content}
            </p>
            <span className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand and edit
            </span>

            {/* Trash Bin Icon for Deletion in Notes Grid */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(note._id);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer text-2xl"
            >
              <TrashIcon fontSize="inherit" />
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold text-gray-200 mb-4">
              Are you sure you want to delete this note?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteNote}
                className="bg-red-600 text-gray-200 py-2 px-4 rounded-lg hover:bg-red-500 focus:outline-none"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-600 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-500 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {activeNote && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-2xl relative">
            {/* Close Icon (X) */}
            <div
              onClick={() => setActiveNote(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 cursor-pointer text-2xl"
            >
              <Cross2Icon />
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Edit Note</h2>
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Title</label>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) =>
                  setActiveNote((prev) => ({
                    ...prev!,
                    title: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-2">Content</label>
              <textarea
                value={activeNote.content}
                onChange={(e) =>
                  setActiveNote((prev) => ({
                    ...prev!,
                    content: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-gray-200 rounded-lg focus:ring focus:ring-gray-500 focus:outline-none"
                rows={5}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSaveNote}
                className="bg-green-600 text-gray-200 py-2 px-4 rounded-lg hover:bg-green-500 focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
