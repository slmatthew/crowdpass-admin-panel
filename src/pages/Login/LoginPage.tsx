import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import VkLoginButton from "@/components/VkLoginButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    // Убираем скролл на странице логина
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthenticated]);

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-200 relative">
      {/* Размытые декоративные круги */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%] z-0" />
      <div className="absolute w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%] z-0" />

      {/* Карточка логина */}
      <motion.div
        className="relative z-10 bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 w-full max-w-sm min-w-[260px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-center">Вход в админ-панель</h1>

        <TelegramLoginButton />

        <div className="w-full min-w-[240px]">
          <VkLoginButton />
        </div>

        <p className="text-sm text-gray-400 mt-2">Выберите способ входа</p>
      </motion.div>
    </div>
  );
}
