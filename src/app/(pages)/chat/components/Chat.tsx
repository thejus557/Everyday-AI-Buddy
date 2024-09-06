"use client";

import { shouldRefetchRecentChats } from "@/app/state";
import { useSession } from "@clerk/nextjs";
import { useAtom } from "jotai";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import Loader from "@/app/components/Loader/Loader";
import { promptCards } from "./svg-icons";
import { toast } from "react-toastify";
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
  // const { chatId } = params; // Extract the id from the URL
  const searchParams = useSearchParams();
  const sparams = new URLSearchParams(searchParams.toString());

  const chatId = sparams.get("chatId");

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
        })
        .catch((err) => toast.error("Error fetching chat history"));
    } else {
      setChats([]);
      router.push("/chat");
    }
  }, [session, chatId]);

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
      router.push(`/chat?chatId=${data.data?.chatId}`, { scroll: false });
      // router.
      // router.push(`/chat/`, {
      //   query: { chatId: data.data?.chatId },
      // });
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
          .catch((err) => toast.error("Error sending message"))
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
          .catch((err) => toast.error("Error sending message"))
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
                      <div className="text-sm p-2 rounded-lg max-w-full markdown">
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
                      <div className="text-sm text-primary bg-gray-100 p-2 rounded-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
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
                <div className="text-transparent bg-clip-text font-bold bg-primary-gradient text-3xl md:text-5xl lg:text-6xl mb-2">
                  Hello, {session?.user.fullName?.toLowerCase()}.
                </div>
                <div className="text-2xl md:text-4xl lg:text-5xl">
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
                      className="cursor-pointer flex flex-col border rounded-lg text-sm lg:text-base min-w-[140px] min-h-[120px] lg:min-w-[220px] lg:min-h-[120px] p-4 bg-secondary justify-between group hover:bg-blue-50"
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
