import axiosClient from "../config/axiosClient.js";
import { retry } from "../utils/retry.js";

export const sendEmail = async ({
  toEmail,
  toName,
  subject,
  body,
}) => {
  return retry(async () => {
    try {
      const response = await axiosClient.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Kabeer",
            email: process.env.SENDER_EMAIL,
          },

          to: [
            {
              email: toEmail,
              name: toName,
            },
          ],

          subject,

          htmlContent: body,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("EMAIL SENT:", toEmail);

      return response.data;

    } catch (error) {
      console.log("BREVO ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      throw error;
    }
  });
};