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

export const TelegramLogin = () => {
    const navigate = useNavigate();

    const apiBase = import.meta.env.VITE_API_URL;
    const botUsername = "GebetaTrafficBot";

    return (
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
            showAvatar={false}
            lang="en"
        />
    )
}