// pages/api/auth/verify.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { signToken } from "@/lib/auth";
import { findUserByEmailAndCode, markUserAsVerified } from "@/lib/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ error: "Email and code are required" });

  // Check user verification code
  const user = await findUserByEmailAndCode(email, code);
  if (!user) 
    return res.status(400).json({ error: "Invalid verification code" });

  // Check expire of code
  const now = new Date();
  const expiry = user.verificationExpires ? new Date(user.verificationExpires) : null;
  if (!expiry || now > expiry)
    return res.status(400).json({ error: "Verification code expired" });

  await markUserAsVerified(email);

  // Generate jwt payload
  const token = signToken(user);

  // Set token cookie
  const cookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1h
  })

  res.setHeader("Set-Cookie", cookie);

  return res.status(200).json({ message: "Your email has been verified. You can now log in." });
}
