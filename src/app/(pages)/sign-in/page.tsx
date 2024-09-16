"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const p = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (p.get("redirect_url")?.includes("/chat")) {
      router.push("/");
    }
  }, [p]);

  return (
    <div className="flex justify-center items-center h-full">
      <SignIn routing="hash" />
    </div>
  );
};

export default page;
