"use client";

import { SignIn } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const p = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (p.get("redirect_url")?.includes("/chat")) {
      router.push("/");
    }
  }, [p, router]);

  return (
    <div className="flex justify-center items-center h-full">
      <SignIn routing="hash" />
    </div>
  );
};

export default Page;
