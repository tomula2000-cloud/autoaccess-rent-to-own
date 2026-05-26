import DesktopPortalLoginView from "@/components/portal-login/desktop-portal-login-view";
import MobilePortalLoginView from "@/components/portal-login/mobile-portal-login-view";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function PortalLoginPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const error = params.error || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0b1532] via-[#1b2345] to-[#0b1532] px-4 py-12 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#d59758]/15 ring-2 ring-[#d59758]/30">
        <svg className="h-10 w-10 text-[#d59758]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
        </svg>
      </div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#d59758]">Scheduled Maintenance</div>
      <h1 className="mb-4 text-[1.8rem] font-semibold text-white sm:text-[2.2rem]">
        Client Portal Temporarily Unavailable
      </h1>
      <p className="mb-2 max-w-[480px] text-[15px] leading-7 text-blue-100/70">
        We are currently performing scheduled maintenance on the Auto Access client portal. We apologise for any inconvenience.
      </p>
      <p className="mb-10 max-w-[480px] text-[15px] leading-7 text-blue-100/70">
        The portal will be back online shortly. Thank you for your patience.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <a
          href="tel:0212110015"
          className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_12px_28px_-8px_rgba(213,151,88,0.5)] transition hover:from-[#c37d43] hover:to-[#b86e35]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          Call 021 211 0015
        </a>
        <a
          href="https://wa.me/27745462367?text=Hi%20Caleb%2C%20I%20am%20trying%20to%20access%20the%20Auto%20Access%20client%20portal%20but%20it%20is%20under%20maintenance."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-[#25d366]/40 bg-[#25d366]/10 px-7 py-3.5 text-[14px] font-bold text-[#25d366] transition hover:bg-[#25d366]/20"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.42A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
          WhatsApp Caleb
        </a>
      </div>
      <p className="mt-10 text-[11px] text-blue-100/30">Auto Access &copy; {new Date().getFullYear()}</p>
    </div>
  );
}