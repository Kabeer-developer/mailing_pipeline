import { getSimilarCompanies } from "../services/oceanService.js";
import { searchPersons, enrichPerson } from "../services/prospeoService.js";
import { sendEmail } from "../services/brevoService.js";
import { delay } from "../utils/delay.js";

const getDecisionMaker = (people) => {
  return people.find((item) => {
    const title = item.person?.current_job_title?.toLowerCase() || "";

    return (
      title.includes("ceo") ||
      title.includes("chief executive") ||
      title.includes("founder") ||
      title.includes("co-founder") ||
      title.includes("owner") ||
      title.includes("vp") ||
      title.includes("vice president") ||
      title.includes("head") ||
      title.includes("director")
    );
  });
};

export const runPipeline = async (
  domain,
  { sendEmails = false, emailTemplate = null } = {},
) => {
  const oceanResponse = await getSimilarCompanies(domain);

  const companies = oceanResponse.companies.slice(0, 5).map((item) => ({
    name: item.company.name,
    domain: item.company.domain,
  }));

  const contacts = [];

  for (const company of companies) {
    await delay(3500);

    const people = await searchPersons(company.domain);

    if (!people?.results?.length) continue;

    const decisionMaker = getDecisionMaker(people.results);

    if (!decisionMaker) continue;

    const enriched = await enrichPerson(decisionMaker.person.person_id);

    if (!enriched) continue;

    if (!enriched?.person?.email?.email) continue;

    contacts.push({
      company: company.name,
      domain: company.domain,
      name: enriched.person.full_name,
      title: enriched.person.current_job_title,
      email: enriched.person.email.email,
    });
  }

  const uniqueContacts = [
    ...new Map(contacts.map((contact) => [contact.email, contact])).values(),
  ];

  // SAFETY CHECKPOINT
  if (!sendEmails) {
    return {
      readyToSend: true,
      warning: "Preview mode. No emails have been sent.",
      contactsFound: uniqueContacts.length,
      contacts: uniqueContacts,
    };
  }

  let emailsSent = 0;

  for (const contact of uniqueContacts) {
    const subject = emailTemplate.subject
      .replaceAll("{{name}}", contact.name)
      .replaceAll("{{company}}", contact.company)
      .replaceAll("{{title}}", contact.title);

    const body = emailTemplate.body
      .replaceAll("{{name}}", contact.name)
      .replaceAll("{{company}}", contact.company)
      .replaceAll("{{title}}", contact.title);

    await sendEmail({
      toEmail: contact.email,
      toName: contact.name,
      companyName: contact.company,
      subject,
      body,
    });

    emailsSent++;
  }

  return {
    success: true,
    emailsSent,
    contactsFound: uniqueContacts.length,
  };
};
