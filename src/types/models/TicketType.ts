import { Ticket } from "./Ticket";
import { Event } from "./Event";

export interface TicketType {
  id: number;
  eventId: number;
  name: string;
  price: number;
  quantity: number;
  event: Event;
  tickets: Ticket[];
}