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
        "primary-gradient":
          "linear-gradient(121.7deg, #2974FA 22.9%, #43D4FF 69%)",
      },
      borderColor: {
        highlight: "#1366ff",
      },
    },
  },
  plugins: [],
};
export default config;
