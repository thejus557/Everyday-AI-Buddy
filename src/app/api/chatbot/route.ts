import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import UserChats from "../../models/user-chats.schema";
import UserChatHistory from "../../../app/models/chat-history.schema";
import mongoose from "mongoose";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_AI_API_KEY;

if (!API_KEY) {
  throw new Error("API key is missing!");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
});

const getAnswerFromGeminiAi = async (data: any, prompt: string) => {
  try {
    const chat = model.startChat({
      history: data,
    });

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (e) {
    return e;
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const userId = searchParams.get("userId");
    const chatId = searchParams.get("chatId");

    // Connect to the database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string);
    }

    const userChatHistory = await UserChatHistory.find({
      userId,
      chatId,
    });

    if (!userChatHistory) {
      return new NextResponse(
        JSON.stringify({
          message: "Chat history not found",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: userChatHistory,
      })
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        message: (err as any).message,
      }),
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { prompt, userId } = await req.json();

    // Connect to the database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string);
    }

    const chatId = uuidv4();

    // Get AI response
    const result = await getAnswerFromGeminiAi([], prompt);
    // Save the chat history
    const userChatHistory = new UserChatHistory({
      chatId,
      userId,
      history: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: result,
            },
          ],
        },
      ],
    });

    await userChatHistory.save();

    // Check if user chats exist, if not create new
    let userChats = await UserChats.findOne({ userId });
    if (!userChats) {
      userChats = new UserChats({
        userId,
        chats: [
          {
            title: prompt.substring(0, 100),
            chatId,
          },
        ],
      });
    } else {
      userChats.chats.push({
        title: prompt.substring(0, 100),
        chatId,
      });
    }

    await userChats.save();

    return new NextResponse(
      JSON.stringify({
        data: userChatHistory,
      })
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        message: (err as any).message,
      }),
      { status: 500 }
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const { userId, chatId, prompt } = await req.json();

    // Connect to the database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string);
    }

    // Retrieve the existing chat history
    const userChatHistory = await UserChatHistory.findOne({ chatId, userId });

    if (!userChatHistory) {
      return new NextResponse(
        JSON.stringify({
          message: "Chat history not found",
        }),
        { status: 404 }
      );
    }

    // Get AI response
    const result = await getAnswerFromGeminiAi(
      userChatHistory.history.map((x: any) => ({
        role: x.role,
        parts: x.parts.map((e: any) => ({ text: e.text })),
      })),
      prompt
    );

    // Update the chat history
    userChatHistory.history.push(
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: result,
          },
        ],
      }
    );

    await userChatHistory.save();

    return new NextResponse(
      JSON.stringify({
        data: userChatHistory,
      })
    );
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({
        message: (err as any).message,
      }),
      { status: 500 }
    );
  }
};
