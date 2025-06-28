import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmail } from "@/lib/db/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await findUserByEmail(email.toLowerCase());

    res.status(200).json({ available: !user });
  } catch (error) {
    console.error("check-username error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
