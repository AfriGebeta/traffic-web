import { LoginForm } from "@/modules/auth/signin/components/login-form";
import { LoginButton } from "@telegram-auth/react";
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

  const apiBase = import.meta.env.VITE_API_URL;
  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;

  const handleSuccess = () => navigate("/");
  console.log({ apiBase, botUsername });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <LoginButton
          botUsername={botUsername}
          onAuthCallback={async (payload: TelegramAuthPayload) => {
            console.log({ payload })
            const res = await fetch(`${apiBase}/api/users/telegram/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
              alert(data.error || "Telegram login failed");
              return;
            }

            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate("/");
            console.log("Telegram Auth Payload:", payload);
          }}
          buttonSize="large"
          cornerRadius={5}
          showAvatar={true}
          lang="en"
        />
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}