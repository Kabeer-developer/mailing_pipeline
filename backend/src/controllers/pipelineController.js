import { runPipeline } from "../pipeline/runPipeline.js";
import { sendEmail } from "../services/brevoService.js";

export const previewPipeline = async (req, res) => {
  try {
    const {
      domain,
      targetType = "decision_makers",
    } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    const allowedTargetTypes = [
      "decision_makers",
      "hr",
      "everyone",
    ];

    if (!allowedTargetTypes.includes(targetType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid targetType. Use decision_makers, hr, or everyone.",
      });
    }

    const result = await runPipeline(
      domain,
      targetType
    );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("PREVIEW PIPELINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const executePipeline = async (req, res) => {
  try {
    const {
      contacts,
      email,
    } = req.body;

    if (!contacts?.length) {
      return res.status(400).json({
        success: false,
        message: "Contacts are required",
      });
    }

    if (!email?.subject || !email?.body) {
      return res.status(400).json({
        success: false,
        message:
          "Email subject and body are required",
      });
    }

    let emailsSent = 0;

    for (const contact of contacts) {

      if (!contact.email) {
        continue;
      }

      const subject = email.subject
        .replaceAll(
          "{{name}}",
          contact.name || ""
        )
        .replaceAll(
          "{{company}}",
          contact.company || ""
        )
        .replaceAll(
          "{{title}}",
          contact.title || ""
        );

      const body = email.body
        .replaceAll(
          "{{name}}",
          contact.name || ""
        )
        .replaceAll(
          "{{company}}",
          contact.company || ""
        )
        .replaceAll(
          "{{title}}",
          contact.title || ""
        );

      await sendEmail({
        toEmail: contact.email,
        toName: contact.name || "",
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
    console.error("EXECUTE PIPELINE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};