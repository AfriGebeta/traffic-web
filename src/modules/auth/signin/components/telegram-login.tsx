import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../telegram-auth-completion/services/user.service";

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void;
    }
}

export const TelegramLogin = () => {
    const navigate = useNavigate();
    const telegramRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkPhoneNumberExists = async () => {
            try {
                const user = await getMe();

                if (
                    !user?.phoneNumber ||
                    user.phoneNumber.startsWith("telegram")
                ) {
                    navigate("/Telegram-auth-completion");
                }
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };

        checkPhoneNumberExists();

        window.onTelegramAuth = (user) => {
            console.log("Telegram User:", user);

            // send to backend here
        };

        if (!telegramRef.current) return;

        telegramRef.current.innerHTML = "";

        const script = document.createElement("script");

        script.src =
            "https://telegram.org/js/telegram-widget.js?22";

        script.async = true;

        script.setAttribute(
            "data-telegram-login",
            "GebetaTrafficBot"
        );

        script.setAttribute("data-size", "large");

        script.setAttribute("data-userpic", "false");

        script.setAttribute(
            "data-request-access",
            "write"
        );

        script.setAttribute(
            "data-onauth",
            "onTelegramAuth(user)"
        );

        telegramRef.current.appendChild(script);
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div ref={telegramRef} />
        </div>
    );
};