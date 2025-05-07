import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/Button";
import { User } from "@/types/models/User";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export function UserModal({ open, onClose, user }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <DialogTitle className="text-lg font-semibold">
            Пользователь #{user.id}
          </DialogTitle>

          <div className="space-y-1 text-sm text-gray-700">
            <p><strong>Имя:</strong> {user.firstName}</p>
            <p><strong>Фамилия:</strong> {user.lastName}</p>
            {user.email && <p><strong>Email:</strong> {user.email}</p>}
            {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
            {user.telegramId && <p><strong>Telegram ID:</strong> {user.telegramId}</p>}
            {user.vkId && <p><strong>VK ID:</strong> <a href={`https://vk.com/id${user.vkId}`} target="_blank">{user.vkId}</a></p>}
          </div>

          {user.admin && (
            <div className="pt-4 border-t border-gray-200 space-y-1 text-sm text-gray-800">
              <p className="font-semibold">Администратор</p>
              <p><strong>Роль:</strong> {user.admin.role}</p>
              {user.admin.organizer && (
                <p>
                  <strong>Организатор:</strong> {user.admin.organizer.name} (#{user.admin.organizer.id})
                </p>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>Закрыть</Button>
            <Button variant="primary" size="sm" className="ml-2">Перейти</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}