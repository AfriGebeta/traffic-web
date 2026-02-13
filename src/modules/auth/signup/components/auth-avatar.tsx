import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { getStoredUser, logout } from '../services/signup.service';
import { colors } from '@/shared/theme/colors';
import type { User as UserType } from '../types/signup.types';

export function AuthAvatar() {
    const [user, setUser] = useState<UserType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = getStoredUser();
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors font-semibold text-lg"
                    style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: colors.primary.main, color: colors.primary.main }}
                >
                    {user ? user.name.charAt(0).toUpperCase() : <User size={24} style={{ color: colors.primary.main }} />}
                </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-48 p-2">
                <div className="space-y-1">
                    <h3 className="font-semibold text-sm mb-1 px-2">{user ? 'Profile' : 'Menu'}</h3>
                    <div className="border-t border-gray-200 my-1"></div>

                    {user ? (
                        <>
                            <div className="p-2 bg-gray-50 rounded-lg text-xs">
                                <div className="text-xs text-gray-600">Name</div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-600 mt-1">Phone</div>
                                <div className="font-medium text-gray-900">{user.phoneNumber}</div>
                                <div className="text-xs text-gray-600 mt-1">Points</div>
                                <div className="font-medium text-gray-900">{user.points}</div>
                            </div>

                            <button
                                onClick={() => alert('Leaderboard coming soon!')}
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                            >
                                <span>Leaderboard</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full py-1.5 px-2 text-white rounded-lg transition-colors text-sm text-left"
                                style={{ backgroundColor: colors.primary.main }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/signup')}
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                            >
                                <span>Sign Up</span>
                            </button>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                            >
                                <span>Sign In</span>
                            </button>

                            <button
                                onClick={() => alert('Leaderboard coming soon!')}
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left"
                            >
                                <span>Leaderboard</span>
                            </button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
