import DesktopHomeView from "@/components/home/desktop-home-view";
import MobileHomeView from "@/components/home/mobile-home-view";
import HomeFeaturedVehicles from "@/components/home/home-featured-vehicles";
import HomeFeaturedVehiclesMobileWrapper from "@/components/home/home-featured-vehicles-mobile-wrapper";

export default function HomePage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopHomeView featuredVehiclesSlot={<HomeFeaturedVehicles />} />
      </div>
      <div className="block md:hidden">
        <MobileHomeView featuredVehiclesSlot={<HomeFeaturedVehiclesMobileWrapper />} />
      </div>
    </>
  );
}
