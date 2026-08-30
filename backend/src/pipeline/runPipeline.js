import { getSimilarCompanies } from "../services/oceanService.js";
import {
  searchPersons,
  enrichPerson,
} from "../services/prospeoService.js";
import { delay } from "../utils/delay.js";

const MAX_PEOPLE_PER_COMPANY = 5;

export const runPipeline = async (
  domain,
  targetType = "decision_makers"
) => {

  const oceanResponse =
    await getSimilarCompanies(domain);

  const companies =
    oceanResponse?.companies
      ?.slice(0, 5)
      .map((item) => ({
        name: item.company.name,
        domain: item.company.domain,
      })) || [];

  const contacts = [];

  for (const company of companies) {

    /*
     * Respect Prospeo rate limits.
     */
    await delay(3500);

    const people =
      await searchPersons(
        company.domain,
        targetType
      );

    if (!people?.results?.length) {
      continue;
    }

    /*
     * Limit the number of people we enrich.
     *
     * This is especially important for
     * "everyone" because a company may have
     * many employees.
     */
    const peopleToEnrich =
      people.results.slice(
        0,
        MAX_PEOPLE_PER_COMPANY
      );

    for (const personResult of peopleToEnrich) {

      const person =
        personResult?.person;

      if (!person?.person_id) {
        continue;
      }

      /*
       * Keep requests spaced out because
       * Prospeo Enrich has its own rate limit.
       */
      await delay(3500);

      const enriched =
        await enrichPerson(
          person.person_id
        );

      if (!enriched) {
        continue;
      }

      const email =
        enriched?.person?.email?.email;

      if (!email) {
        continue;
      }

      contacts.push({
        company: company.name,
        domain: company.domain,
        name:
          enriched.person.full_name ||
          person.full_name ||
          "",
        title:
          enriched.person.current_job_title ||
          person.current_job_title ||
          "",
        email,
      });
    }
  }

  /*
   * Remove duplicate contacts by email.
   */
  const uniqueContacts = [
    ...new Map(
      contacts.map((contact) => [
        contact.email.toLowerCase(),
        contact,
      ])
    ).values(),
  ];

  return {
    readyToSend: true,

    warning:
      "Preview mode. No emails have been sent.",

    targetType,

    companiesFound:
      companies.length,

    contactsFound:
      uniqueContacts.length,

    contacts:
      uniqueContacts,
  };
};