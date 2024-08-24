"use client";

import React from "react";
import Lottie from "react-lottie-player";
import lottieJson from "../../../public/ai-animation.json";
import Button from "./Button";
import { useRouter } from "next/navigation";

const Content = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  return (
    <div className="grid grid-cols-2 justify-evenly items-center w-full pt-16">
      <div className="grid justify-center h-fit">
        <div className="grid items-center text-8xl font-bold text-highlight my-2">
          Everyday ai buddy
        </div>
        <div className="grid items-center text-2xl my-2">
          Your Intelligent Partner for Daily Tasks, Insights, and Creativity.
        </div>
        <Button title="Get Started" onClick={handleGetStarted} />
      </div>
      <div className="grid justify-center">
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="w-[30rem] h-[30rem]"
        />
      </div>
    </div>
  );
};

export default Content;
