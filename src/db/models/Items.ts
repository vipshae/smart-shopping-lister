import mongoose, { Schema, Types } from "mongoose";
import type { ItemInterface } from "../interfaces/db.interfaces";

const ItemsSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  list: {
    type: String,
    required: true,
  },
});

export const ItemModel =
  mongoose.models.Items || mongoose.model<ItemInterface>("Items", ItemsSchema);
