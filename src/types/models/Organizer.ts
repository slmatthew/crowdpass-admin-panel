import { Admin, Event } from ".";

export interface Organizer {
  id: number;
  name: string;
  description?: string;
  contacts?: string;
  events: Event[];
  admins: Admin[];
}