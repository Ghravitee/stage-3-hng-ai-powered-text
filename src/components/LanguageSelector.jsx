/* eslint-disable react/prop-types */
import { useState } from "react";
import translateText from "../api/translateText";

export default function LanguageSelector({ message, updateMessage }) {
  const [selectedLang, setSelectedLang] = useState("en");
  const [error, setError] = useState(""); // Store error messages
  const [loading, setLoading] = useState(false); // Loading state

  const handleTranslate = async () => {
    setError(""); // Reset error before making a request
    setLoading(true); // Set loading to true

    try {
      const translationResult = await translateText(
        message.text,
        message.detectedLanguage || "auto",
        selectedLang
      );

      if (translationResult.error) {
        setError(translationResult.error);
      } else if (translationResult.translatedText) {
        updateMessage(
          message.text,
          translationResult.translatedText,
          selectedLang,
          message.detectedLanguage // ✅ Retain the original detected language
        );
      } else {
        setError("No translation was returned. Please try again.");
      }
    } catch (err) {
      console.error("❌ Translation Error:", err);
      setError("Translation failed. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2 relative">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <select
          className="p-1 border rounded bg-black text-white"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
          <option value="ru">Russian</option>
          <option value="tr">Turkish</option>
          <option value="fr">French</option>
        </select>

        <button
          className="px-3 py-1 bg-teal-400 font-bold text-black rounded cursor-pointer flex items-center"
          onClick={handleTranslate}
          disabled={loading} // Disable button while loading
        >
          Translate
          {loading && (
            <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </button>
      </div>

      {/* Error message in red */}
      {error && (
        <p className="text-red-500 text-sm absolute top-[5rem] md:top-[2.5rem]">
          {error}
        </p>
      )}
    </div>
  );
}
