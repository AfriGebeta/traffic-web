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
        <p className="text-gray-500 text-sm mb-6">
          Last Updated: March 18, 2026
        </p>

        <div className="max-w-none space-y-6">
          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-2 leading-6">
              We may collect the following types of information when you use our
              application:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-6">
              <li>
                <span className="font-semibold">Personal Information:</span>{" "}
                Name, phone number, and any information you provide when
                contacting us
              </li>
              <li>
                <span className="font-semibold">Location Data:</span> Precise or
                approximate location to provide location-based services such as
                searching places and navigation
              </li>
              <li>
                <span className="font-semibold">Voice Input:</span> Voice
                queries used to search for places and services
              </li>
              <li>
                <span className="font-semibold">User Contributions:</span>{" "}
                Incident reports, place reviews, and other community content
              </li>
              <li>
                <span className="font-semibold">Usage Data:</span> Information
                about how you interact with the app (features used, time spent,
                etc.)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-2 leading-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-6">
              <li>Provide, operate, and maintain our services</li>
              <li>Enable location-based search and navigation features</li>
              <li>Process voice search queries</li>
              <li>Improve app performance and user experience</li>
              <li>Communicate with users about updates or support</li>
              <li>Monitor usage trends and detect misuse</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              3. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-2 leading-6">
              We use third-party services to support core features of our
              application:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 leading-6">
              <li>
                <span className="font-semibold">Hasab AI</span> – used to
                convert text into audio responses. Text input provided by users
                may be sent to Hasab AI for processing in order to generate
                voice output.
              </li>
              <li>
                <span className="font-semibold">GebetaMaps</span> – used for map
                tiles, routing, and geocoding services to enable navigation and
                location-based features
              </li>
            </ul>
            <p className="text-gray-700 mt-2 leading-6">
              These third-party services may process data on our behalf and only
              as necessary to provide their functionality. We do not authorize
              them to use your data for any other purpose.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              4. Information Sharing
            </h2>
            <p className="text-gray-700 mb-2 leading-6">
              We may share information in the following cases:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-6">
              <li>
                With other users as part of public features (such as
                leaderboards, reports, or shared content)
              </li>
              <li>With service providers who assist in operating the app</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
            <p className="text-gray-700 mt-2 leading-6">
              We do <span className="font-semibold">not sell</span> your
              personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              5. Data Retention
            </h2>
            <p className="text-gray-700 leading-6">
              We retain your personal data only for as long as necessary to
              fulfill the purposes described in this Privacy Policy, unless a
              longer retention period is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              6. Data Security
            </h2>
            <p className="text-gray-700 leading-6">
              We take reasonable administrative and technical measures to
              protect your personal information from unauthorized access, loss,
              misuse, or alteration.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              7. Your Rights
            </h2>
            <p className="text-gray-700 mb-2 leading-6">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 leading-6">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict certain processing</li>
            </ul>
            <p className="text-gray-700 mt-2 leading-6">
              To exercise these rights, contact us using the information below.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-6">
              We may update this Privacy Policy from time to time. We will
              notify users of any significant changes by updating the "Last
              Updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-base text-gray-900 font-semibold mb-3">
              9. Contact Us
            </h2>
            <p className="text-gray-700 leading-6">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="text-gray-700 mt-2 leading-6">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info@gebeta.app"
                className="text-blue-600 underline"
              >
                info@gebeta.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
