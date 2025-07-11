import type { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { serialize } from "cookie";

import { signToken } from "@/lib/db/auth";
import { findUserByEmail } from "@/lib/db/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, remember } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  // Try to find user by email
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: "Account does not exist" });
  }

  if (!user.verified) {
    return res.status(403).json({ error: "Account not verified" });
  }

  const isValidPassword = await compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ error: "You entered wrong password" });
  }

  // Generate jwt payload
  const token = signToken(user, remember);

  // Set token cookie
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60, // 30d or 1h
  });

  res.setHeader("Set-Cookie", cookie);

  return res.status(200).json({ message: "Login successful" });
}
