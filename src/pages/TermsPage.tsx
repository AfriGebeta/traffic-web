import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-gray-500 text-sm mb-6">
          Last Updated: March 18, 2026
        </p>

        <div className="max-w-none">
          <p className="text-base text-gray-900 font-semibold mb-3">
            1. Acceptance of terms
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            By accessing and using GebetaMaps App, you accept and agree to be
            bound by the terms and provision of this agreement. If you do not
            agree to these terms, please do not use our services.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            2. Use of service
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            You agree to use the service only for lawful purposes and in a way
            that does not infringe the rights of, restrict, or inhibit anyone
            else's use and enjoyment of the service.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            3. User Content
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            You are responsible for any content you submit, including incident
            reports, rules contribution and place contributions. You grant us access to use, modify,
            and display your content as part of our services.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            4. Accuracy of information
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            While we strive to provide accurate information, we cannot guarantee
            the accuracy, completeness, or timeliness of incident reports and
            place information provided by users.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            5. Limitation of liability
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            GebetaMaps App shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use the service.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            6. Modifications
          </p>
          <p className="text-gray-700 mb-6 leading-6">
            We reserve the right to modify or replace these terms at any time.
            Your continued use of the service after any changes constitutes
            acceptance of the new terms.
          </p>

          <p className="text-base text-gray-900 font-semibold mb-3">
            7. Contact Information
          </p>
          <p className="text-gray-700 leading-6">
            For any questions regarding these terms, please contact us at{" "}
            <a
              href="https://gebeta.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              gebeta.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
