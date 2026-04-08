import { LoginForm } from "@/modules/auth/signin/components/login-form";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

type TelegramAuthPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const telegramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "gebeta_maps_traffic_bot";
    const apiBase = import.meta.env.VITE_API_URL;

    // Called by Telegram widget
    (window as any).onTelegramAuth = async (user: TelegramAuthPayload) => {
      const res = await fetch(`${apiBase}/api/users/telegram/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Telegram login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    };

    if (telegramRef.current) {
      telegramRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", botUsername);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-radius", "8");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      telegramRef.current.appendChild(script);
    }

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [navigate]);

  const handleSuccess = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex justify-center" ref={telegramRef} />
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}