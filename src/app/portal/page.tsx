import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DesktopPortalDashboardView from "@/components/portal-dashboard/desktop-portal-dashboard-view";
import MobilePortalDashboardView from "@/components/portal-dashboard/mobile-portal-dashboard-view";

export default async function ClientPortalPage() {
  const cookieStore = await cookies();
  const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
  const email = cookieStore.get("autoaccess_portal_email")?.value;

  if (!referenceNumber || !email) {
    redirect("/portal-login");
  }

  return (
    <>
      <div className="hidden md:block">
        <DesktopPortalDashboardView />
      </div>

      <div className="block md:hidden">
        <MobilePortalDashboardView referenceNumber={referenceNumber} />
      </div>
    </>
  );
}