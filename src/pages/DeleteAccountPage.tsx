export function DeleteAccountPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-xl bg-white p-8 rounded-lg text-center">
                <h1 className="text-3xl font-bold mb-4 text-red-600">Delete Your Account</h1>
                <p className="text-gray-700 mb-6">
                    We’re sorry to see you go. Click the button below to request that your Gebeta App account
                    and all associated data be deleted. A confirmation email will be sent once your request is processed.
                </p>
                <div className="flex justify-center">
                    <a
                        href="mailto:info@gebeta.app?subject=Account%20Deletion%20Request"
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                        Request Account Deletion
                    </a>
                </div>
            </div>
        </div>
    );
}