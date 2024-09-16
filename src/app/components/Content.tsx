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
    <div className="container grid grid-cols-1 md:grid-cols-2 justify-evenly items-center w-full mb-16">
      <div className="grid md:order-none order-2 justify-center items-center h-fit m-2">
        <div className="font-semibold grid text-center md:text-left items-center text-4xl md:text-6xl lg:text-8xl my-2 text-transparent bg-clip-text bg-primary-gradient">
          NexGen.AI
        </div>
        <div className="grid text-primary text-center md:text-left items-center text-base md:text-xl lg:text-2xl my-2">
          Your Intelligent Companion for Smarter Conversations.
        </div>
        <div className="grid text-center md:text-left items-center text-xs md:text-base my-2">
          NexGen.AI is your next-generation virtual assistant, designed to
          engage in natural, intuitive conversations and provide insightful
          responses. Leveraging cutting-edge generative AI technology, Nex Gen
          AI offers accurate information, helpful advice, and personalized
          interactions to enhance your daily tasks and decision-making
          processes. <br /> <br /> Whether you need assistance with research,
          creative brainstorming, or just a friendly chat, Nex Gen AI is here to
          make your life easier and more productive.
        </div>

        <Button
          className="w-fit mt-4"
          title="Get Started"
          onClick={handleGetStarted}
        />
      </div>
      <div className="grid md:order-none order-1 justify-evenly">
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
