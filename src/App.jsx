import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import TextInput from "./components/TextInput";
import detectLanguage from "./api/detectLanguage";
import translateText from "./api/translateText";
import languageNames from "./constants/languageNames";

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
  // const handleAction = async (action, message) => {
  //   console.log(
  //     `🚀 Action Triggered: ${action} for message: "${message.text}"`
  //   );

  //   if (action === "Summarize") {
  //     try {
  //       const summaryResult = await summarizeText({ text: message.text });
  //       if (summaryResult.error) {
  //         console.error("Summarization Error:", summaryResult.error);
  //         return;
  //       }

  //       setMessages((prevMessages) => {
  //         const updatedMessages = prevMessages.map((msg) =>
  //           msg.text === message.text && !msg.summary
  //             ? {
  //                 ...msg,
  //                 summary: summaryResult.summary, // Add summary
  //                 detectedLanguage: msg.detectedLanguage,
  //               }
  //             : msg
  //         );
  //         console.log(
  //           "🔄 Updated Messages (After Summarization):",
  //           updatedMessages
  //         );
  //         return updatedMessages;
  //       });
  //     } catch (error) {
  //       console.error("Error summarizing text:", error);
  //     }
  //   }
  // };

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
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="p-8 rounded-lg text-center max-w-md shadow-lg backdrop-blur-md bg-white/10 border border-white/20">
              <h2 className="text-3xl font-extrabold mb-4 monomakh text-white">
                Welcome to your favorite AI-Powered Translator!
              </h2>
              <p className="text-white text-lg">
                Type a message below and let the magic happen!
              </p>
            </div>
          </div>
        )}
        <h1 className="text-center text-[1.5rem] md:text-[1.7rem] lg:text-[2rem] font-bold monomakh mt-6">
          AI-Powered Text Processing Interface
        </h1>
        <ChatWindow
          messages={messages}
          updateMessage={updateMessage}
          // onAction={handleAction}
        />
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <TextInput onSend={handleSend} />
      </div>
    </div>
  );
}
