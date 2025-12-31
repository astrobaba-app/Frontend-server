import React from "react";
import { colors } from "@/utils/colors";
import Link from "next/link";

export default function TermsConditionsPage() {
  return (
    <main
      className="min-h-screen py-12 px-4 md:px-8"
      style={{ backgroundColor: colors.bg }}
    >
      <div
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 md:p-12"
        style={{ borderColor: colors.offYellow }}
      >
        {/* Header Section */}
        <header
          className="mb-10 text-center border-b pb-8"
          style={{ borderBottomColor: colors.offYellow }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.black }}
          >
            Terms & Conditions
          </h1>
          <p
            className="text-sm md:text-base text-start leading-relaxed"
            style={{ color: colors.darkGray }}
          >
            Welcome to <strong>Graho</strong> (the “Platform”), a digital
            astrology and spiritual services platform operated by{" "}
            <strong>Penzo Technologies Private Limited</strong> (“Graho”, “we”,
            “our”, “us”).
          </p>
          <p className="text-sm md:text-base text-start leading-relaxed">
            {" "}
            By accessing or using the Graho website, mobile application, or
            services, you agree to be bound by these Terms & Conditions. If you
            do not agree, please do not use our services.
          </p>
        </header>

        <div className="space-y-10">
          {/* Section 1: Acceptance */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              1. Acceptance of Terms
            </h2>
            <p className="mb-4 text-sm" style={{ color: colors.darkGray }}>
              By using Graho, you confirm that:
            </p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                You have read, understood, and agree to these Terms &
                Conditions.
              </li>
              <li>
                You are legally capable of entering into a binding agreement.
              </li>
              <li>You will comply with all applicable laws and regulations.</li>
            </ul>
          </section>

          {/* Section 2: Nature of Services */}
          <section
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.offYellow,
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: colors.black }}
            >
              2. Nature of Services
            </h2>
            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>
              Graho provides:
            </p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>AI-assisted astrology consultations.</li>
              <li>Human astrologer consultations (chat and call).</li>
              <li>
                Astrology reports, kundli, horoscopes, compatibility analysis.
              </li>
              <li>
                Digital and physical astrology-related products via the Graho
                Store.
              </li>
            </ul>

            <div
              className="p-4 mt-2 rounded-lg bg-white border-l-4"
              style={{ borderLeftColor: colors.primeRed }}
            >
              <p
                className="text-sm font-bold"
                style={{ color: colors.primeRed }}
              >
                Disclaimer:
              </p>
              <p className="text-xs mt-1" style={{ color: colors.darkGray }}>
                Graho does not provide medical, legal, financial, psychological,
                or professional advice. You should seek appropriate
                professionals for such matters.
              </p>
            </div>
          </section>
          {/* Section 3: User Accounts */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              3. User Accounts
            </h2>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                You must provide accurate and complete information during
                registration.
              </li>
              <li>
                {" "}
                You are responsible for maintaining the confidentiality of your
                login credentials.
              </li>
              <li>
                {" "}
                All activities carried out through your account are your
                responsibility.
              </li>
              <li>
                Graho reserves the right to suspend or terminate accounts
                involved in misuse, fraud, or violation of these Terms.
              </li>
            </ul>
          </section>
          {/* Section 4: Payments & Credits */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              4. Payments, Wallets & Credits
            </h2>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                Certain services require payment through wallet credits or
                direct checkout.{" "}
              </li>
              <li>
                {" "}
                Wallet credits are{" "}
                <strong>
                  non-transferable and non-redeemable for cash.
                </strong>{" "}
              </li>
              <li>
                {" "}
                Once a service session begins, credits used cannot be reversed.{" "}
              </li>
              <li>
                {" "}
                Refunds and cancellations, where applicable, are governed by our
                <strong> <Link href="/policies/cancellation_refund">Cancellation & Refund Policy.</Link></strong>{" "}
              </li>
              <li>
                {" "}
                Graho reserves the right to change pricing, credit structures,
                or service fees at any time.
              </li>
            </ul>
          </section>

          {/* Section 5: Astrology Store (Graho Store) */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              5. Astrology Store (Graho Store)
            </h2>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                Digital products (reports, PDFs, downloads) are delivered
                electronically.{" "}
              </li>
              <li>
                {" "}
                Physical products, if offered, are subject to availability and
                delivery timelines.{" "}
              </li>
              <li>
                {" "}
                Product descriptions are provided for informational purposes and
                may vary slightly from actual items.{" "}
              </li>
              <li>
                {" "}
                Purchases are subject to the{" "}
                <strong> <Link href="/policies/cancellation_refund">Cancellation & Refund Policy.</Link></strong>
              </li>
            </ul>
          </section>
          {/* Section 6: Intellectual Property */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              6. Intellectual Property
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.darkGray }}
            >
              All content on Graho, including but not limited to:
            </p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>Text, graphics, logos, UI/UX</li>
              <li> AI-generated responses</li>
              <li> Audio, voice, and visual content</li>
              <li> Software, algorithms, and backend systems</li>
            </ul>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.darkGray }}
            >
              are the exclusive property of Penzo Technologies Private Limited
              or its licensors.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.darkGray }}
            >
              You may not copy, reproduce, distribute, modify, or create
              derivative works without prior written consent.
            </p>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section
            className="p-6 rounded-xl border"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.offYellow,
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: colors.black }}
            >
              7. Limitation of Liability
            </h2>
            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>
              To the maximum extent permitted by law:
            </p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                Graho shall not be liable for any indirect, incidental, special,
                consequential, or exemplary damages{" "}
              </li>
              <li>
                {" "}
                We do not guarantee accuracy, outcomes, or results of astrology
                insights{" "}
              </li>
              <li>
                {" "}
                Graho is not responsible for decisions made by users based on
                astrology guidance
              </li>
            </ul>
            <p
              className="text-sm mt-2 leading-relaxed"
              style={{ color: colors.darkGray }}
            >
              Use of the platform is at your{" "}
              <strong>sole discretion and risk.</strong>
            </p>
          </section>

          {/* Section 8: Acceptable Use */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              8. Acceptable Use
            </h2>

            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>
              You agree not to:
            </p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>Misuse the platform or attempt unauthorized access</li>
              <li> Interfere with platform operations or security</li>
              <li> Upload harmful, abusive, illegal, or misleading content</li>
              <li> Use the platform for fraudulent or unlawful purposes</li>
            </ul>
            <p
              className="text-sm mt-2 leading-relaxed"
              style={{ color: colors.darkGray }}
            >
              Violation of this section may result in immediate suspension or
              termination of access
            </p>
          </section>

          {/* Section 9: Service Availability & Modifications */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              9. Service Availability & Modifications
            </h2>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>
                Graho may modify, suspend, or discontinue any part of the
                services without prior notice.
              </li>
              <li>
                {" "}
                Temporary downtime may occur due to maintenance, upgrades, or
                technical issues.
              </li>
              <li>
                {" "}
                We are not liable for interruptions beyond our reasonable
                control.
              </li>
            </ul>
          </section>

          {/* Section 10: Termination */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              10. Termination
            </h2>
            <p className="text-sm mb-2">Graho reserves the right to:</p>
            <ul
              className="list-disc ml-6 space-y-2 text-sm"
              style={{ color: colors.darkGray }}
            >
              <li>Suspend or terminate access to the platform</li>
              <li> Remove content or accounts violating these Terms</li>
              <li> Take necessary legal action in cases of misuse or fraud.</li>
            </ul>
          </section>

          {/* Section 11: Governing Law */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              11. Governing Law & Jurisdiction
            </h2>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              These Terms shall be governed by and construed in accordance with
              the laws of India. All disputes shall be subject to the exclusive
              jurisdiction of courts located in India.
            </p>
          </section>

          {/* Section 12: Changes to These Terms */}
          <section>
            <h2
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: colors.black }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: colors.primeYellow }}
              ></span>
              12. Changes to These Terms
            </h2>
            <p className="text-sm" style={{ color: colors.darkGray }}>
              We may update these Terms & Conditions periodically. Continued use
              of Graho after changes implies acceptance of the updated Terms.
            </p>
          </section>

          {/* Footer Contact */}
          <footer
            className="border-t pt-8"
            style={{ borderTopColor: colors.offYellow }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p
                  className="font-bold text-lg"
                  style={{ color: colors.black }}
                >
                  Contact Us
                </p>
                <p style={{ color: colors.darkGray }}>
                  Penzo Technologies Private Limited
                </p>
                <p className="text-sm" style={{ color: colors.gray }}>
                  Brand: Graho
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium" style={{ color: colors.darkGray }}>
                  Email:{" "}
                  <a
                    href="mailto:team@graho.in"
                    className="font-bold underline"
                    style={{ color: colors.primeGreen }}
                  >
                    team@graho.in
                  </a>
                </p>
                <p className="text-xs mt-2" style={{ color: colors.gray }}>
                  Continued use of Graho implies acceptance of updated terms.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
