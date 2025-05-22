import { ActionLogAction } from "@/types/enums/ActionLogAction";

export const actionLogLabels: Record<string, string> = {
  [ActionLogAction.AUTH_TELEGRAM]: "АП логин через Telegram",
  [ActionLogAction.AUTH_VK]: "АП логин через VK",

  [ActionLogAction.EVENT_CREATE]: "Мероприятие создано",
  [ActionLogAction.EVENT_UPDATE]: "Мероприятие обновлено",

  [ActionLogAction.BOOKING_STATUS_UPDATE]: "Бронь: статус обновлен",

  [ActionLogAction.ROOT_PURPOSE]: "Назначение ROOT",
};