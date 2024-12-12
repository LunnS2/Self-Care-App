// self-care-app\src\app\shop\page.tsx

"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const Shop = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch the logged-in user data
  const getMe = useQuery(api.users.getMe);
  const buyGift = useMutation(api.users.buyGift);

  const handleBuyGift = async () => {
    if (!getMe) return; // Safety check in case user data is still loading

    setLoading(true);
    setMessage(null); // Reset message before attempting purchase

    try {
      const giftUrl = await buyGift({
        tokenIdentifier: getMe.tokenIdentifier,
        cost: 10,
      });

      setMessage(`Congratulations! You received a gift: ${giftUrl}`);
    } catch (error: any) {
      setMessage(error.message || "An error occurred while buying the gift.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      
      {/* Loading State */}
      {!getMe ? (
        <p className="text-muted">Loading user data...</p>
      ) : (
        <div className="text-center bg-card p-6 rounded-lg shadow-lg">
          <p className="text-lg font-semibold mb-4">Points: {getMe.points}</p>
          
          {/* Buy Button */}
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

          {/* Message Section */}
          {message && (
            <div className="mt-4 text-sm">
              {message.startsWith("Congratulations") ? (
                <a
                  href={message.split(" ").pop()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  🎁 View Your Gift
                </a>
              ) : (
                <p className="text-red-500">{message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
