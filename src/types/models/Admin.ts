import { Role, User, Organizer } from ".";

export interface Admin {
  id: number;
  userId: number;
  role: Role;
  organizerId?: number;
  createdAt: string;
  user: User;
  organizer?: Organizer;
}