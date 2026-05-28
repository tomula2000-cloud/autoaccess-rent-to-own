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
    <>
      <div className="hidden md:block">
        <DesktopPortalLoginView searchParams={Promise.resolve({ error })} />
      </div>

      <div className="block md:hidden">
        <MobilePortalLoginView searchParams={Promise.resolve({ error })} />
      </div>
    </>
  );
}