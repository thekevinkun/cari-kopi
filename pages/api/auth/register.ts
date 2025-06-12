import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

import { sendEmailVerificationCode } from "@/lib/db/email";
import { findUserByEmail, createUser } from "@/lib/db/user";
import { validateName, validateEmailFormat, validatePassword } from "@/lib/db/validation";

import { generateVerificationCode, toTitleCase } from "@/utils/helpers";

const EXPIRATION_MINUTES = 10;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { name, email, password, confirmPassword } = req.body;

    // Validate fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const invalidName = validateName(name);
    if (invalidName) {
        return res.status(400).json({ error: invalidName });
    }

    // Check email format and availability
    const formatEmail = validateEmailFormat(email);
    if (formatEmail) {
        return res.status(400).json({ error: formatEmail });
    }

    const existingEmail  = await findUserByEmail(email);
    if (existingEmail ) {
        return res.status(409).json({ error: "Email already registered" });
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

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000);

    // Create user
    await createUser({
        name: toTitleCase(name),
        email,
        passwordHash: hashedPassword,
        verified: false,
        verificationCode,
        verificationExpires: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
    });

    // Send email
    await sendEmailVerificationCode(email, verificationCode);

    return res.status(201).json({ message: "User registered. Check email for verification code." });
}