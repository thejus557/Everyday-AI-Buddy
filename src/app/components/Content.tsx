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
    <div className="grid grid-cols-1 md:grid-cols-2 justify-evenly items-center w-full">
      <div className="grid md:order-none order-2 justify-center items-center h-fit">
        <div className="grid text-center md:text-center items-center text-4xl md:text-6xl lg:text-8xl font-bold text-highlight my-2">
          Jarvis AI
        </div>
        <div className="grid text-center md:text-center items-center text-base md:text-xl lg:text-2xl my-2">
          Your Intelligent Partner for Daily Tasks, Insights, and Creativity.
        </div>
        <Button
          className="!m-auto"
          title="Get Started"
          onClick={handleGetStarted}
        />
      </div>
      <div className="grid md:order-none order-1 justify-center">
        <Lottie
          loop
          animationData={lottieJson}
          play
          className="w-[16rem] h-[16rem] md:w-[24rem] md:h-[24rem] lg:w-[30rem] lg:h-[30rem]"
        />
      </div>
    </div>
  );
};

export default Content;
