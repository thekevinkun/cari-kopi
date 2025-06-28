import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/lib/db/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const user = token ? verifyToken(token) : null;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ user });
}
