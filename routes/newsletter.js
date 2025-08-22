import express from 'express';
import nodemailer from 'nodemailer';
const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password (not your regular email password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Velamore',
      html: `
        <h2>Welcome to Velamore 👕</h2>
        <p>Thanks for subscribing to our newsletter!</p>
        <p>Explore premium-quality T-shirts crafted with elegance and comfort in mind.</p>
        <a href="http://localhost:3000" style="padding: 10px 20px; background: black; color: white; text-decoration: none; border-radius: 5px;">Explore Now</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Newsletter email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default router;
