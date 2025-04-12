import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    image: v.string(),
    tokenIdentifier: v.string(),
    isOnline: v.boolean(),
    points: v.optional(v.number()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  tasks: defineTable({
    title: v.string(),
    content: v.string(),
    completed: v.boolean(),
    createdBy: v.id("users"),
    recurring: v.boolean(),
    lastCompleted: v.optional(v.number()),
  }).index("by_createdBy", ["createdBy"]),

  journal: defineTable({
    title: v.string(),
    content: v.string(),
    createdBy: v.optional(v.id("users")),
    createdAt: v.optional(v.number()),
  }).index("by_createdBy", ["createdBy"]),

  gifts: defineTable({
    url: v.string(),
    userId: v.id("users"),
    claimedAt: v.number(),
  }).index("by_user", ["userId"]),
});