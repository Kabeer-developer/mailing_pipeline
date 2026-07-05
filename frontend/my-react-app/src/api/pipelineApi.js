import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/pipeline",
});


export const runPipeline = async (domain) => {

  const response = await API.post(
    "/run",
    {
      domain
    }
  );

  return response.data.data;
};


export const executePipeline = async (
  contacts,
  email
) => {

  const response = await API.post(
    "/execute",
    {
      contacts,
      email
    }
  );

  return response.data;
};