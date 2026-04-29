import axios from "axios";

/**
 * @desc    Sends a long URL to the backend API to be shortened.
 * @param   {string} longUrl The URL that the user wants to shorten.
 * @returns {Promise<object>} A promise that resolves to the data returned from the API.
 *          On success, this will be an object like: { success: true, data: { ...urlObject } }.
 *          On failure, the promise will be rejected with an error object.
 */
const createShortUrl = async (longUrl) => {
  try {
    const response = await axios.post("/api/shorten", { longUrl });
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to create short URL", error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export default createShortUrl;
