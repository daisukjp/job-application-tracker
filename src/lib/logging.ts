export function logError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.error("DEV ERROR:", error, context);
  } else {
    console.error("PROD ERROR:", error, context);
  }
}
