export const deduplicateContacts = (
  contacts
) => {
  const seen = new Set();

  return contacts.filter((contact) => {
    if (
      !contact.email ||
      seen.has(contact.email)
    ) {
      return false;
    }

    seen.add(contact.email);

    return true;
  });
};