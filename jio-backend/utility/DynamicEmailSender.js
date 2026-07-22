const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
const fs = require("fs");
const path = require("path");

async function updateTemplateHelper(templatePath, toReplaceObject) {
  // Resolve template path relative to this file to avoid cwd issues
  const resolvedPath = path.isAbsolute(templatePath)
    ? templatePath
    : path.join(__dirname, templatePath);

  let templateContent = await fs.promises.readFile(resolvedPath, "utf-8");

  const keyArrs = Object.keys(toReplaceObject);
  keyArrs.forEach((key) => {
    templateContent = templateContent.replace(
      `#{${key}}`,
      toReplaceObject[key],
    );
  });
  return templateContent;
}

async function emailSender(templatePath, recieverEmail, toReplaceObject) {
  try {
    // Check if email credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_SMTP_KEY) {
      console.warn("Email service not configured. Skipping email send.");
      console.warn(
        "Set GMAIL_USER and GMAIL_SMTP_KEY in .env file to enable emails.",
      );
      return;
    }

    const content = await updateTemplateHelper(templatePath, toReplaceObject);
    // thorugh which service you have to send the mail
    const gmailDetails = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_SMTP_KEY,
      },
    };
    const msg = {
      to: recieverEmail,
      from: process.env.GMAIL_USER,
      subject: "JioCinema - Verification",
      text: "",
      html: content,
    };
    const transporter = nodemailer.createTransport(gmailDetails);
    await transporter.sendMail(msg);
    console.log(`✅ Email sent successfully to ${recieverEmail}`);
  } catch (err) {
    // Don't throw - just log the error
    console.error("❌ Email sending failed:", err.message);
    console.error("Details:", err.response);
    // Don't throw the error - this prevents email failures from crashing the app
    return false;
  }
}

module.exports = emailSender;

module.exports = emailSender;
