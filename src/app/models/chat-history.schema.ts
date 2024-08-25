import { timeStamp } from "console";
import * as mongoose from "mongoose";

const userChatHistory = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "model"],
          required: true,
        },
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.userChatHistory ||
  mongoose.model("userChatHistory", userChatHistory);
