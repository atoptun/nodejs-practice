import express, { Router, type Request, type Response } from "express";
import nodemailer from "nodemailer";

type SendFormBody = {
  to?: string;
  subject?: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const router = Router();

export default router;

router.get("/", (_req: Request, res: Response) => {
  res.send(`
    <h2>Send Email</h2>
    <form action="/mailer/send" method="POST">
      <input type="email" name="to" placeholder="Recipient email" required />
      <br><br>
      <input type="text" name="subject" placeholder="Subject" required />
      <br><br>
      <textarea name="text" placeholder="Message" required></textarea>
      <br><br>
      <button type="submit">Send</button>
    </form>
  `);
});

router.post(
  "/send",
  express.urlencoded({ extended: false }),
  async (req: Request<{}, {}, SendFormBody>, res: Response) => {
    const { to, subject, text } = req.body;

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      res.json({
        message: "Email sent",
        messageId: info.messageId,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }
  },
);
