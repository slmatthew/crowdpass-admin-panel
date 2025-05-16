import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { appConfig } from "../../config/appConfig";
import { useAuth } from "../../context/AuthContext";

export default function VkCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const deviceId = urlParams.get("device_id");

    const codeVerifier = sessionStorage.getItem("vkid_code_verifier");
    const state = sessionStorage.getItem("vkid_state");

    if (code && deviceId && codeVerifier) {
      (async () => {
        try {
          const response = await axios.post(appConfig.vk.auth_handler_uri, {
            code,
            device_id: deviceId,
            code_verifier: codeVerifier,
            state,
          });

          const { accessToken, refreshToken } = response.data;
          if (accessToken && refreshToken) {
            login(accessToken, refreshToken);
            navigate("/dashboard");
          } else {
            setError("Не удалось авторизоваться через VK ID.");
          }
        } catch (err) {
          console.error("Ошибка авторизации через VK ID:", err);
          setError("Ошибка при авторизации.");
        }
      })();
    } else {
      setError('Необходимо выполнить авторизацию через VK ID');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-8 rounded-lg shadow-lg bg-white text-center">
        <h1 className="text-2xl font-bold mb-4">Вход в админ-панель</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!error && <p>Авторизация через VK ID...</p>}
      </div>
    </div>
  );
}
