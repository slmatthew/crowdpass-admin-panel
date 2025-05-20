import { appConfig } from "@/config/appConfig";
import { useEffect, useRef } from "react";

export default function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = appConfig.telegram.widget_url;
    script.setAttribute("data-telegram-login", appConfig.telegram.bot_username);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", appConfig.telegram.auth_url);
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.async = true;

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} />;
}
