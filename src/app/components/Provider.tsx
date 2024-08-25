"use client";

import { Provider } from "jotai";
import React from "react";

export const Providers = ({ children }) => {
  return <Provider>{children}</Provider>;
};
