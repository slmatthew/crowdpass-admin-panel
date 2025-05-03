import { Subcategory } from "./Subcategory";
import { Event } from "./Event";

export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
  events: Event[];
}