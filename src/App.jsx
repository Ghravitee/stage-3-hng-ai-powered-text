import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import TextInput from "./components/TextInput";
import detectLanguage from "./api/detectLanguage";
import translateText from "./api/translateText";
import languageNames from "./constants/languageNames";
import chatbot from "./assets/chatbot.png";
import { RiTranslate } from "react-icons/ri";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(""); // Error state

  const handleSend = async (text) => {
    setError(""); // Reset error before request
    setShowModal(false);

    try {
      const detectedLanguage = await detectLanguage(text);
      console.log(`📝 Detected Language: ${detectedLanguage}`);

      const userMessage = {
        text,
        type: "user",
        detectedLanguage,
        isLatestUserMessage: true,
      };

      setMessages((prev) => {
        const updatedMessages = prev
          .map((msg) => ({ ...msg, isLatestUserMessage: false }))
          .concat(userMessage);
        return updatedMessages;
      });

      const targetLanguage = "en";
      let translatedText = text;

      if (detectedLanguage !== targetLanguage) {
        const translationResult = await translateText(
          text,
          detectedLanguage,
          targetLanguage
        );
        translatedText = translationResult.translatedText;
      }

      const wordCount = text.match(/\b\w+\b/g)?.length || 0;
      const actions = [];
      if (detectedLanguage !== "en") actions.push("Translate");
      if (detectedLanguage.toLowerCase().includes("en") && wordCount >= 150)
        actions.push("Summarize");

      console.log(
        `📝 Word Count: ${wordCount}, Detected Language: ${detectedLanguage}, Actions: ${actions}`
      );

      const botResponse = {
        text,
        translatedText,
        detectedLanguage,
        type: "bot",
        actions,
      };

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

  const updateMessage = (originalText, newTranslation, newLanguage) => {
    const fullLanguageName = languageNames[newLanguage] || newLanguage;
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.text === originalText
          ? {
              ...msg,
              translatedText: newTranslation,
              detectedLanguage: fullLanguageName,
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
              <div className="p-8 rounded-lg text-center max-w-md shadow-lg backdrop-blur-md bg-white/10 border border-white/20">
                <h2 className="text-3xl font-extrabold mb-4 text-white anton">
                  Welcome to your favorite AI-Powered Translator!
                </h2>
                <p className="text-white text-lg">
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

        <ChatWindow messages={messages} updateMessage={updateMessage} />
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <TextInput onSend={handleSend} />
      </div>
    </div>
  );
}
