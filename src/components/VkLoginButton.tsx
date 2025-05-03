import { useEffect, useRef, useState } from "react";
import {
  Config,
  OneTap,
  WidgetEvents,
  OneTapInternalEvents,
  ConfigResponseMode,
  ConfigAuthMode
} from "@vkid/sdk";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateCodeChallenge, generateCodeVerifier } from "../utils/vkid/pkce";
import { appConfig } from "../config/appConfig";
import { generateState } from "../utils/vkid/generateState";

export default function VkLoginButton() {
  const vkContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  useEffect(() => {
    async function initVKID() {
      if (!vkContainerRef.current) return;

      const verifier = generateCodeVerifier();
      setCodeVerifier(verifier);
      sessionStorage.setItem("vkid_code_verifier", verifier);

      const challenge = await generateCodeChallenge(verifier);

      const state = generateState();
      sessionStorage.setItem("vkid_state", state);

      vkContainerRef.current.innerHTML = "";

      Config.init({
        app: appConfig.vk.app_id,
        redirectUrl: appConfig.vk.redirect_uri,
        responseMode: ConfigResponseMode.Callback,
        mode: ConfigAuthMode.Redirect,
        codeChallenge: challenge,
        state,
      });

      const oneTap = new OneTap();

      oneTap.render({
        container: vkContainerRef.current,
        showAlternativeLogin: false,
        fastAuthEnabled: false,
      })
      .on(WidgetEvents.ERROR, (error: any) => {
        console.error("VK ID Error:", error);
      })
      .on(OneTapInternalEvents.LOGIN_SUCCESS, handleVKLogin);
    }

    initVKID();
  }, []);

  async function handleVKLogin(payload: any) {
    if (!codeVerifier) {
      console.error("code_verifier отсутствует");
      return;
    }

    try {
      const response = await axios.post(appConfig.vk.auth_handler_uri, {
        code: payload.code,
        code_verifier: codeVerifier,
        device_id: payload.device_id,
      });
    
      const data = response.data;
    
      if (data.token) {
        localStorage.setItem("admin_token", data.token);
        navigate('/dashboard');
      } else {
        console.error("Не удалось авторизоваться через VK ID", data);
      }
    } catch (err) {
      console.error("Ошибка авторизации через VK ID", err);
    }
  }

  return <div ref={vkContainerRef} />;
}
