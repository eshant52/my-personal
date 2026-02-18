import path from "node:path";
import fs from "node:fs";
import { verifyAuthToken, unauthorized } from "~/.server/auth";
import { config } from "~/.server/config";
import type { Route } from "./+types/api.media.photos.$folder.$filename";

export async function loader({ request, params }: Route.LoaderArgs) {
  const decoded = verifyAuthToken(request);
  if (!decoded) return unauthorized();

  // Prevent directory traversal
  const safeFolderName = path.basename(params.folder);
  const safeFileName = path.basename(params.filename);
  const filePath = path.join(
    config.uploadsDir,
    "photos",
    safeFolderName,
    safeFileName,
  );

  if (!fs.existsSync(filePath)) {
    return Response.json({ message: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(safeFileName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
