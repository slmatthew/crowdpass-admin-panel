import { Event, TicketType } from "../models";

export type EventOverviewStats = {
  totalTickets: number;
  availableTickets: number;
  reservedTickets: number;
  soldTickets: number;
  usedTickets: number;
};

export type EventOverviewTicketType = TicketType & {
  stats: EventOverviewStats;
};

export type EventOverviewResponse = Omit<Event, 'ticketTypes'> & {
  ticketTypes: Array<EventOverviewTicketType>;
  stats: EventOverviewStats;
  revenue: number;
};