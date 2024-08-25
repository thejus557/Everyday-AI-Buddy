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
import Loader from "@/app/components/Loader/Loader";
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

const write = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
      d="M3 6h7M3 10h4"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
    ></path>
  </svg>
);

const code = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm1.293 4.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L8.586 12l-1.293-1.293a1 1 0 0 1 0-1.414M12 14a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
      clip-rule="evenodd"
    ></path>
  </svg>
);

const shop = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 18V7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4"
    ></path>
  </svg>
);

const travel = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m9.65 13.026-3.287 1.19A2 2 0 0 1 3.8 13.027l-.342-.934.597-1.275L1.75 7.419l2.348-.85 2.564 1.484a2 2 0 0 0 1.689.15l8.512-3.083c.291-.106.603-.142.912-.107l2.833.325a1.842 1.842 0 0 1 .422 3.565l-5.276 1.911m.598-1.275L13 14.5l-2.817 1.02-.343-3.622"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
      d="M3 19h18"
    ></path>
  </svg>
);

const promptCards = [
  {
    id: "94e4124e",
    title: "Write a text",
    description: "inviting my neighbors to a barbecue",
    oneliner: "Text inviting neighbors to barbecue",
    prompt:
      "Write a short-and-sweet text message inviting my neighbor to a barbecue.",
    category: "write",
    svg: write,
  },
  {
    id: "e3c32040",
    title: "Make me a personal webpage",
    description: "after asking me three questions",
    oneliner: "Make me a personal webpage",
    prompt:
      "Create a personal webpage for me, all in a single file. Ask me 3 questions first on whatever you need to know.",
    category: "code",
    svg: code,
  },
  {
    id: "19a3e27e",
    title: "Help me pick",
    description: "an outfit that will look good on camera",
    oneliner: "Pick outfit to look good on camera",
    prompt:
      "I have a photoshoot tomorrow. Can you recommend me some colors and outfit options that will look good on camera?",
    category: "shop",
    svg: shop,
  },
  {
    id: "70f11a62",
    title: "Plan a trip",
    description: "to experience Seoul like a local",
    oneliner: "Experience Seoul like a local",
    prompt:
      "I'm planning a 4-day trip to Seoul. Can you suggest an itinerary that doesn't involve popular tourist attractions?",
    category: "travel",
    svg: travel,
  },
];

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

  const [isFetching, setIsFetching] = useState(false);

  const scrollToBottom = () => {
    if (chatRef.current) {
      console.log("chat ref", chatRef.current.scrollHeight);
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (chatId && session?.user.id) {
      fetch(`/api/chatbot?userId=${session?.user.id}&chatId=${chatId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: { data: Array<ChatBotResponse> }) => {
          setChats(data.data[0]?.history);
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
    }
  };
  const handleSendMessage = (prompt?: string) => {
    let query = prompt || message;
    if (query.trim() && textAreaRef.current) {
      // Clear the text area after sending the message
      setMessage("");
      textAreaRef.current.style.height = "auto"; // Reset height after clearing

      setChats((prev: any) => [
        ...prev,
        {
          role: "user",
          parts: [
            {
              text: query,
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

      setIsFetching(true);

      if (!chatId) {
        fetch("/api/chatbot", {
          method: "POST",
          body: JSON.stringify({ prompt: query, userId: session?.user.id }),
        })
          .then((res) => res.json())
          .then((data: { data: ChatBotResponse }) => {
            handleOnSuccess(data);
          })
          .finally(() => {
            setIsFetching(false);
          });
      } else {
        fetch("/api/chatbot", {
          method: "PUT",
          body: JSON.stringify({
            prompt: query,
            userId: session?.user.id,
            chatId,
          }),
        })
          .then((res) => res.json())
          .then((data: { data: ChatBotResponse }) => {
            handleOnSuccess(data);
          })
          .finally(() => {
            setIsFetching(false);
          });
      }
    }
  };

  return (
    <div className="flex w-full justify-center bg-white">
      <div
        className={`container justify-center items-center shadow-none  ${
          chats?.length || chatId
            ? "justify-between"
            : "justify-start lg:max-w-fit"
        }`}
      >
        <div className="flex flex-col items-center justify-start bg-gray-100 h-[calc(100dvh-64px)]">
          <div
            className={`w-full p-4 bg-white  flex flex-col h-full overflow-y-auto ${
              chats?.length || chatId ? "justify-between" : "justify-start"
            }`}
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
                        {ele.parts[0].text === "loading..." && isFetching ? (
                          <Loader />
                        ) : (
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
                                    PreTag="div"
                                    // eslint-disable-next-line react/no-children-prop
                                    children={String(children).replace(
                                      /\n$/,
                                      ""
                                    )}
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
                        )}
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

            {chats.length === 0 && !chatId && (
              <div className="my-12">
                <div className="text-transparent bg-clip-text font-bold bg-primary-gradient text-3xl md:text-5xl lg:text-6xl">
                  Hello, {session?.user.fullName?.toLowerCase()}.
                </div>
                <div className="text-3xl md:text-5xl lg:text-6xl">
                  How can i help you today ?
                </div>
              </div>
            )}

            {chats.length === 0 && !chatId && (
              <div className="my-12 flex w-full justify-center items-center">
                <div className="flex w-full flex-row gap-4 overflow-x-auto">
                  {promptCards.map((e) => (
                    <div
                      onClick={() => {
                        setMessage(e.prompt);
                        handleSendMessage(e.prompt);
                      }}
                      key={e.id}
                      className="cursor-pointer flex flex-col border rounded-lg text-sm lg:text-base min-w-[140px] min-h-[120px] lg:min-w-[220px] lg:min-h-[120px] p-2 bg-secondary justify-between group hover:bg-blue-100"
                    >
                      <div className="text-black">{e.title}</div>
                      <div className="flex justify-end rounded-full text-highlight text-right group-hover:text-black">
                        {e.svg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative w-full flex-grow p-2 border pr-[34px] items-end">
            <textarea
              disabled={isFetching}
              placeholder="Type something here"
              className="flex-grow p-2 border  focus:outline-none border-none w-full resize-none text-primary"
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleKeyUp}
              value={message}
              ref={textAreaRef}
              rows={1} // Default to single row
              style={{ maxHeight: "240px", overflowY: "auto" }} // Limit height to 240px
            />
            <button
              className="ml-2 text-blue-600 hover:text-blue-800 absolute right-2 bottom-[20px]"
              onClick={() => handleSendMessage()}
              disabled={isFetching}
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
