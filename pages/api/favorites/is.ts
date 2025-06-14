import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from "next";

import { addFavorite, isFavorite } from "@/lib/db/favorite";
import { verifyToken } from "@/lib/db/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { placeId } = req.query;

    if (!placeId || typeof placeId !== "string") {
        return res.status(400).json({ error: "Invalid placeId" });
    }
    
    const token = req.cookies.token;

    const user = token ? verifyToken(token) : null;
    if (!user) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    const isFavoriteYet = await isFavorite(user.id, placeId);

    return res.status(200).json({ isFavorite: !!isFavoriteYet });
}