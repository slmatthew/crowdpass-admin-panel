import { Category } from "./Category";
import { Event } from "./Event";

export interface Subcategory {
  id: number;
  name: string;
  isDeleted: boolean;
  categoryId: number;
  category?: Category;
  events?: Event[];
}