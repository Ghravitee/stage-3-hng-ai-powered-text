/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import ActionButtons from "./ActionButtons";
import LanguageSelector from "./LanguageSelector";
import chatbot from "../assets/chatbot.png";
import { RxAvatar } from "react-icons/rx";
// import { RiTranslate } from "react-icons/ri";
import { MdLanguage } from "react-icons/md";
import { slideInFromLeft, slideInFromRight, zoomIn } from "../utils/motion";

export default function MessageBubble({ message, updateMessage }) {
  return (
    <motion.div
      variants={
        message.type === "user" ? slideInFromRight(0.1) : slideInFromLeft(0.1)
      }
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={`flex flex-col overflow-hidden ${
        message.type === "user" ? "items-end" : "items-start"
      }`}
    >
      <motion.div
        variants={zoomIn(0.1, 0.3)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className={`w-fit max-w-[90%] backdrop-blur-lg ${
          message.type === "user"
            ? "tooltip ml-auto self-end text-black"
            : "tooltip-1 mr-auto self-start"
        } before:absolute ${
          message.type === "user"
            ? "before:bottom-0 before:w-8 before:h-8 before:rotate-45 "
            : "before:top-1/2 before:w-4 before:h-4 before:rotate-45"
        } ${
          message.type === "user" ? "before:right-[-4px]" : "before:left-[-6px]"
        } shadow-xl p-4 rounded-lg`}
        style={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Soft floating shadow
          backdropFilter: "blur(12px)", // Frosted glass effect
          WebkitBackdropFilter: "blur(12px)", // Ensure Safari compatibility
        }}
      >
        {/* Message Text */}
        <p className="mb-2">{message.text}</p>

        {/* Translated Text (if available) */}
        {message.type === "bot" && message.translatedText && (
          <motion.div
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center"
          >
            <p className="text-[#FFA500]">{message.translatedText}</p>
          </motion.div>
        )}

        {/* Detected Language */}
        {message.type === "bot" && message.detectedLanguage && (
          <motion.div
            variants={slideInFromLeft}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center gap-2 mt-2"
          >
            <MdLanguage />
            <p className="text-xs text-gray-400">
              Detected Language: {message.detectedLanguage}
            </p>
          </motion.div>
        )}

        {/* Action Buttons for Bot Messages */}

        <div className="flex flex-col md:flex-row gap-2 items-center">
          {/* Language Selector */}
          {message.type === "bot" && (
            <LanguageSelector message={message} updateMessage={updateMessage} />
          )}
          {message.type === "bot" && message.actions?.length > 0 && (
            <ActionButtons message={message} updateMessage={updateMessage} />
          )}
        </div>
      </motion.div>

      {/* Avatar/Icon */}
      {message.type === "user" ? (
        <RxAvatar className="text-4xl mr-4" />
      ) : (
        <motion.img
          src={chatbot}
          alt="This is the image of a chatbot"
          width={50}
          height={50}
          variants={zoomIn(0.2, 0.4)}
          initial="hidden"
          animate="show"
        />
      )}
    </motion.div>
  );
}
