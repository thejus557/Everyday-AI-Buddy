import { SignIn, SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <SignIn routing="hash" />
    </div>
  );
};

export default page;
