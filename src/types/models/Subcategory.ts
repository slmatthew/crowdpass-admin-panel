import { Category } from "./Category";
import { Event } from "./Event";

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  category: Category;
  events: Event[];
}