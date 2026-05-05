import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { updateProfile } from "./services/user.service";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../signup/services/signup.service";
import type { User as UserType } from "../signup/types/signup.types";

export default function AuthCompletion() {
    const [user, setUser] = useState<UserType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
    }, []);

    const [phoneNumber, setPhoneNumber] = useState('')
    const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ loading: false, error: null });

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedPhone = phoneNumber.trim();
        if (trimmedPhone.length < 10) {
            setStatus({ loading: false, error: 'Please enter a valid phone number.' });
            return;
        }

        setStatus({ loading: true, error: null });

        try {
            await updateProfile(user?.id as string, { phoneNumber: `+${trimmedPhone}` });
            setStatus({ loading: false, error: null });

            navigate('/');
        } catch (err) {
            setStatus({ loading: false, error: (err as Error).message || 'Failed to complete authentication.' });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-6 whitespace-nowrap text-center">Complete Your Telebirr Authentication</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4">
                <PhoneInput
                    country={'et'}
                    value={phoneNumber}
                    onChange={(phone) => setPhoneNumber(phone)}
                    disabled={status.loading}
                    inputProps={{
                        required: true,
                        id: 'phone',
                        minLength: 10
                    }}
                    enableSearch={true}
                    searchPlaceholder="Search country"
                    placeholder="your phone number"
                    countryCodeEditable={false}
                    containerStyle={{
                        width: '100%'
                    }}
                    inputStyle={{
                        width: '100%',
                        height: '42px',
                        fontSize: '14px',
                        paddingLeft: '48px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db'
                    }}
                    buttonStyle={{
                        borderRadius: '6px 0 0 6px',
                        border: '1px solid #d1d5db'
                    }}
                />
                <Button type="submit" className="w-full">{status.loading ? 'Completing...' : 'Complete'}</Button>
            </form>
        </div>
    )
}