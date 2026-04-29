
import axios from "axios";

const API_URL = "/api/links/";

export const getUserLinks = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL + "my-links", config);
    return response.data;
  } catch (error) {
    console.error("API Error: Failed to fetch user links", error);
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error("An unexpected error occurred while fetching links.");
    }
  }
};
