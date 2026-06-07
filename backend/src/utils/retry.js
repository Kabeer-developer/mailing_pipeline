import { delay } from "./delay.js";

export const retry = async (
  fn,
  retries = 3,
  wait = 2000
) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i < retries - 1) {
        await delay(wait);
      }
    }
  }

  throw lastError;
};