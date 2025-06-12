import nodemailer from "nodemailer";

export async function sendEmailVerificationCode(email: string, verificationCode: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Carikopi" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        text: `Your Carikopi verification code is: ${verificationCode}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Welcome to Carikopi ☕</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #804A26">${verificationCode}</h1>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Sent verification email to ${email}`);
    } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

export async function sendEmailResetPasswordLink(email: string, name: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Carikopi" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Carikopi Password",
        text: `Your Carikopi account reset password link is: http://localhost:3000/reset?token=${token}`,
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Hi ${name},</h2>
                <p>You requested a password reset. Click the <a href="http://localhost:3000/reset?token=${token}" target="_blank">link</a> below to create a new one:</p>
                <h3><a href="http://localhost:3000/reset?token=${token}" target="_blank">Reset your password</a></h3>
                <p>This <a href="http://localhost:3000/reset?token=${token}" target="_blank">link</a> will expire in 10 minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Sent reset password link to ${email}`);
    } catch (error) {
        console.error("Failed to send email for reset password link:", error);
        throw new Error("Failed to send email for reset password link");
    }
}