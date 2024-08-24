"use client";

import { useEffect } from "react";
import Content from "./components/Content";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, session } = useSession();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/chat");
    } else {
      router.push("/");
    }
  }, [isSignedIn, router, session]);

  return (
    <main className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center bg-primary-gradient">
      <Content />
    </main>
  );
}
