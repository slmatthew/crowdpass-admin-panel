import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { User } from "@/types/models/User";
import { Button } from "@/components/ui/Button";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated: () => void;
}

export function UserEditModal({ open, onClose, user, onUpdated }: Props) {
  const api = useApiClient();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = async () => {
    if (!user) return;
    await api.put(`/admin/users/${user.id}`, {
      firstName,
      lastName,
      email,
      phone,
    });
    toast.success("Данные пользователя обновлены");
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md w-full max-w-sm space-y-4">
          <DialogTitle className="text-lg font-medium">Редактировать пользователя</DialogTitle>

          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <input
              type="text"
              className="input w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Фамилия</label>
            <input
              type="text"
              className="input w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Телефон</label>
            <input
              type="tel"
              className="input w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}