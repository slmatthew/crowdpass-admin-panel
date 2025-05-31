import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { User, Admin } from "@/types/models";
import dayjs from "dayjs";

interface Props {
  user: User;
  currentAdmin: Admin | null;
  onEdit: (user: User) => void;
  onIdEdit: (user: User) => void;
  onPromote: (user: User) => void;
  onDemote: (user: User) => void;
  onBan: (user: User, status: boolean) => void;
}

export function UserCard({ user, currentAdmin, onEdit, onIdEdit, onPromote, onDemote, onBan }: Props) {
  const { features } = useAuth();
  const banEnabled = features ? features.ap.ban : false;

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const isAdmin = !!user.admin;
  const canModify = currentAdmin && (
    currentAdmin.role === "ROOT" || (currentAdmin.role === "ADMIN" && user.admin?.role !== "ROOT"));
  const canBan = currentAdmin && (
    !user.admin ||
    (user.admin && currentAdmin.role !== 'ROOT') ||
    (user.admin && user.admin.role === 'ROOT' && currentAdmin.role === 'ROOT')
  ) && user.id !== currentAdmin.userId;

  return (
    <Card className="relative p-4">
      <div className="absolute top-2 right-2">
        {isAdmin && (
          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
            {user.admin?.role}
          </span>
        )}
      </div>

      <div className="text-lg font-semibold">
        <span className={user.isBanned ? 'text-gray-500' : ''}>{fullName || "Без имени"}</span> <span className="text-gray-400 text-sm">#{user.id}</span>
      </div>

      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <div className="text-xs text-gray-400">
          Email: {user.email || "—"}, Телефон: {user.phone || "—"}
        </div>
        <div className="text-xs text-gray-400">
          Telegram ID: {user.telegramId ? (<a href={`tg://user?id=${user.telegramId}`} target="_blank">{user.telegramId}</a>) : "—"},
          VK ID: {user.vkId ? (<a href={`https://vk.com/id${user.vkId}`} target="_blank">{user.vkId}</a>) : "—"}
        </div>
        <div className="text-xs text-gray-400">
          Дата регистрации: {dayjs(user.createdAt).format('DD.MM.YYYY в HH:mm:ss')}
        </div>
        {user.isBanned && user.bannedAt && (
          <div className="text-xs text-gray-400">
            Дата блокировки: {dayjs(user.bannedAt).format('DD.MM.YYYY в HH:mm:ss')}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="text-sm text-gray-400">
          {isAdmin ? (
            <>
              {canModify && (
                <Button variant="destructive" size="sm" onClick={() => onDemote(user)} disabled={currentAdmin.userId === user.id}>
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
          <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
            ✏️ Редактировать
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onIdEdit(user)}
            disabled={(!!user.vkId && !user.telegramId) || (!user.vkId && !!user.telegramId)}
          >
            🆔 ID
          </Button>
          {banEnabled && user.isBanned && (
            <Button disabled={!canBan} variant="ghost" size="sm" onClick={() => onBan(user, false)}>
              ✅ Разбан
            </Button>
          )}
          {banEnabled && !user.isBanned && (
            <Button disabled={!canBan} variant="ghost" size="sm" onClick={() => onBan(user, true)}>
              ⛔️ Бан
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}