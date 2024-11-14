//self-care-app\convex\schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		name: v.optional(v.string()),
		email: v.string(),
		image: v.string(),
		tokenIdentifier: v.string(),
		isOnline: v.boolean(),
	}).index("by_tokenIdentifier", ["tokenIdentifier"]),
	tasks: defineTable({
		title: v.string(),
		content: v.string(),
		completed: v.boolean(),
		createdBy: v.string(),
		recurring: v.boolean()
	}).index("by_createdBy", ["createdBy"]),
	journal: defineTable({
		title: v.string(),
		content: v.string(),
		createdBy: v.string(),
  	createdAt: v.number(),
	}).index("by_createdBy", ["createdBy"])
});