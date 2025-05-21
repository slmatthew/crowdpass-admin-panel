import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { User } from "@/types/models/User";
import { Button } from "@/components/ui/Button";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated: () => void;
}

export function IdEditModal({ open, onClose, user, onUpdated }: Props) {
  const api = useApiClient();
  const [userId, setUserId] = useState<number | null>(user?.id ?? null);
  const [telegramId, setTelegramId] = useState<string | null>(user?.telegramId ?? null);
  const [vkId, setVkId] = useState<string | null>(user?.vkId ?? null);

  // const handleSave = async () => {
  //   if (!user) return;
  //   await api.post(`admin/users/${user.id}/update-platform-ids`, {
  //     telegramId,
  //     vkId,
  //   });
  //   toast.success("ID платформ обновлены");
  //   onUpdated();
  //   onClose();
  // };

  const handleReset = async (targetPlatform: 'vk' | 'telegram') => {
    if(!userId) return;

    try {
      await api.post(`admin/users/${userId}/reset-platform`, { targetPlatform });
      toast.success(`Сброшен ID для платформы ${targetPlatform}`);

      onUpdated();
      onClose();
    } catch(err: any) {
      console.error(err);
      if(err instanceof AxiosError) {
        if(err.response?.data.message) {
          return toast.error(err.response.data.message);
        }
      }

      toast.error('Произошла ошибка');
    }
  };

  useEffect(() => {
    if(user) {
      setUserId(user.id);
      setTelegramId(user.telegramId ?? null);
      setVkId(user.vkId ?? null);
    }
  }, [user]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md w-full max-w-sm space-y-4">
          <DialogTitle className="text-lg font-medium">Редактировать ID платформ</DialogTitle>

          <div>
            <label className="block text-sm font-medium mb-1">Telegram ID</label>
            <div className="flex flex-nowrap gap-2">
              <input
                type="text"
                className="input w-full disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                value={telegramId ?? ''}
                onChange={(e) => setTelegramId(e.target.value)}
                disabled={true}
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReset('telegram')}
                disabled={!telegramId || (!!telegramId && !vkId)}
              >
                Удалить
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <Link
                to={`https://vk.com/id${vkId}`}
                target="_blank"
                className="inline-block mt-3 text-blue-600 hover:underline text-sm"
              >
                VK ID
              </Link>
            </label>
            <div className="flex flex-nowrap gap-2">
              <input
                type="text"
                className="input w-full disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                value={vkId ?? ''}
                onChange={(e) => setVkId(e.target.value)}
                disabled={true}
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReset('vk')}
                disabled={!vkId || (!!vkId && !telegramId)}
              >
                Удалить
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={onClose}>
              Закрыть
            </Button>
            {/* <Button size="sm" onClick={handleSave}>Сохранить</Button> */}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}