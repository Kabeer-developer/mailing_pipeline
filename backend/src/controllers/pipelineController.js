import { runPipeline } from "../pipeline/runPipeline.js";

export const previewPipeline = async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    const result = await runPipeline(domain, {
      sendEmails: false,
    });

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
    const { domain, email } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required",
      });
    }

    if (!email || !email.subject || !email.body) {
      return res.status(400).json({
        success: false,
        message: "Email subject and body are required",
      });
    }

    const result = await runPipeline(domain, {
      sendEmails: true,
      emailTemplate: email,
    });

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
