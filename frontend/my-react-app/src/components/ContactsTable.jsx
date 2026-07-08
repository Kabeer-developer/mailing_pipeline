import { Mail } from "lucide-react";

function ContactsTable({ contacts }) {
  if (!contacts.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Mail size={16} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600">No contacts yet</p>
        <p className="mt-1 text-sm text-slate-400">
          Run the pipeline on a domain to populate this table.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-4 text-sm text-slate-500">
        <span className="font-semibold text-slate-900">{contacts.length}</span>{" "}
        {contacts.length === 1 ? "contact" : "contacts"} found
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-3 font-medium text-slate-500">Name</th>
              <th className="p-3 font-medium text-slate-500">Company</th>
              <th className="p-3 font-medium text-slate-500">Title</th>
              <th className="p-3 font-medium text-slate-500">Email</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((contact, index) => (
              <tr
                key={contact.email ?? index}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <td className="p-3 font-medium text-slate-900">
                  {contact.name}
                </td>
                <td className="p-3 text-slate-600">{contact.company}</td>
                <td className="p-3 text-slate-600">{contact.title}</td>
                <td className="p-3 font-mono text-xs text-slate-600">
                  {contact.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContactsTable;