import React from "react";
import { colors } from "@/utils/colors";

export default function CancellationRefundPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 md:p-12" style={{ borderColor: colors.offYellow }}>
        
        {/* Header Section */}
        <header className="mb-10 text-center border-b pb-8" style={{ borderBottomColor: colors.offYellow }}>
          <h1 className="text-3xl md:text-4xl  font-bold mb-4" style={{ color: colors.black }}>
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.darkGray }}>
            <strong>Graho</strong> is operated by <strong>Penzo Technologies Private Limited</strong> and provides digital astrology services, consultations, reports, and products through its platform.
          </p>
          <p className="mt-4 italic text-sm" style={{ color: colors.gray }}>
            Due to the personalized and time-bound nature of astrology services, certain cancellations and refunds are limited as described below.
          </p>
        </header>

        <div className="space-y-10">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              1. Astrology Consultations (Chat / Call / AI Sessions)
            </h2>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Once a chat or call session has started, it cannot be cancelled or refunded.</li>
              <li>Wallet credits consumed during a session are non-reversible.</li>
              <li>Sessions are billed on a time-based or usage-based model, and usage is tracked automatically by the system.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              2. Wallet Credits & Recharge
            </h2>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Wallet recharges are non-refundable once credited to the user's account.</li>
              <li>Unused wallet balance does not expire and can be used for future services on Graho.</li>
              <li>Wallet credits cannot be transferred to another account or redeemed for cash.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              3. Astro Store - Digital Products (Reports, PDFs, Downloads)
            </h2>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Digital products delivered instantly (such as astrology reports, downloadable files, or online access) are non-cancellable and non-refundable once delivered.</li>
              <li>If a technical issue prevents access or delivery, users may contact support for resolution.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              4. Astro Store - Physical Products (If Applicable)
            </h2>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Orders for physical products can be cancelled only before dispatch. Once shipped, cancellations are not permitted.</li>
              <li>Refunds for damaged or incorrect products may be processed after verification.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 rounded-xl border" style={{ backgroundColor: colors.bg, borderColor: colors.offYellow }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>5. Refunds Are Considered Only In The Following Cases:</h2>
            <p className="text-sm mb-4" style={{ color: colors.darkGray }}>Refunds may be approved at Graho's discretion if:</p>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2 mb-6" style={{ color: colors.darkGray }}>
              <li>A duplicate payment was made for the same order or transaction; or</li>
              <li>A verified technical failure on the Graho platform prevented service delivery, as confirmed by our support team.</li>
            </ul>
            
            <h3 className="font-bold mb-2" style={{ color: colors.primeRed }}>Refunds are NOT provided for:</h3>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-1" style={{ color: colors.gray }}>
              <li>Change of mind</li>
              <li>Partial usage of wallet credits</li>
              <li>Dissatisfaction with astrology outcomes (as astrology is interpretative and subjective)</li>
              <li>Delays caused by external service providers beyond our control</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              6. How to Request a Refund
            </h2>
            <p className="mb-4" style={{ color: colors.darkGray }}>
              To request a refund, please contact us within <strong>24 hours</strong> of the transaction with:
            </p>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2 mb-6" style={{ color: colors.darkGray }}>
                <li>Order ID / Transaction ID</li>
                <li>Payment reference ID</li>
                <li>Brief description of the issue</li>
                <li>Screenshots or supporting details (if available)</li>
            </ul>
            <p className="font-medium" style={{ color: colors.darkGray }}>
              Email: <a href="mailto:team@graho.in" className="underline font-bold" style={{ color: colors.primeGreen }}>team@graho.in</a>
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              7. Refund Processing Timeline
            </h2>
            <ul className="list-disc text-sm md:text-base ml-6 space-y-2" style={{ color: colors.darkGray }}>
              <li>Approved refunds will be processed within <strong>5-7 business days</strong>.</li>
              <li>Refunds will be credited back to the original payment method used at checkout.</li>
              <li>Processing time may vary depending on the payment provider or bank.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="pt-8">
            <div className="p-6 rounded-lg text-center font-medium border-2" style={{ backgroundColor: colors.creamyYellow, borderColor: colors.offYellow, color: colors.black }}>
              <h2 className="text-sm md:text-base font-bold mb-2">8. Final Authority</h2>
              All refund and cancellation decisions rest solely with Graho / Penzo Technologies Private Limited, and our determination shall be final.
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}