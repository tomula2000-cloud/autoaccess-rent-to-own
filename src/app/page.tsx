import DesktopHomeView from "@/components/home/desktop-home-view";
import MobileHomeView from "@/components/home/mobile-home-view";
import HomeFeaturedVehicles from "@/components/home/home-featured-vehicles";

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHomeView featuredVehiclesSlot={<HomeFeaturedVehicles />} />
      </div>
      <div className="block md:hidden">
        <MobileHomeView />
      </div>
    </>
  );
}
