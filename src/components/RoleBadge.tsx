import { Role } from "@/types/models/Role";
import clsx from "clsx";

export function RoleBadge({ role }: { role: Role }) {
  const label = {
    'ROOT': "Суперпользователь",
    'ADMIN': "Сотрудник",
    'MANAGER': "Организатор",
  }[role];

  const color = {
    'ROOT': "bg-red-600 text-white",
    'ADMIN': "bg-blue-600 text-white",
    'MANAGER': "bg-green-600 text-white",
  }[role];

  return (
    <span
      className={clsx(
        "text-xs font-semibold px-2 py-0.5 rounded-md",
        color
      )}
    >
      {label}
    </span>
  );
}