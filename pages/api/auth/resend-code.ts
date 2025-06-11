// pages/api/auth/resend-code.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { findUserByEmail, sendEmailVerificationCode, updateNewCode } from "@/lib/db/user";
import { generateVerificationCode } from "@/utils/helpers";

const EXPIRATION_MINUTES = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.verified) {
    return res.status(400).json({ error: "User already verified" });
  }

  const newCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000); // 10 min from now

  await updateNewCode(email, newCode, expiresAt);

  await sendEmailVerificationCode(email, newCode);

  return res.status(200).json({ message: "Code resent" });
}