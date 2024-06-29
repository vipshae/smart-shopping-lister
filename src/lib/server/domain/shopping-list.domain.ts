import type { Item } from "./item.domain";

export interface ShoppingList {
  id: string;
  name: string;
  isFinished: boolean;
  items: Array<Item>;
}
