import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run hourly to check for tasks that need to be reset
crons.hourly(
  "check-recurring-tasks",
  { minuteUTC: 0 }, // Run at the top of every hour
  internal.tasks.regenerateRecurringTasks
);

export default crons;