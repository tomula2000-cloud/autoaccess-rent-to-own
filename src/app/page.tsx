import DesktopHomeView from "@/components/home/desktop-home-view";
import MobileHomeView from "@/components/home/mobile-home-view";

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHomeView />
      </div>

      <div className="block md:hidden">
        <MobileHomeView />
      </div>
    </>
  );
}