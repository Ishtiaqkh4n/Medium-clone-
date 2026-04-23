import { Resend } from 'resend';
import { ApiError } from '../utils/api-Error';

const resend = new Resend(process.env.RESEND_API_KEY);

export const otpMailSender = async (otp, receiverMail) => {
  try {
    const response = await resend.emails.send({
      from: process.env.OWNER_MAIL,
      to: receiverMail,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP Code</h2>
          <p>Your OTP is:</p>
          <h1 style="color: #4CAF50;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error sending OTP email:", error);

   throw new ApiError(500,"Unable to send otp , please try again")
  }
};