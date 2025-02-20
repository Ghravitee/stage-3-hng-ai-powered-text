/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

export default function TextInput({ onSend }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(""); // Error state

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
      setError(""); // Reset error on successful send
    } else {
      setError("Message cannot be empty!");
    }
  };

  return (
    <div className="p-4 bg-[#1A1A1A] flex flex-col items-center w-full md:w-[80%] mx-auto relative">
      <div className="relative w-full">
        {/* Textarea */}
        <textarea
          className="w-full p-4 pr-12 bg-[#222] rounded-xl text-white outline-none placeholder-gray-400 resize-none focus-visible:outline focus-visible:outline-yellow-400"
          name="message"
          required
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.trim()) setError(""); // Clear error when typing
          }}
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

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
