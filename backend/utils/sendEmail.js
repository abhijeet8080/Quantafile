// utils/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmail(emailDetails) {
  const { to, subject, htmlBody } = emailDetails;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `Quantafile <${process.env.SMTP_MAIL}>`,
      to,
      subject,
      html: htmlBody,
    });

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}
