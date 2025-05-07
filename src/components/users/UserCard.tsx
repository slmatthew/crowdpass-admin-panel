import { User } from "@/types/models/User";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Role } from "@/types/models";

interface Props {
  user: User;
  currentAdminRole: Role;
  onEdit: (user: User) => void;
  onIdEdit: (user: User) => void;
  onPromote: (user: User) => void;
  onDemote: (user: User) => void;
}

export function UserCard({ user, currentAdminRole, onEdit, onIdEdit, onPromote, onDemote }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const isAdmin = !!user.admin;
  const canModify =
    currentAdminRole === "ROOT" || (currentAdminRole === "ADMIN" && user.admin?.role !== "ROOT");

  return (
    <Card className="">
      <div>
        <div className="font-semibold">
          {fullName || "Без имени"}
          <span className="text-xs text-gray-400">&nbsp;#{user.id}</span>  
        </div>
        <div className="text-xs text-gray-400">
          Email: {user.email || "—"}, Телефон: {user.phone || "—"}
        </div>
        <div className="text-xs text-gray-400">
          Telegram ID: {user.telegramId ? (<a href={`tg://user?id=${user.telegramId}`} target="_blank">{user.telegramId}</a>) : "—"},
          VK ID: {user.vkId ? (<a href={`https://vk.com/id${user.vkId}`} target="_blank">{user.vkId}</a>) : "—"}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-sm text-gray-400">
          {isAdmin ? (
            <>
              <span className="mr-4">{user.admin?.role}</span>
              {canModify && (
                <Button variant="destructive" size="sm" onClick={() => onDemote(user)}>
                  Снять права
                </Button>
              )}
            </>
          ) : (
            canModify && (
              <Button size="sm" onClick={() => onPromote(user)}>
                Назначить админом
              </Button>
            )
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
            ✏️ Редактировать
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onIdEdit(user)}>
            🆔 ID
          </Button>
        </div>
      </div>
    </Card>
  );
}