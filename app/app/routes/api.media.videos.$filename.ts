import path from "node:path";
import fs from "node:fs";
import { Readable } from "node:stream";
import { verifyAuthToken, unauthorized } from "~/.server/auth";
import { config } from "~/.server/config";
import type { Route } from "./+types/api.media.videos.$filename";

export async function loader({ request, params }: Route.LoaderArgs) {
  const decoded = verifyAuthToken(request);
  if (!decoded) return unauthorized();

  const safeFileName = path.basename(params.filename);
  const filePath = path.join(config.uploadsDir, "videos", safeFileName);

  if (!fs.existsSync(filePath)) {
    return Response.json({ message: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get("Range");

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new Response(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type": "video/mp4",
      },
    });
  }

  const stream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      "Content-Length": String(fileSize),
      "Content-Type": "video/mp4",
    },
  });
}
