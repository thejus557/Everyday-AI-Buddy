"use client";

import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUp,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`flex w-full items-center justify-center bg-white h-[64px]`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/" className="block w-full py-5">
              <div className="text-highlight">Everyday ai buddy</div>
            </a>
          </div>
          <div className="flex w-full items-center justify-between px-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                id="navbarToggler"
                className={` ${
                  open && "navbarTogglerActive"
                } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
              >
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
              </button>
            </div>
            <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
              <SignedOut>
                <a
                  href="/sign-in"
                  className="px-7 py-3 text-base font-medium text-dark hover:text-primary "
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  className="rounded-md bg-primary px-7 py-3 text-base font-medium text-white hover:bg-primary/90"
                >
                  Sign Up
                </a>
              </SignedOut>
              <SignedIn>
                <UserButton showName />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
