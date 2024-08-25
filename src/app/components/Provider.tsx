"use client";

import { Provider } from "jotai";
import React from "react";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return <Provider>{children}</Provider>;
};
