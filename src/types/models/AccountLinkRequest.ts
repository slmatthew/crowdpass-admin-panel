import { User } from "./User";

export type AccountLinkPlatform = "TELEGRAM" | "VK";

export interface AccountLinkRequest {
  id: number;
  code: string;
  sourceId: number;
  targetId: number;
  platform: AccountLinkPlatform;
  confirmed: boolean;
  createdAt: string;
  source: User;
  target: User;
}
