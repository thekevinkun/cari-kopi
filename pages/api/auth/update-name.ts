import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { findUserById, updateName } from "@/lib/db/user";
import { validateName } from "@/lib/db/validation";
import { signToken } from "@/lib/db/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { id, name } = req.body;
    console.log("id: ", id);
    console.log("name: ", name);

    if (!id || !name) {
        return res.status(400).json({ error: "Missing id or name" });
    }

    const invalidName = validateName(name);
    if (invalidName) {
        return res.status(400).json({ error: invalidName });
    }

    await updateName(id, name);

    // Fetch fresh data
    const updatedUser = await findUserById(id);
    if (!updatedUser) {
        return res.status(401).json({ error: "Failed to get your account on update" });
    }

    // Create updated token
    const newToken = signToken(updatedUser);  

    // Set token cookie
    const cookie = serialize("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60, // 30d or 1h
    })

    // Set updated token cookie
    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({
        message: "Update name success.",
        user: {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email
        }
    });
}