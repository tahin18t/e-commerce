import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

export default async function EmailSend(EmailTo, EmailText, EmailSubject) {

    const senderOptions = {
        from: { address: process.env.GMAIL_EMAIL, name: "E-commerce OTP" },
        to: EmailTo,
        subject: EmailSubject,
        html: EmailText,
    };

    // 1️⃣ Personal Gmail Transport
    const gmailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASS,
        }
    });

    // 2️⃣ Mailtrap API Transport
    const mailtrapTransport = nodemailer.createTransport(
        MailtrapTransport({ token: process.env.API_TOKEN })
    );

    // Try transports in sequence
    try {
        return await gmailTransport.sendMail({ ...senderOptions, from: process.env.GMAIL_EMAIL });
    } catch (err1) {
        console.log("Gmail Failed ❌", err1.message);
        try {
            return await mailtrapTransport.sendMail({ ...senderOptions, from: process.env.MAIL_TRAP_EMAIL });
        } catch (err3) {
            console.log("Mailtrap Failed ❌", err3.message);
            return { status: "error", message: "All email transports failed", logs: [err1.message, err2.message, err3.message] };
        }
    }
}


// SMTP Transport
// const smtpTransport = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD,
//     },
//     tls: { rejectUnauthorized: false }
// });
// return await smtpTransport.sendMail({ ...senderOptions, from: process.env.SMTP_EMAIL });