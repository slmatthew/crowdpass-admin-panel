import { useEffect, useRef } from "react";

export default function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Очищаем контейнер
    containerRef.current.innerHTML = "";

    // Создаем скрипт Telegram
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "CrowdPassBot"); // например: ticket_admin_bot
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://crowdpass-api.slmatthew.dev/api/auth/telegram/callback");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} />;
}
