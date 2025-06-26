import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { deleteUserById } from "@/lib/db/user";
import { deleteUserFavorites } from "@/lib/db/favorite";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") return res.status(405).end();

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Missing user ID" });
    }

    // Delete all user favorites
    await deleteUserFavorites(id);

    // Delete user account
    await deleteUserById(id);

    // Remove the token by setting an expired cookie
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: -1, // expire it
    });

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({ message: "Account deleted successfully" });
}