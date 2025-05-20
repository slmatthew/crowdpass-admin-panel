import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/models/User";
import { UserCard } from "@/components/users/UserCard";
import { UserEditModal } from "@/components/users/UserEditModal";
import { IdEditModal } from "@/components/users/IdEditModal";
import { PromoteModal } from "@/components/users/PromoteModal";
import { useDebounce } from "@/hooks/useDebounce";
import { Header } from "@/components/Header/Header";

export default function UsersPage() {
  const api = useApiClient();
  const { role: currentRole } = useAuth();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [idEditOpen, setIdEditOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["users", debouncedSearch, page],
    queryFn: async () => {
      const res = await api.get("/admin/users", {
        params: { search: debouncedSearch, page, pageSize },
      });
      return res.data;
    },
  });

  const users: User[] = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const refresh = () => refetch();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleIdEdit = (user: User) => {
    setSelectedUser(user);
    setIdEditOpen(true);
  };

  const handlePromote = (user: User) => {
    setSelectedUser(user);
    setPromoteOpen(true);
  };

  const handleDemote = async (user: User) => {
    await api.delete(`/admin/users/${user.id}/remove-admin`);
    toast.success("Права администратора сняты");
    refresh();
  };

  return (
    <div className="space-y-6">
      <Header>
        <Header.Text>Пользователи</Header.Text>

        <Header.Button variant="ghost" onClick={refresh} isLoading={isRefetching}>
          {isLoading ? 'Обновляется...' : '🔄 Обновить'}
        </Header.Button>
      </Header>

      <input
        type="text"
        className="input w-full max-w-md"
        placeholder="Поиск по ID, имени, email, телефону..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // сброс страницы
        }}
      />

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentAdminRole={currentRole ?? "ADMIN"}
              onEdit={() => handleEdit(user)}
              onIdEdit={() => handleIdEdit(user)}
              onPromote={() => handlePromote(user)}
              onDemote={() => handleDemote(user)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <Button size="sm" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            ⬅️ Назад
          </Button>
          <span className="text-sm px-2 py-1 border rounded">
            стр. {page} / {totalPages}
          </span>
          <Button size="sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Вперёд ➡️
          </Button>
        </div>
      )}

      {/* Модалки */}
      <UserEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={selectedUser}
        onUpdated={refresh}
      />

      <IdEditModal
        open={idEditOpen}
        onClose={() => setIdEditOpen(false)}
        user={selectedUser}
        onUpdated={refresh}
      />

      <PromoteModal
        open={promoteOpen}
        onClose={() => setPromoteOpen(false)}
        user={selectedUser}
        onUpdated={refresh}
      />
    </div>
  );
}