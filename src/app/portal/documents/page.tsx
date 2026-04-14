import DesktopPortalDocumentsView from "@/components/portal-documents/desktop-portal-documents-view";
import MobilePortalDocumentsView from "@/components/portal-documents/mobile-portal-documents-view";

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function PortalDocumentsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const forwardedSearchParams = Promise.resolve({
    success: params.success || "",
    error: params.error || "",
  });

  return (
    <>
      <div className="hidden md:block">
        <DesktopPortalDocumentsView searchParams={forwardedSearchParams} />
      </div>

      <div className="block md:hidden">
        <MobilePortalDocumentsView searchParams={forwardedSearchParams} />
      </div>
    </>
  );
}export const dynamic = "force-dynamic";
