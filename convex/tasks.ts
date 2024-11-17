import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a New Task
export const addTask = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    recurring: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to add a task.");
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

    await ctx.db.insert("tasks", {
      title: args.title,
      content: args.content,
      completed: false,
      createdBy: user._id,
      recurring: args.recurring,
    });
  },
});


// Retrieve All Tasks for a User
export const getTasks = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to get tasks.");
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", args.userId))
      .order("asc")
      .collect();
  },
});

// Complete a Task
export const completeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to complete tasks.");
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

    const task = await ctx.db.get(args.taskId);

    if (!task || task.createdBy !== user._id) {
      throw new ConvexError("Task not found or user is unauthorized.");
    }

    await ctx.db.patch(args.taskId, { completed: true });
  },
});


// Delete a Task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("You must be logged in to delete tasks.");
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

    const task = await ctx.db.get(args.taskId);

    if (!task || task.createdBy !== user._id) {
      throw new ConvexError("Task not found or user is unauthorized.");
    }

    await ctx.db.delete(args.taskId);
  },
});
