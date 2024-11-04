import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a New Task
export const addTask = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    recurring: v.boolean(), // Added recurring argument
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
      throw new ConvexError("User not found");
    }

    // Insert task with recurring status
    await ctx.db.insert("tasks", {
      title: args.title,
      content: args.content,
      completed: false,
      createdBy: args.createdBy,
      recurring: args.recurring, // Store the recurring value
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

    const task = await ctx.db
      .query("tasks")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", identity.tokenIdentifier))
      .filter((q) => q.eq(q.field("_id"), args.taskId))
      .first();

    if (!task) {
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

    const task = await ctx.db
      .query("tasks")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", identity.tokenIdentifier))
      .filter((q) => q.eq(q.field("_id"), args.taskId))
      .first();

    if (!task) {
      throw new ConvexError("Task not found or user is unauthorized.");
    }

    await ctx.db.delete(args.taskId);
  },
});
