import { timeStamp } from "console";
import * as mongoose from "mongoose";

const userChats = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    chats: [
      {
        title: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.userChats ||
  mongoose.model("userChats", userChats);
