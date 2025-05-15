import { Subcategory } from "./Subcategory";
import { Event } from "./Event";

export interface Category {
  id: number;
  name: string;
  isDeleted: boolean;
  subcategories?: Subcategory[];
  events?: Event[];
}