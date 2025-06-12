import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { findUserByResetToken, updatePassword } from "@/lib/db/user";
import { validatePassword } from "@/lib/db/validation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { token, password, confirmPassword } = req.body;

    const user  = await findUserByResetToken(token);
    if (!user ) {
        return res.status(409).json({ error: "Invalid token" });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    } 

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await updatePassword(token, hashedPassword);

    return res.status(201).json({ message: "Reset password success. You can try login with new password." });
}