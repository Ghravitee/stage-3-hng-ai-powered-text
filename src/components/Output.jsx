/* eslint-disable react/prop-types */
import MessageBubble from "./MessageBubble";

export default function Output({ messages, updateMessage, onAction }) {
  return (
    <div className="flex-1 overflow-auto p-4 custom-scrollbar">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message}
          updateMessage={updateMessage}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
