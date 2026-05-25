import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../telegram-auth-completion/services/user.service";

declare global {
    interface Window {
        Telegram: {
            Login: {
                init: (options: TelegramLoginOptions, callback: TelegramAuthCallback) => void;
                open: (callback?: TelegramAuthCallback) => void;
                auth: (options: TelegramLoginOptions, callback: TelegramAuthCallback) => void;
            };
        };
    }
}

interface TelegramLoginOptions {
    client_id: number;
    request_access?: Array<"phone" | "write">;
    lang?: string;
    nonce?: string;
}

interface TelegramAuthSuccess {
    id_token: string;
    user: {
        id: number;
        name: string;
        preferred_username?: string;
        picture?: string;
        phone_number?: string;
    };
    error?: never;
}

interface TelegramAuthError {
    error: string;
    id_token?: never;
    user?: never;
}

type TelegramAuthCallback = (data: TelegramAuthSuccess | TelegramAuthError) => void;

const TELEGRAM_CLIENT_ID = 8598127900;
const apiBase = import.meta.env.VITE_API_URL ?? "";

export const TelegramLogin = () => {
    const navigate = useNavigate();
    const sdkReady = useRef(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkPhoneNumberExists = async () => {
        try {
            const user = await getMe();
            if (!user?.phoneNumber || user.phoneNumber.startsWith("telegram")) {
                navigate("/Telegram-auth-completion");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
        }
    };

    useEffect(() => {
        checkPhoneNumberExists();

        if (document.getElementById("telegram-login-sdk")) {
            sdkReady.current = true;
            return;
        }

        const script = document.createElement("script");
        script.id = "telegram-login-sdk";
        script.src = "https://telegram.org/js/telegram-login.js";
        script.async = true;
        script.onload = () => { sdkReady.current = true; };
        script.onerror = () => setError("Failed to load Telegram SDK.");
        document.head.appendChild(script);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleTelegramLogin = () => {
        if (!sdkReady.current || !window.Telegram?.Login) {
            setError("Telegram SDK not ready yet — please try again.");
            return;
        }

        setLoading(true);
        setError(null);

        window.Telegram.Login.auth(
            {
                client_id: TELEGRAM_CLIENT_ID,
                request_access: ["phone", "write"],
                lang: "en",
            },
            async (result) => {
                if (result.error) {
                    setLoading(false);
                    setError(`Telegram login failed: ${result.error}`);
                    return;
                }

                console.log("id_token :", result.id_token);
                console.log("phone    :", result?.user?.phone_number);
                console.log("name     :", result?.user?.name);
                console.log("tg id    :", result?.user?.id);

                try {
                    const res = await fetch(
                        `${apiBase}/api/users/telegram/login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id_token: result.id_token }),
                        }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        setError(data.error ?? "Telegram login failed");
                        setLoading(false);
                        return;
                    }

                    localStorage.setItem("auth_token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));

                    await checkPhoneNumberExists();

                } catch (err) {
                    console.error("Login request failed:", err);
                    setError("Network error — please try again.");
                    setLoading(false);
                }
            }
        );
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4">
            <button
                onClick={handleTelegramLogin}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-[#2AABEE] hover:bg-[#229ED9]
                           disabled:opacity-50 text-white font-semibold rounded-lg
                           transition-colors duration-200 shadow-md"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
                </svg>
                {loading ? "Logging in…" : "Log in with Telegram"}
            </button>

            {error && (
                <p className="text-red-500 text-sm max-w-xs text-center">{error}</p>
            )}
        </div>
    );
};