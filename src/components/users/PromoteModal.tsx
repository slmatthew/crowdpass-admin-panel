import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect } from "react";
import { User } from "@/types/models/User";
import { Button } from "@/components/ui/Button";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "react-hot-toast";
import { Role } from "@/types/models";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated: () => void;
}

export function PromoteModal({ open, onClose, user, onUpdated }: Props) {
  const api = useApiClient();
  const [role, setRole] = useState<Role>("ADMIN");
  const [organizerId, setOrganizerId] = useState<number>();
  const [organizers, setOrganizers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (role === "MANAGER") {
      api.get("admin/organizers")
        .then((res) => {
          setOrganizers(res.data);
          setOrganizerId(res.data[0]?.id);
        })
        .catch(() => toast.error("Не удалось загрузить организаторов"));
    }
  }, [role]);

  const handleSubmit = async () => {
    if (!user) return;
    if (role === "MANAGER" && !organizerId) {
      toast.error("Выберите организатора");
      return;
    }

    try {
      await api.post(`/admin/users/${user.id}/make-admin`, {
        role,
        organizerId: role === "MANAGER" ? organizerId : undefined,
      });
      toast.success("Пользователь назначен администратором");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Ошибка при назначении админа");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm space-y-4">
          <DialogTitle className="text-lg font-medium">Назначить администратором</DialogTitle>

          <div>
            <label className="block text-sm font-medium mb-1">Роль</label>
            <select
              className="select w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          {role === "MANAGER" && (
            <div>
              <label className="block text-sm font-medium mb-1">Организатор</label>
              <select
                className="select w-full"
                value={organizerId}
                onChange={(e) => setOrganizerId(Number(e.target.value))}
              >
                {organizers.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSubmit}>Назначить</Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}