import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
export const db = drizzle(client);
