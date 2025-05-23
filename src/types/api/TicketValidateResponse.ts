import { TicketStatus } from "../models";

export type TicketValidateResponse = {
  allowed: boolean;
  message?: string;
  status: TicketStatus;
  secret: string;
  ticketId: number;
  ticketType: {
    id: number;
    name: string;
    price: number | string;
  };
  event: {
    id: number;
    name: string;
  };
};