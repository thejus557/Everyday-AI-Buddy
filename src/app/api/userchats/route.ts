import { NextRequest, NextResponse } from "next/server";

import UserChats from "../../models/user-chats.schema";
import UserChatHistory from "../../models/chat-history.schema";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const userId = searchParams.get("userId");

    // Connect to the database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string);
    }

    const userChats = await UserChats.find({
      userId: userId,
    });

    if (!userChats) {
      return new NextResponse(
        JSON.stringify({
          data: [],
        }),
        { status: 200 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: userChats,
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
