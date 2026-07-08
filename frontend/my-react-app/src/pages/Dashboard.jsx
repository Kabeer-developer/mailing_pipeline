import { useState } from "react";
import { Search, Loader2, ArrowRight, Check } from "lucide-react";

import { runPipeline } from "../api/pipelineApi";

import ContactsTable from "../components/ContactsTable";
import EmailEditor from "../components/EmailEditor";

const STAGES = ["Domain", "Discover", "Enrich", "Contacts"];

function Dashboard() {
  const [domain, setDomain] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Derive which pipeline stage we're at — purely presentational,
  // reflects the same state the logic already tracks.
  const stageIndex = loading
    ? 2
    : contacts.length > 0
    ? 3
    : domain
    ? 1
    : 0;

  const handleRun = async () => {
    if (!domain) {
      setError("Enter a domain to get started.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const data = await runPipeline(domain);
      setContacts(data.contacts);
    } catch (err) {
      console.log(err);
      setError("Couldn't fetch contacts. Check the domain and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRun();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Outreach Pipeline
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Find leads, then reach them
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter a company domain to discover verified contacts and draft outreach.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* DOMAIN INPUT */}
          <div className="border-b border-slate-100 p-8">
            <label
              htmlFor="domain"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Company domain
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="domain"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="example: openai.com"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <button
                onClick={handleRun}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Finding leads
                  </>
                ) : (
                  <>
                    Find leads
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-2.5 text-sm text-red-600">{error}</p>
            )}

            {/* PIPELINE STAGE TRACKER — signature element: shows real progress, not decoration */}
            <div className="mt-7 flex items-center">
              {STAGES.map((stage, i) => {
                const done = i < stageIndex;
                const active = i === stageIndex;
                return (
                  <div key={stage} className="flex flex-1 items-center last:flex-none">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                          done
                            ? "bg-indigo-600 text-white"
                            : active
                            ? "border-2 border-indigo-600 text-indigo-600"
                            : "border-2 border-slate-200 text-slate-300"
                        }`}
                      >
                        {done ? <Check size={12} /> : i + 1}
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          done || active ? "text-slate-700" : "text-slate-300"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div
                        className={`mx-3 h-px flex-1 ${
                          done ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONTACT PREVIEW */}
          <div className="p-8">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Contacts
            </h2>
            <ContactsTable contacts={contacts} />
          </div>
        </div>

        {/* EMAIL SENDING */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Outreach email
          </h2>
          <EmailEditor contacts={contacts} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;