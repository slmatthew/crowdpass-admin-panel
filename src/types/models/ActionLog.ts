import { User } from "./User";

export interface ActionLog {
  id: number;
  actorId: number;
  action: string;
  targetType: string;
  targetId: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor: User;
}