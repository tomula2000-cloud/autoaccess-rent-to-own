import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/auto-access-logo.png"
            alt="Auto Access"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-semibold text-white/90 transition hover:text-orange-400"
          >
            Home
          </Link>

          <Link
            href="/gallery"
            className="font-semibold text-white/90 transition hover:text-orange-400"
          >
            Gallery
          </Link>

          <Link
            href="/apply"
            className="font-semibold text-white/90 transition hover:text-orange-400"
          >
            Apply
          </Link>

          <Link
            href="/portal-login"
            className="font-semibold text-white/90 transition hover:text-orange-400"
          >
            Client Portal
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="hidden rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20 sm:inline-flex"
          >
            View Offers
          </Link>

          <Link
            href="/apply"
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}