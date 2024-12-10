//self-care-app\convex\users.ts

import { ConvexError, v } from "convex/values";
import { internalMutation, query, mutation } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      image: args.image,
      isOnline: true,
      points: 0,
    });
  },
});

export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      image: args.image,
    });
  },
});

export const setUserOnline = internalMutation({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      console.log(`User not found for tokenIdentifier: ${args.tokenIdentifier}. Retrying later.`);
      return; // Avoid throwing an error
    }

    await ctx.db.patch(user._id, { isOnline: true });
  },
});


export const setUserOffline = internalMutation({
	args: { tokenIdentifier: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      console.log(`User not found for tokenIdentifier: ${args.tokenIdentifier}. Retrying later.`);
      return; // Avoid throwing an error
    }

		await ctx.db.patch(user._id, { isOnline: false });
	},
});

export const getUsers = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const users = await ctx.db.query("users").collect();
		return users.filter((user) => user.tokenIdentifier !== identity.tokenIdentifier);
	},
});

export const getMe = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();

		if (!user) {
			throw new ConvexError("User not found");
		}

		return user;
	},
});

//

/* export const awardPoints = mutation({
  args: { tokenIdentifier: v.string(), points: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const newPoints = (user.points ?? 0) + args.points;
    await ctx.db.patch(user._id, { points: newPoints });
  },
}); */

export const buyGift = mutation({
  args: { tokenIdentifier: v.string(), cost: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    if ((user.points ?? 0) < args.cost) {
      throw new ConvexError("Not enough points");
    }

    const availableImages = [
      "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg",
    ];

    if (availableImages.length === 0) throw new ConvexError("No gifts available");

    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    await ctx.db.patch(user._id, { points: (user.points ?? 0) - args.cost });

    return `/pictures/mental-health/${randomImage}`;
  },
});