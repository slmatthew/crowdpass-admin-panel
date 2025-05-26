import { Category } from "./Category";
import { Organizer } from "./Organizer";
import { Subcategory } from "./Subcategory";
import { TicketType } from "./TicketType";

export interface Event {
  id: number;
  slug?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  posterUrl?: string;
  organizerId: number;
  categoryId: number;
  subcategoryId: number;
  isPublished: boolean;
  isSalesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;

  organizer: Organizer;
  category: Category;
  subcategory: Subcategory;
  ticketTypes: TicketType[];
}