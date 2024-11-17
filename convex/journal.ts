//self-care-app\convex\journal.ts

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to add a note.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found.");
    }

    await ctx.db.insert("journal", {
      title: args.title,
      content: args.content,
      createdBy: user._id,
      createdAt: args.createdAt,
    });
  },
});


export const getNotes = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to get notes.");
    }

    return await ctx.db
      .query("journal")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", args.userId))
      .order("asc")
      .collect();
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("journal"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to delete notes.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError("User not found.");
    }

    const note = await ctx.db.get(args.noteId);

    if (!note || note.createdBy !== user._id) {
      throw new ConvexError("Note not found or user is unauthorized.");
    }

    await ctx.db.delete(args.noteId);
  },
});
