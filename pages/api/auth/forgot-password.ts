import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

import { sendEmailResetPasswordLink } from "@/lib/db/email";
import { findUserByEmail, updateToken } from "@/lib/db/user";
import { validateEmailFormat } from "@/lib/db/validation";

const EXPIRATION_MINUTES = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { email } = req.body;

    // Validate fields
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    // Check email format and availability
    const formatEmail = validateEmailFormat(email);
    if (formatEmail) {
        return res.status(400).json({ error: formatEmail });
    }

    const user  = await findUserByEmail(email);
    if (!user ) {
        return res.status(409).json({ error: "Sorry, can't find your account" });
    }

    // Generate verification code
    const generatedToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000);

    // Update user token
    await updateToken(email, generatedToken, expiresAt);
    
    const name = user?.name?.split(" ")[0] || "friend";

    // Send email
    await sendEmailResetPasswordLink(email, name, generatedToken);

    return res.status(201).json({ message: "We sent to your email a link to get back into your account." });
}