import path from "node:path";
import fs from "node:fs";
import { verifyAuthToken, unauthorized } from "~/.server/auth";
import { config } from "~/.server/config";

export async function loader({ request }: { request: Request }) {
  const decoded = verifyAuthToken(request);
  if (!decoded) return unauthorized();

  const filePath = path.join(config.uploadsDir, "photos/single/11.jpg");
  if (!fs.existsSync(filePath)) {
    return Response.json({ message: "Photo not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
