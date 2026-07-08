import { useState } from "react";
import { Send, Loader2, PenLine } from "lucide-react";
import { executePipeline } from "../api/pipelineApi";

const MERGE_FIELDS = ["{{name}}", "{{company}}", "{{title}}"];

function EmailEditor({ contacts }) {
  const [subject, setSubject] = useState("Quick question for {{company}}");
  const [body, setBody] = useState(
    `<p>Hi {{name}},</p>

<p>
I noticed you are working as {{title}} at {{company}}.
</p>

<p>
Would love to connect.
</p>

<p>
Regards,<br/>
Kabeer
</p>`
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  const handleSend = async () => {
    try {
      setLoading(true);
      setStatus(null);
      const result = await executePipeline(contacts, { subject, body });
      setStatus({
        type: "success",
        message: `${result.emailsSent} ${
          result.emailsSent === 1 ? "email" : "emails"
        } sent.`,
      });
    } catch (error) {
      console.log(error);
      setStatus({ type: "error", message: "Email sending failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!contacts.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <PenLine size={16} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">
          Nothing to send yet
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Find contacts above to draft and send outreach.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="subject"
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        Subject
      </label>
      <input
        id="subject"
        className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <label
        htmlFor="body"
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        Body
      </label>
      <textarea
        id="body"
        className="h-52 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        <span>Merge fields:</span>
        {MERGE_FIELDS.map((field) => (
          <code
            key={field}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600"
          >
            {field}
          </code>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send size={16} />
              Send emails
            </>
          )}
        </button>

        {status && (
          <p
            className={`text-sm ${
              status.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default EmailEditor;