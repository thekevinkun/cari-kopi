import type { NextApiRequest, NextApiResponse } from "next";

import { isFavorite, removeFavorite } from "@/lib/db/favorite";
import { verifyToken } from "@/lib/db/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") return res.status(405).end("Method Not Allowed");

    const { placeId } = req.body;

    const token = req.cookies.token;
    
    const user = token ? verifyToken(token) : null;
    if (!user) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    const isFavoriteYet = await isFavorite(user.id, placeId);
    if (!isFavoriteYet) {
        return res.status(409).json({ error: "Its already not in your favorites!" });
    }

    await removeFavorite(user.id, placeId);

    return res.status(201).json({ message: "Removed from your favorites!" });
}