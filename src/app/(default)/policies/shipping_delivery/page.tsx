import React from "react";
import { colors } from "@/utils/colors";

export default function ShippingDeliveryPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-8 md:p-12" style={{ borderColor: colors.offYellow }}>
        
        {/* Header Section */}
        <header className="mb-10 text-center border-b pb-8" style={{ borderBottomColor: colors.offYellow }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.black }}>
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.darkGray }}>
            <strong>Graho</strong> is operated by <strong>Penzo Technologies Private Limited</strong>. This policy explains how services and products purchased on the Graho platform are delivered after successful payment.
          </p>
        </header>

        <div className="space-y-10">
          
          {/* Section 1: Nature of Products */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              1. Nature of Products & Services
            </h2>
            <p className="mb-4" style={{ color: colors.darkGray }}>Graho primarily offers digital astrology services, including:</p>
            <ul className="list-disc ml-6 space-y-2 text-sm md:text-base" style={{ color: colors.darkGray }}>
              <li>AI and human astrologer consultations (chat and call)</li>
              <li>Astrology reports, kundli, horoscopes, and digital downloads</li>
              <li>Wallet-based credits for accessing platform services</li>
            </ul>
            <p className="mt-4 text-sm" style={{ color: colors.darkGray }}>
              In addition, Graho may offer physical astrology-related products (such as remedies or merchandise) through the Graho Store.
            </p>
          </section>

          {/* Section 2: Digital Delivery */}
          <section className="p-6 rounded-xl border" style={{ backgroundColor: colors.bg, borderColor: colors.offYellow }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.black }}>2. Digital Service Delivery</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>a. Wallet Credits</h3>
                <ul className="list-disc ml-6 space-y-1 text-sm" style={{ color: colors.darkGray }}>
                  <li>Wallet credits are added instantly after successful payment.</li>
                  <li>Credits can be used immediately for consultations or digital services.</li>
                  <li>In rare cases, credit reflection may take up to 10 minutes due to technical delays.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold  mb-2" style={{ color: colors.darkGray }}>b. Digital Reports & Downloads</h3>
                <p className="text-sm mb-2" style={{ color: colors.darkGray }}>Digital products are delivered electronically via:</p>
                <ul className="list-disc ml-6 space-y-1 text-sm" style={{ color: colors.darkGray }}>
                  <li>On-screen access, and/or</li>
                  <li>Email to the registered email address</li>
                </ul>
                <p className="mt-2 text-sm italic" style={{ color: colors.gray }}>Access is typically granted immediately after purchase.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Physical Product Delivery */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              3. Physical Product Delivery (If Applicable)
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-sm" style={{ color: colors.darkGray }}>
              <li>Physical products are shipped to the delivery address provided at checkout.</li>
              <li>Dispatch timelines and estimated delivery dates will be shared where applicable.</li>
              <li>Delivery timelines may vary based on location, availability, and logistics partners.</li>
              <li>Currently, physical deliveries may be handled manually or via third-party logistics providers.</li>
            </ul>
          </section>

          {/* Section 4: Charges & Taxes */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              4. Delivery Charges & Taxes
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-sm" style={{ color: colors.darkGray }}>
              <li><strong>Digital services:</strong> No shipping charges apply.</li>
              <li><strong>Physical products:</strong> Delivery charges, if any, will be displayed at checkout.</li>
              <li>Applicable taxes (including GST, if required) are shown during checkout.</li>
              <li>GST-compliant invoices can be provided on request.</li>
            </ul>
          </section>

          {/* Section 5: Availability */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              5. Service Availability
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-sm" style={{ color: colors.darkGray }}>
              <li>Graho services are generally available 24×7.</li>
              <li>Temporary interruptions may occur due to system maintenance, upgrades, or unforeseen technical issues.</li>
              <li>During such periods, service delivery may be delayed until systems are restored.</li>
            </ul>
          </section>

          {/* Section 6: Issues */}
          <section className="p-6 rounded-xl border border-dashed" style={{ borderColor: colors.primeRed }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: colors.primeRed }}>6. Failed Delivery / Credits Not Received</h2>
            <p className="text-sm mb-4" style={{ color: colors.darkGray }}>If payment is successful but wallet credits do not appear, or a digital product is not accessible, please contact support within 24 hours with:</p>
            <ul className="list-disc ml-10 space-y-1 text-sm font-medium" style={{ color: colors.black }}>
              <li>Registered email address</li>
              <li>Payment ID / Order ID</li>
            </ul>
            <p className="mt-4 text-sm" style={{ color: colors.darkGray }}>
              If a verified technical issue prevents delivery, Graho will either resolve the issue or process a refund in accordance with the Cancellation & Refund Policy.
            </p>
          </section>

          {/* Section 7: Responsibilities */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.black }}>
              <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: colors.primeYellow }}></span>
              7. Customer Responsibilities
            </h2>
            <p className="mb-2 text-sm" style={{ color: colors.darkGray }}>Users are responsible for:</p>
            <ul className="list-disc ml-6 text-sm space-y-1" style={{ color: colors.gray }}>
              <li>Maintaining a stable internet connection</li>
              <li>Using a compatible device and browser</li>
              <li>Logging in with the correct account used during purchase</li>
              <li>Providing accurate delivery details for physical products (if applicable)</li>
            </ul>
            <p className="mt-4 text-xs italic" style={{ color: colors.gray }}>Graho is not responsible for issues arising from incorrect user-provided information.</p>
          </section>

          {/* Footer Support */}
          <footer className="border-t pt-8" style={{ borderTopColor: colors.offYellow }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="font-bold text-lg" style={{ color: colors.black }}>Support & Contact</p>
                <p style={{ color: colors.darkGray }}>Penzo Technologies Private Limited</p>
                <p style={{ color: colors.gray }}>Brand: Graho</p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-medium" style={{ color: colors.darkGray }}>
                  Email: <a href="mailto:hello@graho.in" className="text-lg font-bold" style={{ color: colors.primeGreen }}>hello@graho.in</a>
                </p>
                <p className="mt-4 text-xs" style={{ color: colors.gray }}>
                  Graho may update this Shipping & Delivery Policy periodically to reflect operational or legal changes. The latest version will always be available on the platform.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}