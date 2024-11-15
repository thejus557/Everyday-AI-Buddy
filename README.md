# NexChat.AI Application

An interactive AI chat application built with Next.js and TypeScript, powered by Google's Gemini AI API.

## Live Demo

Check out the live demo of NexChat.AI: [https://nex-chat-ai.vercel.app](https://nex-chat-ai.vercel.app)

Experience the power of AI-driven conversations and explore the features of our application in real-time.

## Tech Stack

- Next.js 14
- TypeScript
- React
- Tailwind CSS
- PostCSS
- Google Gemini AI API
- Clerk Authentication

## Features

- AI-powered chat interface using Google's Gemini AI
- User authentication with Clerk (sign-up and sign-in functionality)
- Responsive design with a custom navbar
- Server-side rendering and API routes with Next.js
- Animated AI avatar using Lottie

## Prerequisites

- Node.js (version 14 or later)
- npm or yarn
- Google Cloud account with Gemini AI API access
- Clerk account for authentication

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/thejus557/NexChat.AI
   cd NexChat.AI
   ```

2. Install dependencies:
   ```
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/chat
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/chat
   NEXT_PUBLIC_GEMINI_AI_API_KEY=your_google_gemini_api_key
   NEXT_PUBLIC_MONGO_URI=your_mongo_uri
   ```

## Running the Application

1. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

## Deployment

This project is configured for easy deployment on Vercel. Push to your GitHub repository and connect it to Vercel for automatic deployments.

Deplyment url: https://nex-chat-ai.vercel.app

## Project Structure

- `src/app/(pages)`: Contains the main pages (chat, sign-in, sign-up)
- `src/app/components`: Reusable components like Navbar and LayoutWithNavbar
- `src/middleware.ts`: Clerk authentication middleware
- `public`: Static assets including SVGs and animations
