import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { verifyToken } from "@/lib/db/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.token;

  const user = token ? verifyToken(token) : null;

  if (!user) return res.status(401).json({ error: "Not authenticated" });

  return res.status(200).json({ user });
}