import jwt from "jsonwebtoken";
import { config } from "./config";

interface TokenPayload {
  userId: number;
  username: string;
}

/**
 * Verify JWT token from request and return payload.
 * Supports both Authorization header and ?token= query param.
 */
export function verifyAuthToken(request: Request): TokenPayload | null {
  let token: string | undefined;

  // Check Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Check query parameter (for img/video/audio tags)
  if (!token) {
    const url = new URL(request.url);
    const queryToken = url.searchParams.get("token");
    if (queryToken) {
      token = queryToken;
    }
  }

  if (!token) return null;

  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Return a 401 JSON response
 */
export function unauthorized(message = "Unauthorized") {
  return new Response(JSON.stringify({ message }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
