import DesktopPortalSelectVehicleView from "@/components/portal-select-vehicle/desktop-portal-select-vehicle-view";
import MobilePortalSelectVehicleView from "@/components/portal-select-vehicle/mobile-portal-select-vehicle-view";

export default function PortalSelectVehiclePage() {
  return (
    <>
      <div className="hidden md:block">
        <DesktopPortalSelectVehicleView />
      </div>

      <div className="block md:hidden">
        <MobilePortalSelectVehicleView />
      </div>
    </>
  );
}