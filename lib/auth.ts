import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(user: { _id: string, username: string, email: string }, remember?: boolean) {
  return jwt.sign(
    {
      id: user._id?.toString(),
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: remember ? "30d" : "1h" }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
  } catch {
    return null;
  }
}