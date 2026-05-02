import { prisma } from "@/lib/prisma";
import HomeFeaturedVehiclesMarquee from "./home-featured-vehicles-marquee";

export default async function HomeFeaturedVehicles() {
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

  if (vehicles.length === 0) return null;

  return <HomeFeaturedVehiclesMarquee vehicles={vehicles} variant="desktop" />;
}
