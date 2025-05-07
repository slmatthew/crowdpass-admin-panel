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

export function IdEditModal({ open, onClose, user, onUpdated }: Props) {
  const api = useApiClient();
  const [telegramId, setTelegramId] = useState(user?.telegramId || "");
  const [vkId, setVkId] = useState(user?.vkId || "");

  const handleSave = async () => {
    if (!user) return;
    await api.post(`/admin/users/${user.id}/update-platform-ids`, {
      telegramId,
      vkId,
    });
    toast.success("ID платформ обновлены");
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md w-full max-w-sm space-y-4">
          <DialogTitle className="text-lg font-medium">Редактировать ID платформ</DialogTitle>

          <div>
            <label className="block text-sm font-medium mb-1">Telegram ID</label>
            <input
              type="text"
              className="input w-full"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">VK ID</label>
            <input
              type="text"
              className="input w-full"
              value={vkId}
              onChange={(e) => setVkId(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button size="sm" onClick={handleSave}>Сохранить</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}