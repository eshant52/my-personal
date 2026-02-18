import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  jwtSecret: process.env.JWT_SECRET || "fallback-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  uploadsDir: path.join(__dirname, "../../uploads"),
  dbPath: path.join(__dirname, "../../data.db"),
  defaultUsername: process.env.DEFAULT_USERNAME || "eshant",
  defaultPassword: process.env.DEFAULT_PASSWORD || "iloveyou",
};
