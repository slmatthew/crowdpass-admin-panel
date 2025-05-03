import { Admin } from "./Admin";
import { Booking } from "./Booking";
import { AccountLinkRequest } from "./AccountLinkRequest";

export interface User {
  id: number;
  telegramId?: string;
  vkId?: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  bookings: Booking[];
  admin?: Admin;
  sourceLinkRequests: AccountLinkRequest[];
  targetLinkRequests: AccountLinkRequest[];
}
