import Link from "next/link";

const stars = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "20%", left: "25%", delay: "0.4s" },
  { top: "9%", left: "46%", delay: "0.8s" },
  { top: "16%", left: "68%", delay: "0.2s" },
  { top: "24%", left: "88%", delay: "1s" },
  { top: "68%", left: "14%", delay: "0.6s" },
  { top: "74%", left: "34%", delay: "1.2s" },
  { top: "82%", left: "52%", delay: "0.5s" },
  { top: "71%", left: "76%", delay: "0.9s" },
  { top: "88%", left: "92%", delay: "1.4s" },
];

export default function NotFound() {
  return (
    <main className="relative isolate overflow-hidden bg-[#FBFAF8]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(255, 215, 0, 0.3), transparent 42%), radial-gradient(circle at 82% 12%, rgba(255, 0, 8, 0.14), transparent 40%), radial-gradient(circle at 55% 92%, rgba(4, 168, 42, 0.14), transparent 44%)",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(51, 51, 51, 0.35) 0.8px, transparent 0.8px)",
          backgroundSize: "26px 26px",
        }}
      />

      {stars.map((star, index) => (
        <span
          key={index}
          aria-hidden
          className="absolute h-1.5 w-1.5 rounded-full bg-yellow-500/70 animate-pulse"
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        />
      ))}

      <section className="relative mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          <p className="inline-flex rounded-full border border-yellow-500/50 bg-yellow-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#7a6200]">
            404 Cosmic Detour
          </p>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#1f1f1f] sm:text-5xl">
            This page is hidden beyond the stars.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-[#474747] sm:text-lg">
            The link you opened is not available right now. Let us guide you back to trusted astrology tools on Graho.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-[#FFD700] px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-95"
            >
              Go to Home
            </Link>

            <Link
              href="/horoscope"
              className="rounded-full border border-[#333333]/25 bg-white/75 px-6 py-2.5 text-sm font-semibold text-[#333333] transition hover:bg-[#fff7d1]"
            >
              View Horoscope
            </Link>

            <Link
              href="/astrologer?mode=chat"
              className="rounded-full bg-[#FF0008] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Chat with Astrologers
            </Link>
          </div>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            <Link
              href="/"
              className="rounded-2xl border border-[#333333]/15 bg-white/65 px-4 py-3 transition hover:border-yellow-500/45 hover:bg-[#fff7d1]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#8f7400]">Start here</p>
              <p className="mt-1 text-base font-semibold text-[#222222]">Explore Home</p>
            </Link>

            <Link
              href="/blog"
              className="rounded-2xl border border-[#333333]/15 bg-white/65 px-4 py-3 transition hover:border-yellow-500/45 hover:bg-[#fff7d1]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#8f7400]">Read</p>
              <p className="mt-1 text-base font-semibold text-[#222222]">Astrology Blogs</p>
            </Link>

            <Link
              href="/forum"
              className="rounded-2xl border border-[#333333]/15 bg-white/65 px-4 py-3 transition hover:border-yellow-500/45 hover:bg-[#fff7d1]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[#8f7400]">Discuss</p>
              <p className="mt-1 text-base font-semibold text-[#222222]">Community Forum</p>
            </Link>
          </div>

          <p className="mt-8 text-sm text-[#5f5f5f]">
            Tip: Please check the URL spelling or return to a section from the options above.
          </p>
        </div>
      </section>
    </main>
  );
}