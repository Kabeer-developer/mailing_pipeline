import axiosClient from "../config/axiosClient.js";
import { retry } from "../utils/retry.js";

const DECISION_MAKER_TITLES = [
  "CEO",
  "Chief Executive",
  "Founder",
  "Co-Founder",
  "Owner",
  "VP",
  "Vice President",
  "Head",
  "Director",
];

const HR_TITLES = [
  "HR",
  "Human Resources",
  "HR Manager",
  "HR Director",
  "Head of HR",
  "People",
  "People Operations",
  "People & Culture",
  "Talent Acquisition",
  "Recruiter",
];

export const searchPersons = async (
  companyDomain,
  targetType = "decision_makers"
) => {
  return retry(async () => {
    try {

      const filters = {
        company: {
          websites: {
            include: [companyDomain],
          },
        },
      };

      /*
       * Decision Makers
       */
      if (targetType === "decision_makers") {
        filters.person_job_title = {
          include: DECISION_MAKER_TITLES,
          match_mode: "CONTAINS",
        };
      }

      /*
       * HR
       */
      if (targetType === "hr") {
        filters.person_job_title = {
          include: HR_TITLES,
          match_mode: "CONTAINS",
        };
      }

      /*
       * Everyone
       *
       * No person job-title filter is added.
       * Prospeo can therefore return people
       * associated with the company.
       */
      if (targetType === "everyone") {
        // Intentionally no person title filter
      }

      const response = await axiosClient.post(
        "https://api.prospeo.io/search-person",
        {
          filters,
          page: 1,
        },
        {
          headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `PROSPEO SUCCESS FOR ${companyDomain} (${targetType})`
      );

      return response.data;

    } catch (error) {

      console.log("PROSPEO SEARCH ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      if (
        error.response?.data?.error_code === "NO_RESULTS"
      ) {
        return {
          results: [],
        };
      }

      throw error;
    }
  });
};

export const enrichPerson = async (personId) => {
  return retry(async () => {
    try {

      const response = await axiosClient.post(
        "https://api.prospeo.io/enrich-person",
        {
          only_verified_email: true,

          data: {
            person_id: personId,
          },
        },
        {
          headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("PROSPEO ENRICH SUCCESS");

      return response.data;

    } catch (error) {

      console.log("PROSPEO ENRICH ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      /*
       * A person may exist but have no matching
       * verified email. In that case we simply
       * skip that person.
       */
      if (
        error.response?.data?.error_code === "NO_MATCH"
      ) {
        return null;
      }

      return null;
    }
  });
};