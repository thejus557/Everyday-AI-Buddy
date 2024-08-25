"use client";

import { shouldRefetchRecentChats } from "@/app/state";
import { useSession } from "@clerk/nextjs";
import { useAtom } from "jotai";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
// import "katex/dist/katex.min.css";

type chatHistoryType = {
  role: "user" | "model";
  parts: [
    {
      text: string;
    }
  ];
};

type ChatBotResponse = {
  chatId: string;
  userId: string;
  history: Array<chatHistoryType>;
};

const Chat = () => {
  const chatRef = useRef<any>();
  const router = useRouter();
  const params = useParams();
  const { chatId } = params; // Extract the id from the URL

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Array<chatHistoryType>>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { session } = useSession();

  const [_, setShouldRefetech] = useAtom(shouldRefetchRecentChats);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatId && session?.user.id) {
      fetch(`/api/chatbot?userId=${session?.user.id}&chatId=${chatId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: { data: Array<ChatBotResponse> }) => {
          console.log("data", data.data[0]?.history);
          setChats(data.data[0]?.history);
          scrollToBottom();
        });
    }
  }, [session]);

  const handleKeyUp = (e: any) => {
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

  const handleOnSuccess = (data: any) => {
    setChats(data.data?.history);

    if (!chatId) {
      router.push(`/chat/${data.data.chatId}`);
      setShouldRefetech(true);
      scrollToBottom();
    }
  };
  const handleSendMessage = () => {
    if (message.trim() && textAreaRef.current) {
      console.log("Message sent:", message);
      // Clear the text area after sending the message
      setMessage("");
      textAreaRef.current.style.height = "auto"; // Reset height after clearing

      setChats((prev: any) => [
        ...prev,
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "loading...",
            },
          ],
        },
      ]);

      if (!chatId) {
        fetch("/api/chatbot", {
          method: "POST",
          body: JSON.stringify({ prompt: message, userId: session?.user.id }),
        })
          .then((res) => res.json())
          .then((data: { data: ChatBotResponse }) => {
            handleOnSuccess(data);
          });
      } else {
        fetch("/api/chatbot", {
          method: "PUT",
          body: JSON.stringify({
            prompt: message,
            userId: session?.user.id,
            chatId,
          }),
        })
          .then((res) => res.json())
          .then((data: { data: ChatBotResponse }) => {
            handleOnSuccess(data);
          });
      }
    }
  };

  return (
    <div className="flex w-full justify-center bg-white">
      <div className="container justify-center items-center shadow-none">
        <div className="flex flex-col items-center justify-start bg-gray-100 h-[calc(100dvh-64px)]">
          <div
            className="w-full p-4 bg-white  flex flex-col justify-between h-full overflow-y-auto"
            ref={chatRef}
          >
            {chats &&
              chats?.map((ele) => (
                <div
                  key={ele.parts[0]?.text}
                  className="flex flex-col justify-end mb-4"
                >
                  {ele.role === "model" && (
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
                      <div className="text-sm p-2 rounded-lg max-w-xs markdown">
                        <Markdown
                          className="text-primary"
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code(props) {
                              const { children, className, node, ...rest } =
                                props;
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return match ? (
                                <SyntaxHighlighter
                                  {...rest}
                                  PreTag="div"
                                  // eslint-disable-next-line react/no-children-prop
                                  children={String(children).replace(/\n$/, "")}
                                  language={match[1]}
                                  style={materialLight}
                                />
                              ) : (
                                <code {...rest} className={className}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                          // eslint-disable-next-line react/no-children-prop
                          children={ele.parts[0]?.text}
                        />
                      </div>
                    </div>
                  )}

                  {ele.role === "user" && (
                    <div className="flex items-start justify-end mb-2">
                      <div className="text-sm text-primary bg-gray-100 p-2 rounded-lg max-w-xs">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {ele.parts[0]?.text}
                        </Markdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {/* Input Box */}
          </div>
          <div className="relative w-full flex-grow p-2 border rounded-lg pr-[34px] items-end">
            <textarea
              placeholder="Type something here"
              className="w- fulflex-grow p-2 border rounded-lg  focus:outline-none border-none w-full resize-none text-primary"
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
  );
};

export default Chat;
