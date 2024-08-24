"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
const messages = [
  {
    id: 1,
    sender: "Andri Thomas",
    text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
    time: "1:55pm",
    isSender: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Hello, Thomas! I will check the schedule and inform you",
    time: "1:55pm",
    isSender: true,
  },
  {
    id: 3,
    sender: "Andri Thomas",
    text: "Ok, Thanks for your reply.",
    time: "1:55pm",
    isSender: false,
  },
  {
    id: 4,
    sender: "You",
    text: "You are welcome!",
    time: "1:55pm",
    isSender: true,
  },
];
const Chat = () => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyUp = (e) => {
    if (textAreaRef.current) {
      // Adjust height based on content
      textAreaRef.current.style.height = "auto"; // Reset height to allow shrinking
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      // Clear the text area after sending the message
      setMessage("");
      textAreaRef.current.style.height = "auto"; // Reset height after clearing
    }
  };

  return (
    <div className="flex w-full justify-center bg-white">
      <div className="container justify-center items-center shadow-none">
        <div className="flex flex-col items-center justify-start bg-gray-100 h-[calc(100dvh-64px)]">
          <div className="w-full p-4 bg-white  flex flex-col justify-between h-full">
            <div className="flex flex-col h-full justify-end mb-4">
              <div className="flex items-start justify-start mb-2">
                <Image
                  alt="AI"
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                  className=""
                  src="/Graident Ai Robot.jpg"
                />
                <div className="text-sm text-gray-800 bg-gray-100 p-2 rounded-lg max-w-xs">
                  I want to make an appointment tomorrow from 2:00 to 5:00pm?
                </div>
              </div>
              <div className="flex items-start justify-end mb-2">
                <div className="text-sm text-white bg-primary p-2 rounded-lg max-w-xs">
                  Hello, Thomas! I will check the schedule and inform you
                </div>
              </div>
              <div className="flex items-start justify-start mb-2">
                <Image
                  alt="AI"
                  loading="lazy"
                  width="40"
                  height="40"
                  decoding="async"
                  className=""
                  src="/Graident Ai Robot.jpg"
                />
                <div className="text-sm text-gray-800 bg-gray-100 p-2 rounded-lg max-w-xs">
                  Ok, Thanks for your reply.
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    1:55pm
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-end mb-2">
                <div className="text-sm text-white bg-primary p-2 rounded-lg max-w-xs">
                  You are welcome!
                </div>
              </div>
            </div>

            {/* Input Box */}
            <div className="flex items-center pt-2 relative">
              <div className="flex-grow p-2 border rounded-lg pr-[34px] items-end">
                <textarea
                  placeholder="Type something here"
                  className="flex-grow p-2 border rounded-lg  focus:outline-none border-none w-full resize-none"
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyUp={handleKeyUp}
                  value={message}
                  ref={textAreaRef}
                  rows={1} // Default to single row
                  style={{ maxHeight: "240px", overflowY: "auto" }} // Limit height to 240px
                />
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800 absolute right-2 bottom-[20px]"
                  onClick={handleSendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
