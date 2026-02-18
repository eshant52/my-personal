import path from "node:path";
import fs from "node:fs";
import { verifyAuthToken, unauthorized } from "~/.server/auth";
import { config } from "~/.server/config";
import type { Route } from "./+types/api.media.music.$filename";

export async function loader({ request, params }: Route.LoaderArgs) {
  const decoded = verifyAuthToken(request);
  if (!decoded) return unauthorized();

  const safeFileName = path.basename(params.filename);
  const filePath = path.join(config.uploadsDir, "music", safeFileName);

  if (!fs.existsSync(filePath)) {
    return Response.json({ message: "Music file not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(safeFileName).toLowerCase();
  const mimeType = ext === ".mp3" ? "audio/mpeg" : "audio/ogg";

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
