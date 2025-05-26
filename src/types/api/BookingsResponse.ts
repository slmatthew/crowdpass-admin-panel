import { BookingStatus, TicketStatus } from "../models";

export type BookingsResponse = {
  bookings: {
    items: {
      id: number;
      userId: number;
      status: BookingStatus;
      createdAt: Date;
      updatedAt: Date;
      tickets: {
        id: number;
        qrCodeSecret: string | null;
        status: TicketStatus;
        owner: {
          fn: string | null;
          ln: string | null;
        };
        ticketTypeId: number;
      }[];
    }[],
    total: number;
  },
  events: {
    id: number;
    slug: string | null;
    name: string;
    isActive: boolean;
  }[];
  ticketTypes: {
    id: number;
    slug: string | null;
    name: string;
    price: number;
    eventId: number;
    isActive: boolean;
  }[];
  users: {
    id: number;
    telegramId: string | null;
    vkId: string | null;
    email: string | null;
    firstName: string;
    lastName: string;
    phone: string | null;
    createdAt: Date;
    isBanned: boolean;
  }[];
};