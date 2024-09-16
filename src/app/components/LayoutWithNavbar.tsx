"use client";

import { useAtom, useAtomValue } from "jotai";
import { isNavbarOpened, shouldRefetchRecentChats } from "../state";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import Navbar from "./Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

type DataItem = {
  title: string;
  createdAt: string;
  _id: string;
};

type GroupedData = {
  Today?: DataItem[];
  Yesterday?: DataItem[];
  Earlier?: DataItem[];
};

function groupByTime(data: DataItem[]): GroupedData {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  return data?.reduce<GroupedData>((acc, item) => {
    const itemDate = new Date(item.createdAt);

    if (isSameDay(itemDate, today)) {
      acc["Today"] = acc["Today"] || [];
      acc["Today"].push(item);
    } else if (isSameDay(itemDate, yesterday)) {
      acc["Yesterday"] = acc["Yesterday"] || [];
      acc["Yesterday"].push(item);
    } else {
      acc["Earlier"] = acc["Earlier"] || [];
      acc["Earlier"].push(item);
    }

    return acc;
  }, {});
}

const LayoutWithNavbar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const chatId = searchParams.get("chatId");

  const { session } = useSession();

  const { isSignedIn } = useSession();
  const [open, setOpen] = useAtom(isNavbarOpened);
  const [shouldRefetch, setShouldRefetch] = useAtom(shouldRefetchRecentChats);

  const [recent, setRecent] = useState<any>([]);

  const handleNewChat = () => {
    router.push("/chat");
  };

  const handleNavigateToChatRoute = (e: any) => {
    setOpen(false);
    router.push(`/chat?chatId=${e.chatId}`);
    setShouldRefetch(true);
  };

  const fetchUserChats = useCallback(async () => {
    if (session?.user.id) {
      fetch(`/api/userchats?userId=${session?.user.id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: { data: any }) => {
          // setCurrentChatId(data?.data[0]?._id);
          setRecent(groupByTime(data?.data[0]?.chats));
          setShouldRefetch(false);
        })
        .catch((err) => toast.error("Error fetching chat history"));
    }
  }, [session?.user.id, setRecent, setShouldRefetch]);

  useEffect(() => {
    fetchUserChats();
  }, [session?.user.id, chatId, shouldRefetch, fetchUserChats]);

  return (
    <div className="flex flex-row h-full relative">
      <aside
        className={`z-50 absolute w-0 lg:relative h-full bg-slate-50 side-nav   ${
          open
            ? "w-full md:w-[30%] lg:w-[20%] transision-[width] duration-500"
            : "close w-0 transision-[width] duration-500"
        }
        `}
      >
        <>
          <div className={`flex flex-row justify-between m-4 w-fit`}>
            {isSignedIn && open && (
              <>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  id="navbarToggler"
                  className={` ${
                    open && "navbarTogglerActive"
                  }  block rounded-lg px-3 py-[6px]`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M8.857 3h6.286c1.084 0 1.958 0 2.666.058.729.06 1.369.185 1.961.487a5 5 0 0 1 2.185 2.185c.302.592.428 1.233.487 1.961.058.708.058 1.582.058 2.666v3.286c0 1.084 0 1.958-.058 2.666-.06.729-.185 1.369-.487 1.961a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C17.1 21 16.227 21 15.143 21H8.857c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.232-.487-1.961C1.5 15.6 1.5 14.727 1.5 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.728.185-1.369.487-1.96A5 5 0 0 1 4.23 3.544c.592-.302 1.233-.428 1.961-.487C6.9 3 7.773 3 8.857 3M6.354 5.051c-.605.05-.953.142-1.216.276a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216-.05.617-.051 1.41-.051 2.546v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h.6V5h-.6c-1.137 0-1.929 0-2.546.051M11.5 5v14h3.6c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.134-.263.226-.611.276-1.216.05-.617.051-1.41.051-2.546v-3.2c0-1.137 0-1.929-.051-2.546-.05-.605-.142-.953-.276-1.216a3 3 0 0 0-1.311-1.311c-.263-.134-.611-.226-1.216-.276C17.029 5.001 16.236 5 15.1 5zM5 8.5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={handleNewChat}
                  className={`block rounded-lg px-3 py-[6px]`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.673 3.913a3.121 3.121 0 1 1 4.414 4.414l-5.937 5.937a5 5 0 0 1-2.828 1.415l-2.18.31a1 1 0 0 1-1.132-1.13l.311-2.18A5 5 0 0 1 9.736 9.85zm3 1.414a1.12 1.12 0 0 0-1.586 0l-5.937 5.937a3 3 0 0 0-.849 1.697l-.123.86.86-.122a3 3 0 0 0 1.698-.849l5.937-5.937a1.12 1.12 0 0 0 0-1.586M11 4A1 1 0 0 1 10 5c-.998 0-1.702.008-2.253.06-.54.052-.862.141-1.109.267a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.126-.247.215-.569.266-1.108.053-.552.06-1.256.06-2.255a1 1 0 1 1 2 .002c0 .978-.006 1.78-.069 2.442-.064.673-.192 1.27-.475 1.827a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.233-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.729.185-1.369.487-1.961A5 5 0 0 1 5.73 3.545c.556-.284 1.154-.411 1.827-.475C8.22 3.007 9.021 3 10 3A1 1 0 0 1 11 4"></path>
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className="m-[22px] h-[calc(100dvh-74px)] text-base">
            <div className="overflow-y-auto h-fill pb-4">
              {recent &&
                ["Today", "Yesterday", "Earlier"].map((ele) => (
                  <div className="group my-4" key={ele}>
                    {recent[ele] && (
                      <div className="text-xs text-primary my-2 p-2 font-bold">
                        {ele}
                      </div>
                    )}
                    {recent[ele] &&
                      recent[ele].map((e: any) => (
                        <div
                          className={`text-base text-slate-600 my-2 p-2 hover:bg-slate-200 rounded-md text-ellipsis overflow-hidden text-nowrap ${
                            e.chatId === chatId ? "bg-slate-200" : ""
                          }`}
                          key={e.title}
                          onClick={() => handleNavigateToChatRoute(e)}
                          title={e.title}
                        >
                          {e.title}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </>
      </aside>

      <div className="flex flex-col w-full">
        <>
          <Navbar />
          <main className={`flex-1`}>{children}</main>
        </>
      </div>
    </div>
  );
};

export default LayoutWithNavbar;
