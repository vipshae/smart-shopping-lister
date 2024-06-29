import type { Document, Types } from "mongoose";

export interface ItemInterface extends Document {
  id: string;
  name: string;
  completed: boolean;
  list: string;
}

export interface ShoppingListInterface extends Document {
  id: string;
  name: string;
  isFinished: boolean;
  items: Types.DocumentArray<ItemInterface>;
}
