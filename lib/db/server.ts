import "server-only";

import { createDatabase } from "./index";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const db = createDatabase(connectionString);
