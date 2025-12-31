import React from "react";
import { colors } from "@/utils/colors";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 md:p-12" style={{ borderColor: colors.offYellow }}>
        
        {/* Header Section */}
        <header className="mb-10 text-center border-b pb-8" style={{ borderBottomColor: colors.offYellow }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Privacy Policy
          </h1>
          <p className="text-sm md:text-base text-start leading-relaxed" style={{ color: colors.darkGray }}>
            <strong>Graho</strong> ("we", "our", "us") is an astrology and spiritual services platform operated by <strong>Penzo Technologies Private Limited</strong>. 
            We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains what data we collect, why we collect it, how we use it, and the choices you have.
          </p>
          <p className="mt-4 text-sm md:text-base italic" style={{ color: colors.gray }}>
            By accessing or using the Graho website, mobile application, or services, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </header>

        <div className="space-y-10">
          
          {/* Section 1: Information Collection */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              1. Information We Collect
            </h2>
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>a. Account & Contact Information</h3>
                <ul className="list-disc ml-6 space-y-1" style={{ color: colors.darkGray }}>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Mobile number</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>b. Astrology & Profile Information</h3>
                <p className="mb-2 text-sm" style={{ color: colors.gray }}>To provide astrology-related services, we collect information you voluntarily share, including:</p>
                <ul className="list-disc ml-6 space-y-1" style={{ color: colors.darkGray }}>
                  <li>Name</li>
                  <li>Date, Time, and Place of birth</li>
                  <li>Gender (optional)</li>
                  <li>Relationship details (for family or multiple profiles)</li>
                </ul>
                <p className="mt-2 text-sm" style={{ color: colors.gray }}>This information is required to generate kundli, horoscopes, compatibility analysis, reports, and personalized insights.</p>
              </div>
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>c. Usage & Interaction Data</h3>
                <ul className="list-disc ml-6 space-y-1" style={{ color: colors.darkGray }}>
                  <li>Chat and voice session metadata</li>
                  <li>Session duration and timestamps</li>
                  <li>Device, browser, IP address, and log data</li>
                  <li>Platform usage and interaction patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>d. Payment & Transaction Data</h3>
                <ul className="list-disc ml-6 space-y-1" style={{ color: colors.darkGray }}>
                  <li>Wallet balance and usage</li>
                  <li>Transaction IDs and timestamps</li>
                  <li>Payment status and method</li>
                </ul>
                <p className="mt-2 text-sm italic" style={{ color: colors.primeRed }}>
                  Note: Graho does not store card, UPI, or bank details. All payments are securely processed by authorized third-party payment gateways.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Purpose */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              2. Purpose of Data Processing
            </h2>
            <p className="mb-2" style={{ color: colors.darkGray }}>We process your information to:</p>
            <ul className="list-disc ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Deliver astrology services, insights, and reports</li>
              <li>Generate kundli and astrological calculations</li>
              <li>Enable chat and call consultations (AI or human astrologers)</li>
              <li>Manage user accounts and multiple profiles</li>
              <li>Process payments, wallet transactions, and refunds</li>
              <li>Improve service accuracy, quality, and performance</li>
              <li>Provide customer support and resolve issues</li>
              <li>Comply with legal, regulatory, and compliance requirements</li>
            </ul>
          </section>

          {/* Section 3: Consent & Third-Party sharing */}
          <section className="p-6 rounded-xl border" style={{ backgroundColor: colors.bg, borderColor: colors.offYellow }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>3. Consent for Astrology Processing & Third-Party Services</h2>
            <p className="mb-4 text-sm" style={{ color: colors.darkGray }}>
              By using Graho and submitting your personal or birth details, you expressly consent to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-sm mb-4" style={{ color: colors.darkGray }}>
                <li>Processing your data for astrology-related calculations and insights.</li>
                <li>Generating kundli, charts, predictions, and recommendations.</li>
                <li>Securely sharing necessary information with trusted third-party service providers (including astrology APIs, AI systems, hosting providers, analytics tools, and payment gateways) solely for delivering Graho's services.</li>
            </ul>
            <p className="text-sm italic mb-4" style={{ color: colors.darkGray }}>We ensure that such third parties process data only as required to perform their services and in accordance with applicable data protection laws.</p>
            <p className="font-bold" style={{ color: colors.primeGreen }}>Graho does not sell or trade your personal data.</p>
          </section>

          {/* Section 4: Communication */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              4. Communication & Marketing Consent
            </h2>
            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>By using the Graho website or services, you consent to being contacted by us for:</p>
            <ul className="list-disc ml-6 space-y-2 text-sm mb-4" style={{ color: colors.darkGray }}>
                <li>Account-related and service communications</li>
                <li>Transactional updates and confirmations</li>
                <li>Product updates, feature launches, and platform improvements</li>
                <li>Educational content, offers, and promotional communications related to Graho</li>
            </ul>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              These communications may be sent via email, SMS, WhatsApp, in-app notifications, or other digital channels.
            </p>
            <p className="mt-4 text-sm" style={{ color: colors.gray }}>
              You may opt out of non-essential promotional communications at any time using the unsubscribe option provided or by contacting <strong>team@graho.in</strong>. Service-related and transactional communications may continue as necessary to deliver our services.
            </p>
          </section>

          {/* Section 5: Data Sharing & Disclosure */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              5. Data Sharing & Disclosure
            </h2>
            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>We may share limited information with trusted partners such as:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm" style={{ color: colors.darkGray }}>
                <li>Payment gateways and financial processors</li>
                <li>Cloud hosting and infrastructure providers</li>
                <li>Analytics, monitoring, and performance tools</li>
                <li>Customer support and communication platforms</li>
            </ul>
            <p className="mt-2 text-sm italic" style={{ color: colors.gray }}>All such partners are bound by confidentiality and data-protection obligations.</p>
          </section>

          {/* Section 6 & 7: Security & Cookies */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg border" style={{ borderColor: colors.offYellow }}>
              <h3 className="font-bold mb-2" style={{ color: colors.black }}>6. Data Security</h3>
              <p className="text-sm" style={{ color: colors.darkGray }}>
                We use reasonable technical and organizational safeguards to protect your information from unauthorized access, loss, or misuse. However, no system or method of transmission over the internet is completely secure, and absolute security cannot be guaranteed.
              </p>
            </div>
            <div className="p-5 rounded-lg border" style={{ borderColor: colors.offYellow }}>
              <h3 className="font-bold mb-2" style={{ color: colors.black }}>7. Cookies & Tracking Technologies</h3>
              <p className="text-sm mb-2" style={{ color: colors.darkGray }}>
                Graho uses cookies and similar technologies to maintain login sessions, enhance platform functionality, and analyze usage trends.
              </p>
              <p className="text-xs italic" style={{ color: colors.gray }}>You can manage cookies through your browser settings. Disabling cookies may impact certain features.</p>
            </div>
          </section>

          {/* Section 8 & 9: Retention & Rights */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              8. Data Retention & Your Rights
            </h2>
            <p className="mb-4 text-sm" style={{ color: colors.darkGray }}>
              We retain personal information only for as long as necessary to provide services, meet legal requirements, or resolve disputes.
            </p>
            <p className="mb-2 text-sm font-bold" style={{ color: colors.black }}>You have the right to:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm mb-4" style={{ color: colors.darkGray }}>
                <li>Access your personal data</li>
                <li>Request corrections or updates</li>
                <li>Request deletion of your account and associated data</li>
            </ul>
            <p className="text-sm" style={{ color: colors.darkGray }}>Requests can be made by contacting us at <strong>team@graho.in</strong>, subject to applicable laws and operational constraints.</p>
          </section>

          {/* Section 10 & 11: Children & Changes */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg border" style={{ borderColor: colors.offYellow }}>
              <h3 className="font-bold mb-2" style={{ color: colors.black }}>Children's Privacy</h3>
              <p className="text-sm" style={{ color: colors.darkGray }}>
                Graho is intended for users 18 years and above. If services are used on behalf of minors, it must be with the consent and supervision of a parent or legal guardian.
              </p>
            </div>
            <div className="p-5 rounded-lg border" style={{ borderColor: colors.offYellow }}>
              <h3 className="font-bold mb-2" style={{ color: colors.black }}>Changes to This Policy</h3>
              <p className="text-sm" style={{ color: colors.darkGray }}>
                We may update this Privacy Policy periodically. The latest version will always be available on the platform. Continued use of the services constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Footer Contact */}
          <footer className="border-t pt-8" style={{ borderTopColor: colors.offYellow }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-lg" style={{ color: colors.black }}>Contact Us</p>
                <p style={{ color: colors.darkGray }}>Penzo Technologies Private Limited</p>
                <p style={{ color: colors.gray }}>Brand: Graho</p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium" style={{ color: colors.darkGray }}>
                  Email: <a href="mailto:team@graho.in" className=" font-bold" style={{ color: colors.primeGreen }}>team@graho.in</a>
                </p>
                <p className="text-xs mt-2" style={{ color: colors.gray }}>
                  Registered Office: Goa, India
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}