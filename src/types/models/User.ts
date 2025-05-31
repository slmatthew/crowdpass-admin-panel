import { Admin } from "./Admin";
import { Booking } from "./Booking";

export interface User {
  id: number;
  telegramId: string | null;
  vkId: string | null;
  email: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
  bookings: Booking[];
  admin?: Admin | null;
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
  bannedAt: string | null;
}
