import { runPipeline } from "../pipeline/runPipeline.js";
import { sendEmail } from "../services/brevoService.js";

export const previewPipeline = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    const result = await runPipeline(domain);

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const executePipeline = async (req, res) => {
  try {
    const { contacts, email } = req.body;

    if (!contacts?.length) {
      return res.status(400).json({
        success: false,
        message: "Contacts are required",
      });
    }

    if (!email?.subject || !email?.body) {
      return res.status(400).json({
        success: false,
        message: "Email subject and body are required",
      });
    }

    let emailsSent = 0;

    for (const contact of contacts) {

      const subject = email.subject
        .replaceAll("{{name}}", contact.name)
        .replaceAll("{{company}}", contact.company)
        .replaceAll("{{title}}", contact.title);

      const body = email.body
        .replaceAll("{{name}}", contact.name)
        .replaceAll("{{company}}", contact.company)
        .replaceAll("{{title}}", contact.title);

      await sendEmail({
        toEmail: contact.email,
        toName: contact.name,
        subject,
        body,
      });

      emailsSent++;
    }

    res.status(200).json({
      success: true,
      emailsSent,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};