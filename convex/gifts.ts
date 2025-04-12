import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gifts")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});