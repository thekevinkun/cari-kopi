import type { NextApiRequest, NextApiResponse } from "next";

import { getFavoritesByUser } from "@/lib/db/favorite";
import { verifyToken } from "@/lib/db/auth";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;
    
    const user = token ? verifyToken(token) : null;
    if (!user) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    const userFavorites = await getFavoritesByUser(user.id);

    const details = await Promise.all(
        userFavorites.map(async ({ placeId }) => {
            try {
                const res = await fetch(`${BASE_URL}/api/detailSerp?placeId=${placeId}`);
                const json = await res.json();
                return json.data;
            } catch {
                return null;
            }
        })
    );

    return res.status(200).json({ favorites: details.filter(Boolean) });
}