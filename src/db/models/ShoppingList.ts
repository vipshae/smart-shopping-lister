import mongoose, { Schema, Types } from "mongoose";
import type { ShoppingListInterface } from "../interfaces/db.interfaces";

const ShoppingListSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    isFinished: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: "Items",
      },
    ],
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ShoppingListModel =
  mongoose.models.ShoppingList ||
  mongoose.model<ShoppingListInterface>("ShoppingList", ShoppingListSchema);
