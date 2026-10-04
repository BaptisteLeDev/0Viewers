import "server-only";
import { neon } from "@neondatabase/serverless";

// null without DATABASE_URL: fixtures, CI, Lighthouse run DB-less.
export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
