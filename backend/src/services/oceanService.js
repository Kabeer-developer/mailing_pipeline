import axiosClient from "../config/axiosClient.js";
import { retry } from "../utils/retry.js";

export const getSimilarCompanies = async (domain) => {
  return retry(async () => {
    try {
      const response = await axiosClient.post(
        "https://api.ocean.io/v3/search/companies",
        {
          size: 5,

          companiesFilters: {
            lookalikeDomains: [domain],
          },
        },
        {
          headers: {
            "x-api-token": process.env.OCEAN_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("OCEAN SUCCESS");

      return response.data;

    } catch (error) {
      console.log("OCEAN ERROR");
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      throw error;
    }
  });
};