// client/src/pages/HomePage.jsx

import React, { useState } from "react";
import createShortUrl from "../services/apiService"; // default import
import Spinner from "../components/Spinner";

const HomePage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [serverError, setServerError] = useState(""); // Server-side errors
  const [formErrors, setFormErrors] = useState({}); // Client-side validation errors
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // --- Client-side URL validation ---
  const validateUrl = () => {
    const errors = {};
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );

    if (!longUrl) {
      errors.longUrl = "URL field cannot be empty.";
    } else if (!urlPattern.test(longUrl)) {
      errors.longUrl = "Please enter a valid URL (e.g., https://example.com).";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCopied(false);
    setServerError("");
    setShortUrl(null);

    const validationErrors = validateUrl();
    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      const data = await createShortUrl(longUrl);

      // Adjust based on your API response structure
      // If API returns { success: true, data: { shortUrl: ... } }
      const short = data.data ? data.data.shortUrl : data.shortUrl;

      setShortUrl(short);
    } catch (err) {
      setServerError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
      <p className="text-lg text-slate-600 mb-6">
        Enter a long URL to make it short and easy to share!
      </p>

      <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-grow">
            <input
              type="text"
              placeholder="https://example.com"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (formErrors.longUrl) setFormErrors({});
              }}
              disabled={isLoading}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                formErrors.longUrl ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.longUrl && (
              <p className="text-red-500 text-sm text-left mt-1">
                {formErrors.longUrl}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 w-full sm:w-auto"
          >
            {isLoading ? <Spinner size="small" /> : "Shorten"}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 pt-6 border-t text-left">
            <div className="flex justify-between items-center bg-slate-100 p-3 rounded-md">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-md text-sm font-semibold ml-4"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {serverError && <p className="mt-4 text-red-500">{serverError}</p>}
      </div>
    </div>
  );
};

export default HomePage;
