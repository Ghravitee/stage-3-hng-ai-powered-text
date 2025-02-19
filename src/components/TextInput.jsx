/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

export default function TextInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="p-4 bg-[#1A1A1A] flex items-center w-[80%] mx-auto">
      <div className="relative w-full">
        {/* Textarea */}
        <textarea
          className="w-full p-4 pr-12 bg-[#222] rounded-xl text-white outline-none placeholder-gray-400 resize-none focus-visible:outline focus-visible:outline-yellow-400"
          name="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          aria-label="Message input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Send Button */}
        <button
          className="cursor-pointer absolute bottom-3 right-3 bg-[#dfff00] p-3 rounded-full hover:bg-[#EFFF50] transition-all shadow-lg focus-visible:outline focus-visible:outline-yellow-500"
          onClick={handleSend}
          aria-label="Send message"
          title="Send message"
          type="button"
        >
          <FaLocationArrow color="black" />
        </button>
      </div>
    </div>
  );
}
