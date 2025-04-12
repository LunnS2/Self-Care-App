"use client";

import React, { useState, useEffect } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Image from "next/image";

const Shop = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const getMe = useQuery(api.users.getMe);

  const gifts =
    useQuery(
      api.gifts.getByUser,
      getMe?._id ? { userId: getMe._id } : "skip"
    ) ?? [];

  const buyGift = useMutation(api.users.buyGift);

  useEffect(() => {
    if (gifts.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % gifts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gifts.length]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const handleBuyGift = async () => {
    if (!getMe) return;

    setLoading(true);
    setMessage(null);

    try {
      const giftUrl = await buyGift({
        tokenIdentifier: getMe.tokenIdentifier,
        cost: 10,
      });

      setMessage(`Congratulations! You received a gift: ${giftUrl}`);
    } catch (error: unknown) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while buying the gift."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8 ml-16 md:ml-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Shop</h1>

      {!getMe ? (
        <p className="text-muted">Loading user data...</p>
      ) : (
        <div className="text-center bg-card p-6 rounded-lg shadow-lg w-full max-w-lg">
          <p className="text-lg font-semibold mb-4">
            Points: {getMe.points ?? 0}
          </p>

          <button
            onClick={handleBuyGift}
            disabled={loading || (getMe.points ?? 0) < 10}
            className={`w-full px-4 py-2 rounded-md text-primary-foreground font-semibold transition ${
              loading || (getMe.points ?? 0) < 10
                ? "bg-muted cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? "Processing..." : "Buy Gift (10 Points)"}
          </button>

          {message && (
            <div className="mt-4 text-sm">
              {message.startsWith("Congratulations") ? (
                <a
                  href={message.split(" ").pop()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  🎁 View Your New Gift
                </a>
              ) : (
                <p className="text-red-500">{message}</p>
              )}
            </div>
          )}

          {gifts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Your Gift Collection</h2>
              <div className="relative w-full aspect-[1/1] max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-lg">
                {gifts.map((gift, index) => (
                  <div
                    key={gift._id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={gift.url}
                        alt={`Gift ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 256px"
                        className="object-cover"
                        priority={index === 0}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center">
                        <p className="text-white text-sm">
                          Gift #{gifts.length - index} •{" "}
                          {new Date(gift.claimedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {gifts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      activeIndex === index ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
