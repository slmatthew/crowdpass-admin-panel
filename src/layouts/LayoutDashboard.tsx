import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { RoleBadge } from "@/components/RoleBadge";
import RoleAccess from "@/components/RoleAccess";

export default function LayoutDashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-64 flex-col justify-between bg-gray-900 text-white p-6">
        <SidebarNav user={user} logout={logout} />
      </aside>

      {/* Sidebar (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Black overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg overflow-hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setSidebarOpen(false)}>
                  <X />
                </button>
              </div>
              <SidebarNav user={user} logout={logout} onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Контент */}
      <div className="flex-1 flex flex-col relative">
        {/* Fixed header (mobile only) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <span className="font-semibold text-gray-700">Админ-панель</span>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-6 px-4 md:px-6 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarNav({
  user,
  logout,
  onNavigate,
}: {
  user: any;
  logout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex flex-col gap-4">
        <SidebarLink to="/dashboard" label="Главная" onClick={onNavigate} />
        <SidebarLink to="/bookings" label="Бронирования" onClick={onNavigate} />
        <SidebarLink to="/events" label="Мероприятия" onClick={onNavigate} />
        <RoleAccess allow={['MANAGER']}>
          <SidebarLink to="/organizers/me" label="Организатор" />
        </RoleAccess>
        <RoleAccess allow={['ROOT', 'ADMIN']}>
          <SidebarLink to="/organizers" label="Организаторы" />
          <SidebarLink to="/categories" label="Категории" onClick={onNavigate} />
          <SidebarLink to="/users" label="Пользователи" onClick={onNavigate} />
          <SidebarLink to="/logs" label="Логи" onClick={onNavigate} />
        </RoleAccess>
      </nav>

      <div className="pt-6 border-t border-white/20 mt-6 text-sm">
        <div className="font-semibold">
          {user?.firstName} {user?.lastName}
        </div>
        {/* <div className="text-xs text-white/60 mb-2">{user?.admin?.role}</div> */}
        {user?.admin?.role && <RoleBadge role={user?.admin?.role} />}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </>
  );
}

function SidebarLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm transition ${
          isActive
            ? "bg-white text-gray-900 font-semibold"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
