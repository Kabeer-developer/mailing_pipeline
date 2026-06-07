import axiosClient from "../config/axiosClient.js";
import { retry } from "../utils/retry.js";

export const searchPersons = async (companyDomain) => {
  return retry(async () => {
    try {
      const response = await axiosClient.post(
        "https://api.prospeo.io/search-person",
        {
          filters: {
            company: {
              websites: {
                include: [companyDomain]
              }
            }
          },
          page: 1
        },
        {
          headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log(`PROSPEO SUCCESS FOR ${companyDomain}`);

      return response.data;

    } catch (error) {
      console.log("PROSPEO SEARCH ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      if (error.response?.data?.error_code === "NO_RESULTS") {
        return [];
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
            person_id: personId
          }
        },
        {
          headers: {
            "X-KEY": process.env.PROSPEO_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("PROSPEO ENRICH SUCCESS");

      return response.data;

    } catch (error) {
      console.log("PROSPEO ENRICH ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      return null;
    }
  });
};