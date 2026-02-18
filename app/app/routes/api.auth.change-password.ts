import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import type { StringValue } from "ms";
import db from "~/.server/database";
import { config } from "~/.server/config";
import { verifyAuthToken, unauthorized } from "~/.server/auth";

interface UserRow {
  id: number;
  username: string;
  password: string;
  password_changed: number;
}

export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const decoded = verifyAuthToken(request);
  if (!decoded) {
    return unauthorized("No token provided");
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return Response.json(
      { message: "Current password and new password are required" },
      { status: 400 },
    );
  }

  if (newPassword.length < 4) {
    return Response.json(
      { message: "New password must be at least 4 characters" },
      { status: 400 },
    );
  }

  const user = db
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(decoded.userId) as UserRow | undefined;

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const isValidPassword = bcryptjs.compareSync(currentPassword, user.password);
  if (!isValidPassword) {
    return Response.json(
      { message: "Current password is incorrect" },
      { status: 401 },
    );
  }

  const hashedNewPassword = bcryptjs.hashSync(newPassword, 10);
  db.prepare(
    "UPDATE users SET password = ?, password_changed = 1 WHERE id = ?",
  ).run(hashedNewPassword, user.id);

  // Issue new token
  const newToken = jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as StringValue },
  );

  return Response.json({
    message: "Password changed successfully",
    token: newToken,
  });
}
