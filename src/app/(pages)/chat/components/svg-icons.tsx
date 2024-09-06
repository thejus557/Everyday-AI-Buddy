export const write = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
      d="M3 6h7M3 10h4"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M13.428 17.572 20.5 10.5a2.828 2.828 0 1 0-4-4l-7.072 7.072a2 2 0 0 0-.547 1.022L8 19l4.406-.881a2 2 0 0 0 1.022-.547"
    ></path>
  </svg>
);

export const code = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      fill="currentColor"
      fill-rule="evenodd"
      d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm1.293 4.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L8.586 12l-1.293-1.293a1 1 0 0 1 0-1.414M12 14a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1"
      clip-rule="evenodd"
    ></path>
  </svg>
);

export const shop = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 18V7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4"
    ></path>
  </svg>
);

export const travel = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="icon-md bg-white border rounded-full p-[10px] h-12 w-12"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m9.65 13.026-3.287 1.19A2 2 0 0 1 3.8 13.027l-.342-.934.597-1.275L1.75 7.419l2.348-.85 2.564 1.484a2 2 0 0 0 1.689.15l8.512-3.083c.291-.106.603-.142.912-.107l2.833.325a1.842 1.842 0 0 1 .422 3.565l-5.276 1.911m.598-1.275L13 14.5l-2.817 1.02-.343-3.622"
    ></path>
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
      d="M3 19h18"
    ></path>
  </svg>
);

export const promptCards = [
  {
    id: "94e4124e",
    title: "Write a text",
    description: "inviting my neighbors to a barbecue",
    oneliner: "Text inviting neighbors to barbecue",
    prompt:
      "Write a short-and-sweet text message inviting my neighbor to a barbecue.",
    category: "write",
    svg: write,
  },
  {
    id: "e3c32040",
    title: "Make me a personal webpage",
    description: "after asking me three questions",
    oneliner: "Make me a personal webpage",
    prompt:
      "Create a personal webpage for me, all in a single file. Ask me 3 questions first on whatever you need to know.",
    category: "code",
    svg: code,
  },
  {
    id: "19a3e27e",
    title: "Help me pick",
    description: "an outfit that will look good on camera",
    oneliner: "Pick outfit to look good on camera",
    prompt:
      "I have a photoshoot tomorrow. Can you recommend me some colors and outfit options that will look good on camera?",
    category: "shop",
    svg: shop,
  },
  {
    id: "70f11a62",
    title: "Plan a trip",
    description: "to experience Seoul like a local",
    oneliner: "Experience Seoul like a local",
    prompt:
      "I'm planning a 4-day trip to Seoul. Can you suggest an itinerary that doesn't involve popular tourist attractions?",
    category: "travel",
    svg: travel,
  },
];
