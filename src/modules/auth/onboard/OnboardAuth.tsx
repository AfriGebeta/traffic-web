import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { TelegramLogin } from "../signin/components/telegram-login";

export const OnboardAuth = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col justify-center items-center gap-1">
                <img
                    src="/assets/gebetamaps.png"
                    alt="Logo"
                    className="w-40 h-40 object-contain"
                />
                <h3 className="text-xl">Gebeta Maps</h3>
                <p className="text-muted-foreground">
                    Register to continue
                </p>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center">
                <TelegramLogin />
                <Button
                    className="text-[#ffa500]"
                    variant="outline"
                    onClick={() => navigate("/signup")}
                >
                    I don't have Telegram
                </Button>
            </div>
        </div>
    )
}