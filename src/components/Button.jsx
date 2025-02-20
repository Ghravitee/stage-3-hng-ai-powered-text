/* eslint-disable react/prop-types */
import { useState } from "react";
import summarizeText from "../api/summarizeText";

export default function Button({ message, updateMessage }) {
  // State for tracking loading status
  const [loading, setLoading] = useState(false);

  // State for tracking errors
  const [error, setError] = useState("");

  // Function to handle summarization when the button is clicked
  const handleSummarize = async () => {
    setLoading(true);
    setError(""); // Reset error before making a request

    try {
      // Simulate a short delay before calling the summarization API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the summarization function with the input message
      const summaryResult = await summarizeText({ text: message.text });

      // Handle errors returned by the API
      if (summaryResult.error) {
        setError(summaryResult.error);
      } else if (summaryResult.summary) {
        updateMessage(
          message.text, // Original text
          summaryResult.summary, // Summary
          message.detectedLanguage, // Detected language of the original text
          "en"
        );

        // Handle cases where no summary was returned
      } else {
        setError("No summary was generated. Please try again.");
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError("Something went wrong while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 relative">
      {message.actions?.includes("Summarize") && (
        <button
          className="px-3 py-1 bg-yellow-500 text-black font-bold rounded cursor-pointer flex items-center"
          onClick={handleSummarize}
          disabled={loading}
        >
          Summarize
          {loading && (
            <span className="ml-2 w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          )}
        </button>
      )}

      {/* Display error message if there's an error */}
      {error && (
        <p className="text-red-500 text-sm absolute top-[2.5rem]">{error}</p>
      )}
    </div>
  );
}
