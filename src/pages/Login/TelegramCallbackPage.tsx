import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TelegramCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      login(token);
      navigate("/dashboard");
    } else {
      setError("Не удалось авторизоваться через Telegram.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 rounded-lg shadow-lg bg-white text-center">
        <h1 className="text-2xl font-bold mb-4">Вход в админ-панель</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!error && <p>Авторизация через Telegram...</p>}
      </div>
    </div>
  );
}
