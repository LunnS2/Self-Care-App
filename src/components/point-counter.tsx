{/*"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PointCounter = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const getMe = useQuery(api.users.getMe);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="p-2 fixed bottom-0 m-2 right-0 rounded-md bg-card border border-border flex items-center">
      <span className="text-primary font-bold text-lg">Points:&nbsp;</span>
      <span className="text-xl font-semibold text-foreground">
        {getMe?.points ?? 0}
      </span>
    </div>
  );
};

export default PointCounter;*/}
