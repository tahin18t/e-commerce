import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

// when I have a smtp server
/*const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: Email,
        pass: Password,
    }
})*/
// using personal gmail and password
/* const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.DEV_EMAIL,
        pass: process.env.DEV_PASSWORD,
    }
})
 */

export default async function EmailSend (EmailTo, EmailText, EmailSubject) {

    let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls:{
            rejectUnauthorized: false,
        }
    })

    let mailOptions = {
        from: "MERN Ecommerce Solution <info@teamrabbil.com>",
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText,
    }
    return await transport.sendMail(mailOptions);
}