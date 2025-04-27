// self-care-app\convex\tasks.ts

import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Add a New Task
export const addTask = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    createdBy: v.id("users"),
    recurring: v.boolean(),
    lastCompleted: v.optional(v.number()),
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
      lastCompleted: args.lastCompleted,
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

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", args.userId))
      .filter((q) => q.eq(q.field("completed"), false))
      .order("asc")
      .collect();

    return tasks;
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

    if (task.completed) {
      throw new ConvexError("Task is already completed.");
    }

    if (task.recurring) {
      await ctx.db.patch(args.taskId, {
        completed: true,
        lastCompleted: Date.now(),
      });
    } else {
      await ctx.db.delete(args.taskId);
    }

    const pointsToAward = 10;
    const newPoints = (user.points || 0) + pointsToAward;

    await ctx.db.patch(user._id, { points: newPoints });

    return { success: true, pointsAwarded: pointsToAward };
  },
});

export const regenerateRecurringTasks = internalMutation({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const now = Date.now();

    for (const user of users) {
      const userTimezone = user.timezone || "UTC";

      const userTasks = await ctx.db
        .query("tasks")
        .withIndex("by_createdBy", (q) => q.eq("createdBy", user._id))
        .filter((q) =>
          q.and(
            q.eq(q.field("recurring"), true),
            q.eq(q.field("completed"), true)
          )
        )
        .collect();

      for (const task of userTasks) {
        if (!task.lastCompleted) continue;

        const lastCompletedDate = new Date(task.lastCompleted);
        const lastCompletedDay = new Date(
          lastCompletedDate.getFullYear(),
          lastCompletedDate.getMonth(),
          lastCompletedDate.getDate()
        ).getTime();

        const fourAMAfterLastCompleted = lastCompletedDay + (4 * 60 * 60 * 1000);

        if (now > fourAMAfterLastCompleted) {
          await ctx.db.patch(task._id, {
            completed: false
          });
        }
      }
    }
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
