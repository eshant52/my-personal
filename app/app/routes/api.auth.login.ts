import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import type { StringValue } from "ms";
import db from "~/.server/database";
import { config } from "~/.server/config";

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

  const { username, password } = await request.json();

  if (!username || !password) {
    return Response.json(
      { message: "Username and password are required" },
      { status: 400 },
    );
  }

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as UserRow | undefined;

  if (!user) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isValidPassword = bcryptjs.compareSync(password, user.password);

  if (!isValidPassword) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as StringValue },
  );

  return Response.json({
    token,
    user: { id: user.id, username: user.username },
    passwordChanged: !!user.password_changed,
  });
}
