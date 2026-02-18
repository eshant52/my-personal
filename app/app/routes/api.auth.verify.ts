import { verifyAuthToken } from "~/.server/auth";

export async function loader({ request }: { request: Request }) {
  const decoded = verifyAuthToken(request);

  if (!decoded) {
    return Response.json({ valid: false }, { status: 401 });
  }

  return Response.json({
    valid: true,
    user: { id: decoded.userId, username: decoded.username },
  });
}
