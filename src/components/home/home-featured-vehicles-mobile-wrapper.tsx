import { prisma } from "@/lib/prisma";
import HomeFeaturedVehiclesMobile from "./home-featured-vehicles-mobile";

export default async function HomeFeaturedVehiclesMobileWrapper() {
  const vehicles = await prisma.vehicleOffer.findMany({
    where: {
      status: "AVAILABLE" as never,
      NOT: { featuredImage: { contains: "unsplash" } },
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      monthlyPayment: true,
      yearModel: true,
      transmission: true,
      fuelType: true,
    },
  });

  return <HomeFeaturedVehiclesMobile vehicles={vehicles} />;
}
