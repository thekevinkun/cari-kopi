import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByUsername } from "@/lib/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const user = await findUserByUsername(username.toLowerCase());

    res.status(200).json({ available: !user });
  } catch (error) {
    console.error("check-username error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}