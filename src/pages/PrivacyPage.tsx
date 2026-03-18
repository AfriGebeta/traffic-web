import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-y-auto bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm"
        >
          ← Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-6">Last Updated: March 18, 2026</p>

        <div className="max-w-none">
          <p className="text-base text-gray-900 font-semibold mb-3">1. Information we collect</p>
          <p className="text-gray-700 mb-6 leading-6">We collect information you provide directly to us, including your name, phone number, voice input (for searching places) and location data when you use our services. We also collect incident reports, place contributions, and usage data to improve our services.</p>

          <p className="text-base text-gray-900 font-semibold mb-3">2. How we use your information</p>
          <p className="text-gray-700 mb-6 leading-6">We use the information we collect to provide, maintain, and improve our services, to communicate with you, to monitor and analyze trends and usage, and to personalize your experience.</p>

          <p className="text-base text-gray-900 font-semibold mb-3">3. Information sharing</p>
          <p className="text-gray-700 mb-6 leading-6">We may share your information with other users as part of the community features (such as leaderboards and incident reports). We do not sell your personal information to third parties.</p>

          <p className="text-base text-gray-900 font-semibold mb-3">4. Data security</p>
          <p className="text-gray-700 mb-6 leading-6">We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>

          <p className="text-base text-gray-900 font-semibold mb-3">5. Contact us</p>
          <p className="text-gray-700 leading-6">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="https://gebeta.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              gebeta.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
