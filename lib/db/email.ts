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