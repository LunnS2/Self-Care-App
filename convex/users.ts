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

export const buyGift = mutation({
  args: { tokenIdentifier: v.string(), cost: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) throw new ConvexError("User not found");
    if ((user.points ?? 0) < args.cost) throw new ConvexError("Not enough points");

    const availableImages = [
      "cat-image-1.jpg", "cat-image-2.jpg", "cat-image-3.jpg", "cat-image-4.jpg", "cat-image-5.jpg", "cat-image-6.jpg", "cat-image-7.jpg", "cat-image-8.jpg", "cat-image-9.jpg", "cat-image-10.jpg", "cat-image-11.jpg", "cat-image-12.jpg", "cat-image-13.jpg", "cat-image-14.jpg", "cat-image-15.jpg", "cat-image-16.jpg", "cat-image-17.jpg", "cat-image-18.jpg", "cat-image-19.jpg", "cat-image-20.jpg", "cat-image-21.jpg", "cat-image-22.jpg"
    ];

    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const giftUrl = `/pictures/mental-health/${randomImage}`;

    await ctx.db.insert("gifts", {
      url: giftUrl,
      userId: user._id,
      claimedAt: Date.now()
    });

    await ctx.db.patch(user._id, { 
      points: (user.points ?? 0) - args.cost 
    });

    return giftUrl;
  },
});