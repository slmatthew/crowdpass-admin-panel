import { Category } from "./Category";
import { Organizer } from "./Organizer";
import { Subcategory } from "./Subcategory";
import { TicketType } from "./TicketType";

export interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  posterUrl?: string;
  organizerId: number;
  categoryId: number;
  subcategoryId: number;
  organizer: Organizer;
  category: Category;
  subcategory: Subcategory;
  ticketTypes: TicketType[];
}