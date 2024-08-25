import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#8c98a4",
        primary: "#1e2022",
        highlight: "#1366ff",
        dark: "#1e2022",
      },
      backgroundColor: {
        primary: "#1366ff",
        secondary: "#f8fafd",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg, rgba(28,23,108,1) 0%, #1366ff 35%, rgba(0,212,255,1) 97%)",
      },
      borderColor: {
        highlight: "#1366ff",
      },
    },
  },
  plugins: [],
};
export default config;
