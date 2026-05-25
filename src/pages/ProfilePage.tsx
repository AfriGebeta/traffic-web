import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, AtSign } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button } from '@/components/ui/button';
import { colors } from '@/shared/theme/colors';
import { updateProfile } from '@/modules/auth/telegram-auth-completion/services/user.service';
import { getStoredUser } from '@/modules/auth/signup/services/signup.service';
import type { User as UserType } from '@/modules/auth/signup/types/signup.types';

export function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [status, setStatus] = useState<{ loading: boolean; error: string | null; success: boolean }>({
        loading: false,
        error: null,
        success: false,
    });

    useEffect(() => {
        const stored = getStoredUser();
        if (!stored) {
            navigate('/onboard');
            return;
        }
        setUser(stored);
        setName(stored.name ?? '');
        setUsername(stored.username ?? '');
        setPhoneNumber((stored.phoneNumber ?? '').replace(/^\+/, ''));
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedUsername = username.trim();
        const trimmedPhone = phoneNumber.trim();

        if (!trimmedName) {
            setStatus({ loading: false, error: 'Name is required.', success: false });
            return;
        }
        if (trimmedPhone.length < 10) {
            setStatus({ loading: false, error: 'Please enter a valid phone number.', success: false });
            return;
        }

        setStatus({ loading: true, error: null, success: false });

        try {
            await updateProfile(user!.id, {
                name: trimmedName,
                username: trimmedUsername || undefined,
                phoneNumber: `+${trimmedPhone}`,
            });

            const updated: UserType = { ...user!, name: trimmedName, username: trimmedUsername, phoneNumber: `+${trimmedPhone}` };
            localStorage.setItem('user', JSON.stringify(updated));
            setUser(updated);

            setStatus({ loading: false, error: null, success: true });
        } catch (err) {
            setStatus({ loading: false, error: (err as Error).message || 'Failed to update profile.', success: false });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">Edit Profile</h1>
            </div>

            <div className="flex flex-col items-center pt-8 pb-6">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
                    style={{ backgroundColor: colors.primary.main }}
                >
                    {name ? name.charAt(0).toUpperCase() : <User size={36} color="white" />}
                </div>
                {user && (
                    <p className="mt-2 text-sm text-gray-500">{user.points} points</p>
                )}
            </div>

            <div className="flex-1 px-4 pb-8">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <User size={14} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={status.loading}
                            placeholder="Your full name"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                            style={{ '--tw-ring-color': colors.primary.main } as React.CSSProperties}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <AtSign size={14} />
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={status.loading}
                            placeholder="your_username"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow"
                            style={{ '--tw-ring-color': colors.primary.main } as React.CSSProperties}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                            <Phone size={14} />
                            Phone Number
                        </label>
                        <PhoneInput
                            country={'et'}
                            value={phoneNumber}
                            onChange={(phone) => setPhoneNumber(phone)}
                            disabled={status.loading}
                            inputProps={{ required: true, minLength: 10 }}
                            enableSearch
                            searchPlaceholder="Search country"
                            countryCodeEditable={false}
                            containerStyle={{ width: '100%' }}
                            inputStyle={{
                                width: '100%',
                                height: '42px',
                                fontSize: '14px',
                                paddingLeft: '48px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                            }}
                            buttonStyle={{
                                borderRadius: '8px 0 0 8px',
                                border: '1px solid #d1d5db',
                            }}
                        />
                    </div>

                    {status.error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {status.error}
                        </p>
                    )}
                    {status.success && (
                        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            Profile updated successfully!
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={status.loading}
                        className="w-full h-11 text-white font-semibold rounded-lg transition-opacity"
                        style={{ backgroundColor: colors.primary.main }}
                    >
                        {status.loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
