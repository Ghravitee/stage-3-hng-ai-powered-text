import { useState } from "react";
import Output from "./components/Output";
import TextInput from "./components/TextInput";
import detectLanguage from "./api/detectLanguage";
import translateText from "./api/translateText";
import languageNames from "./constants/languageNames";
import chatbot from "./assets/chatbot.png";
import { RiTranslate } from "react-icons/ri";

export default function App() {
  const [messages, setMessages] = useState([]); // State to store messages exchanged between the user and the bot
  const [showModal, setShowModal] = useState(true); // State to control the visibility of a modal (shown by default)
  const [error, setError] = useState(""); // Error state

  // Function to handle user message submission
  const handleSend = async (text) => {
    setError(""); // Reset error before request
    setShowModal(false); // Close modal once user sends a message

    try {
      const detectedLanguage = await detectLanguage(text); // Detect the language of the input text
      console.log(`📝 Detected Language: ${detectedLanguage}`);

      // Create a new user message object
      const userMessage = {
        text, // Original user input
        type: "user", // Identifies this as a user message
        detectedLanguage, // Detected language of the text
        isLatestUserMessage: true, // Indicates this is the most recent user message
      };

      // Update messages state: mark previous user messages as not latest and add the new one
      setMessages((prev) => {
        const updatedMessages = prev
          .map((msg) => ({ ...msg, isLatestUserMessage: false }))
          .concat(userMessage);
        return updatedMessages;
      });

      const targetLanguage = "en"; // The language to which messages should be translated
      let translatedText = text; // Initialize translated text as the original input

      // If the detected language is different from English, translate the text
      if (detectedLanguage !== targetLanguage) {
        const translationResult = await translateText(
          text,
          detectedLanguage,
          targetLanguage
        );
        translatedText = translationResult.translatedText; // Store the translated text
      }

      // Count the number of words in the input text
      const wordCount = text.match(/\b\w+\b/g)?.length || 0;

      // Count the number of words in the input text
      const actions = [];
      if (detectedLanguage !== "en") actions.push("Translate"); // Translate if the text isn't in English
      if (detectedLanguage.toLowerCase().includes("en") && wordCount >= 150)
        actions.push("Summarize"); // Summarizeif it's English and 150+ words

      // Create bot's mssage
      const botResponse = {
        text, // original text
        translatedText, // Translated version (or the same if already in English)
        detectedLanguage, // Language detected from user input
        type: "bot", // Identifies this as a bot response
        actions, // Possible actions the bot can perform (Translate/Summarize)
      };

      // Update messages state: add the bot's response
      setMessages((prev) => {
        const updatedMessages = [...prev, botResponse];
        console.log(
          "🤖 Updated Messages (After Bot Response):",
          updatedMessages
        );
        return updatedMessages;
      });
    } catch (error) {
      console.error("API Error:", error);
      setError(
        "Something went wrong while processing your request. Please try again."
      );
    }
  };

  // Function to update a specific message when a translation occurs
  const updateMessage = (originalText, newTranslation, newLanguage) => {
    const fullLanguageName = languageNames[newLanguage] || newLanguage; // Get full name of the language
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.text === originalText
          ? {
              ...msg, // Update with the new translated text
              translatedText: newTranslation, // Update with the new translated text
              detectedLanguage: fullLanguageName, // Update language name
            }
          : msg
      )
    );
  };

  return (
    <div className="h-screen flex px-4 pb-6 relative">
      <div className="flex-1 flex flex-col  overflow-x-hidden">
        {showModal && (
          <div className="fixed top-[4rem] left-0 right-0 bg-black bg-opacity-60 flex flex-col md:flex-row justify-center items-center px-6">
            <div className=" bg-black text-white p-4 rounded-lg shadow-lg w-64 text-center">
              <p className="font-bold text-yellow-400 anton">
                Important Notice
              </p>
              <p className="mt-2 text-sm">
                This application works best on Google Chrome. Other browsers may
                not support all functionalities.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex gap-1 items-center">
                <img
                  src={chatbot}
                  alt="This is the image of a chatbot"
                  width={50}
                  height={50}
                  className=""
                />
                <p className="font-bold">Lexiflow</p>
              </div>
              <div className="p-8 rounded-lg text-center max-w-md shadow-lg backdrop-blur-md bg-white/10 border border-white/ mb-6">
                <h2 className="text-3xl font-extrabold mb-4 text-white anton">
                  Welcome to your favorite AI-Powered Translator!
                </h2>
                <p className="text-white sm:text-lg text-base">
                  Type a message below and let the magic happen!
                </p>
              </div>
            </div>
            <div className=" bg-black text-white p-4 rounded-lg shadow-lg w-64 text-center hidden md:block">
              <div className="flex items-center gap-1 justify-center">
                <RiTranslate />
                <p className="font-bold text-blue-400 anton">
                  Translation Info
                </p>
              </div>
              <p className="mt-2 text-sm">
                By default, all languages are first translated into English
                before further processing.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-1 items-center mt-4 ml-4">
          <img
            src={chatbot}
            alt="This is the image of a chatbot"
            width={50}
            height={50}
          />
          <p className="font-bold anton">Lexiflow</p>
        </div>

        <h1 className="text-center text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] font-bold anton">
          AI-Powered Text Processing Interface
        </h1>

        <Output messages={messages} updateMessage={updateMessage} />
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <TextInput onSend={handleSend} />
      </div>
    </div>
  );
}
