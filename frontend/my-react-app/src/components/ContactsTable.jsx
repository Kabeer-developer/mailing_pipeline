import { useState } from "react";
import {
  Mail,
  Trash2,
  Plus,
  X,
} from "lucide-react";

function ContactsTable({
  contacts,
  onRemove,
  onAdd,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  const [newContact, setNewContact] = useState({
    name: "",
    company: "",
    title: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (
      !newContact.name.trim() ||
      !newContact.company.trim() ||
      !newContact.email.trim()
    ) {
      return;
    }

    onAdd({
      name: newContact.name.trim(),
      company: newContact.company.trim(),
      title: newContact.title.trim(),
      email: newContact.email.trim(),
    });

    setNewContact({
      name: "",
      company: "",
      title: "",
      email: "",
    });

    setShowAddForm(false);
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">

        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {contacts.length}
          </span>{" "}
          {contacts.length === 1
            ? "contact"
            : "contacts"}{" "}
          found
        </p>

        <button
          type="button"
          onClick={() =>
            setShowAddForm((prev) => !prev)
          }
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          {showAddForm ? (
            <>
              <X size={15} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={15} />
              Add Contact
            </>
          )}
        </button>

      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4"
        >

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Add Contact
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Add a contact manually to the final
              outreach list.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">

            {/* Name */}
            <input
              type="text"
              name="name"
              value={newContact.name}
              onChange={handleChange}
              placeholder="Name"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            />

            {/* Company */}
            <input
              type="text"
              name="company"
              value={newContact.company}
              onChange={handleChange}
              placeholder="Company"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            />

            {/* Title */}
            <input
              type="text"
              name="title"
              value={newContact.title}
              onChange={handleChange}
              placeholder="Job title"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleChange}
              placeholder="Email address"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            />

          </div>

          <div className="mt-4 flex justify-end">

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={15} />
              Add to List
            </button>

          </div>

        </form>
      )}

      {/* Empty State */}
      {!contacts.length ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-12 text-center">

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Mail
              size={16}
              className="text-slate-400"
            />
          </div>

          <p className="text-sm font-medium text-slate-600">
            No contacts yet
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Run the pipeline or add a contact
            manually.
          </p>

        </div>
      ) : (

        /* Contacts Table */
        <div className="overflow-x-auto rounded-lg border border-slate-200">

          <table className="w-full text-left text-sm">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="p-3 font-medium text-slate-500">
                  Name
                </th>

                <th className="p-3 font-medium text-slate-500">
                  Company
                </th>

                <th className="p-3 font-medium text-slate-500">
                  Title
                </th>

                <th className="p-3 font-medium text-slate-500">
                  Email
                </th>

                <th className="p-3 text-right font-medium text-slate-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {contacts.map((contact, index) => (

                <tr
                  key={
                    contact.email ?? index
                  }
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >

                  <td className="p-3 font-medium text-slate-900">
                    {contact.name || "-"}
                  </td>

                  <td className="p-3 text-slate-600">
                    {contact.company || "-"}
                  </td>

                  <td className="p-3 text-slate-600">
                    {contact.title || "-"}
                  </td>

                  <td className="p-3 font-mono text-xs text-slate-600">
                    {contact.email}
                  </td>

                  <td className="p-3 text-right">

                    <button
                      type="button"
                      onClick={() =>
                        onRemove(contact.email)
                      }
                      title="Remove contact"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default ContactsTable;