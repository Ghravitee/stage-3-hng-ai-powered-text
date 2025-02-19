/* eslint-disable react/prop-types */
import { useState } from "react";
import summarizeText from "../api/summarizeText";

export default function ActionButtons({ message, updateMessage }) {
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const handleSummarize = async () => {
    setLoading(true);
    setError(""); // Reset error before making a request

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1s delay
      const summaryResult = await summarizeText({ text: message.text });

      if (summaryResult.error) {
        setError(summaryResult.error);
      } else if (summaryResult.summary) {
        updateMessage(
          message.text,
          summaryResult.summary,
          "summary",
          "en" // ✅ Ensure detected language remains English
        );
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
