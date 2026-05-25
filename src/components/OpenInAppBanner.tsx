import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const OpenInAppBanner = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [customSchemeUrl, setCustomSchemeUrl] = useState('');
    const [appNotInstalled, setAppNotInstalled] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('lat') && urlParams.has('lng')) {
            const schemeUrl = `trafficapp://?${urlParams.toString()}`;
            setCustomSchemeUrl(schemeUrl);
            setShowBanner(true);
        }
    }, []);

    const handleOpenInApp = () => {
        // Try to open the app
        window.location.href = customSchemeUrl;

        // Set a timeout to detect if app didn't open
        setTimeout(() => {
            setAppNotInstalled(true);
        }, 5000);
    };

    const handleClose = () => {
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-9999  bg-blue-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center justify-center gap-3">
                        <img
                            src="/assets/gebetamaps.png"
                            alt="Gebeta Maps"
                            className="w-8 h-8 sm:w-10 sm:h-10"
                        />
                        <div className="text-center sm:text-left">
                            <p className="text-sm sm:text-base font-semibold">
                                {appNotInstalled ? 'App Not Installed' : 'Open in Gebeta Maps App'}
                            </p>
                            {appNotInstalled && (
                                <p className="text-xs sm:text-sm opacity-90">
                                    Download coming soon!
                                </p>
                            )}
                        </div>
                    </div>

                    {!appNotInstalled && (
                        <button
                            onClick={handleOpenInApp}
                            className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg font-bold text-sm sm:text-base hover:bg-blue-50 transition-colors shadow-md whitespace-nowrap"
                        >
                            Open App
                        </button>
                    )}

                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-blue-800 rounded-full transition-colors"
                        aria-label="Close banner"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
