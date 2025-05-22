import { TicketStatus } from "@/types/models";

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getDisplayTicketStatus(ticketStatus: TicketStatus): string {
  switch(ticketStatus) {
    case 'AVAILABLE': return 'Доступен';
    case 'RESERVED': return 'Забронирован';
    case 'SOLD': return 'Продан';
    case 'USED': return 'Использован';
    default: return ticketStatus;
  }
};