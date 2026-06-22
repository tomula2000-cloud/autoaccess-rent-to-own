import DesktopGalleryView from "@/components/gallery/desktop-gallery-view";
import MobileGalleryView from "@/components/gallery/mobile-gallery-view";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopGalleryView />
      </div>
      <div className="block md:hidden">
        <MobileGalleryView />
      </div>
    </>
  );
}
