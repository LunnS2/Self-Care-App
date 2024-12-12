//self-care-app\src\app\journal\page.tsx

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { TrashIcon, Cross2Icon } from "@radix-ui/react-icons";

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
    <div className="flex flex-col items-center p-8 min-h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Journal</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-lg px-4 py-2 border border-input bg-card rounded-md text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary mb-6"
      />

      {/* Add Note Form */}
      <form
        onSubmit={handleAddNote}
        className="w-full max-w-lg bg-card p-6 rounded-md shadow-md mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">Add New Note</h2>
        <input
          type="text"
          value={journal.title}
          onChange={(e) =>
            setJournal((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Title"
          className="w-full px-4 py-2 mb-4 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={journal.content}
          onChange={(e) =>
            setJournal((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Content"
          rows={4}
          className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
        >
          Add Note
        </button>
      </form>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredNotes?.map((note) => (
          <div
            key={note._id}
            className="bg-card p-4 rounded-md shadow-md hover:shadow-lg transition cursor-pointer relative"
            onClick={() => setActiveNote(note)}
          >
            <h3 className="text-lg font-semibold mb-2 truncate">{note.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{note.content}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(note._id);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteNote}
                className="bg-destructive text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {activeNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card p-6 rounded-md shadow-md w-full max-w-2xl relative">
            <button
              onClick={() => setActiveNote(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <Cross2Icon />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Note</h2>
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) =>
                setActiveNote((prev) => ({ ...prev!, title: e.target.value }))
              }
              className="w-full px-4 py-2 mb-4 border border-input bg-background rounded-md focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) =>
                setActiveNote((prev) => ({ ...prev!, content: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSaveNote}
              className="w-full mt-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
