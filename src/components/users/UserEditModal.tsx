import { Checkbox, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { User } from "@/types/models/User";
import { Button } from "@/components/ui/Button";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated: () => void;
}

export function UserEditModal({ open, onClose, user, onUpdated }: Props) {
  const api = useApiClient();
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [removePhone, setRemovePhone] = useState<boolean>(false);

  const handleSave = async () => {
    if (!user) return;

    try {
      await api.put(`/admin/users/${user.id}`, {
        firstName,
        lastName,
        email,
        phone,
        removePhone,
      });
      toast.success("Данные пользователя обновлены");
      onUpdated();

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setRemovePhone(false);

      onClose();
    } catch(err) {
      console.error(err);
      let message = 'Произошла ошибка';
      if(err instanceof AxiosError) {
        if(err.response?.data.message) {
          message = `Произошла ошибка: ${err.response.data.message}`
        }
      }

      toast.error(message);
    }
  };

  useEffect(() => {
    if(open && user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
    }
  }, [open]);

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
              className="input w-full disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Не указан"
              disabled={true}
            />
          </div>

          {phone && phone.length > 0 && (
            <div className="flex flex-nowrap">
              <label className="block text-sm font-medium mb-1">
                Удалить телефон
              </label>
              <Checkbox
                checked={removePhone}
                onChange={setRemovePhone}
                className="group block size-4 rounded border bg-white data-checked:bg-blue-500 ml-2"
              >
                {/* Checkmark icon */}
                <svg className="stroke-white opacity-0 group-data-checked:opacity-100" viewBox="0 0 14 14" fill="none">
                  <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Checkbox>
            </div>
          )}

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