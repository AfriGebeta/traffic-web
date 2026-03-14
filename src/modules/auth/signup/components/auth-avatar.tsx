import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Download } from 'lucide-react';
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
                    className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-colors font-semibold text-base"
                    style={{ backgroundColor: colors.primary.main, color: 'white' }}
                >
                    {user ? user.name.charAt(0).toUpperCase() : <User size={20} color="white" />}
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
                                onClick={() => alert('App coming soon!')}
                                className="w-full py-1.5 px-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-left flex items-center gap-2"
                            >
                                <Download size={16} />
                                <span>Download App</span>
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
                                onClick={() => alert('App coming soon!')}
                                className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-left flex items-center gap-2"
                            >
                                <Download size={16} />
                                <span>Download App</span>
                            </button>

                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
