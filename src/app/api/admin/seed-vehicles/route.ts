import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80";

const vehicles = [
  { title: "Toyota Corolla Quest 1.8", slug: "toyota-corolla-quest-1-8", yearModel: "2021", mileage: "45 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "12000", monthlyPayment: "5200" },
  { title: "Toyota Yaris 1.5 Xi", slug: "toyota-yaris-1-5-xi", yearModel: "2020", mileage: "38 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "10000", monthlyPayment: "4500" },
  { title: "Toyota Hilux 2.4 GD-6 SRX", slug: "toyota-hilux-2-4-gd6-srx", yearModel: "2020", mileage: "72 000 km", transmission: "Manual", fuelType: "Diesel", depositAmount: "22000", monthlyPayment: "8200" },
  { title: "Toyota Fortuner 2.4 GD-6", slug: "toyota-fortuner-2-4-gd6", yearModel: "2019", mileage: "89 000 km", transmission: "Automatic", fuelType: "Diesel", depositAmount: "25000", monthlyPayment: "8500" },
  { title: "Toyota RAV4 2.0 GX", slug: "toyota-rav4-2-0-gx", yearModel: "2019", mileage: "67 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "20000", monthlyPayment: "7800" },
  { title: "Volkswagen Polo Vivo 1.4 Trendline", slug: "vw-polo-vivo-1-4-trendline", yearModel: "2021", mileage: "32 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "9000", monthlyPayment: "4200" },
  { title: "Volkswagen Polo 1.0 TSI Comfortline", slug: "vw-polo-1-0-tsi-comfortline", yearModel: "2020", mileage: "41 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "13000", monthlyPayment: "5800" },
  { title: "Volkswagen Golf 1.4 TSI Comfortline", slug: "vw-golf-1-4-tsi-comfortline", yearModel: "2019", mileage: "58 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "15000", monthlyPayment: "6200" },
  { title: "Volkswagen Tiguan 1.4 TSI Trendline", slug: "vw-tiguan-1-4-tsi-trendline", yearModel: "2019", mileage: "74 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "18000", monthlyPayment: "7200" },
  { title: "Volkswagen T-Cross 1.0 TSI Comfortline", slug: "vw-t-cross-1-0-tsi-comfortline", yearModel: "2021", mileage: "28 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "16000", monthlyPayment: "6800" },
  { title: "Ford Fiesta 1.0 EcoBoost Trend", slug: "ford-fiesta-1-0-ecoboost-trend", yearModel: "2020", mileage: "44 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "10000", monthlyPayment: "4600" },
  { title: "Ford Focus 1.5 EcoBoost Trend", slug: "ford-focus-1-5-ecoboost-trend", yearModel: "2019", mileage: "61 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "13000", monthlyPayment: "5600" },
  { title: "Ford Ranger 2.2 TDCi XL", slug: "ford-ranger-2-2-tdci-xl", yearModel: "2020", mileage: "68 000 km", transmission: "Manual", fuelType: "Diesel", depositAmount: "20000", monthlyPayment: "7600" },
  { title: "Ford EcoSport 1.5 Ambiente", slug: "ford-ecosport-1-5-ambiente", yearModel: "2020", mileage: "39 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "11000", monthlyPayment: "4800" },
  { title: "Ford Puma 1.0 EcoBoost ST-Line", slug: "ford-puma-1-0-ecoboost-st-line", yearModel: "2022", mileage: "22 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "17000", monthlyPayment: "6900" },
  { title: "Hyundai i20 1.2 Motion", slug: "hyundai-i20-1-2-motion", yearModel: "2021", mileage: "31 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "9000", monthlyPayment: "4100" },
  { title: "Hyundai i30 1.4 Motion", slug: "hyundai-i30-1-4-motion", yearModel: "2019", mileage: "55 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "11000", monthlyPayment: "4900" },
  { title: "Hyundai Tucson 2.0 Premium", slug: "hyundai-tucson-2-0-premium", yearModel: "2020", mileage: "49 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "18000", monthlyPayment: "7100" },
  { title: "Hyundai Creta 1.5 Executive", slug: "hyundai-creta-1-5-executive", yearModel: "2021", mileage: "27 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "15000", monthlyPayment: "6100" },
  { title: "Hyundai Grand i10 1.25 Fluid", slug: "hyundai-grand-i10-1-25-fluid", yearModel: "2022", mileage: "18 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "8500", monthlyPayment: "3800" },
  { title: "Kia Picanto 1.0 Start", slug: "kia-picanto-1-0-start", yearModel: "2021", mileage: "24 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "8000", monthlyPayment: "3600" },
  { title: "Kia Rio 1.4 TEC", slug: "kia-rio-1-4-tec", yearModel: "2020", mileage: "37 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "9500", monthlyPayment: "4300" },
  { title: "Kia Sportage 2.0 EX", slug: "kia-sportage-2-0-ex", yearModel: "2019", mileage: "62 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "17000", monthlyPayment: "6700" },
  { title: "Kia Seltos 1.5 EX", slug: "kia-seltos-1-5-ex", yearModel: "2021", mileage: "29 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "15500", monthlyPayment: "6300" },
  { title: "Kia Stonic 1.4 EX", slug: "kia-stonic-1-4-ex", yearModel: "2020", mileage: "33 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "11500", monthlyPayment: "5000" },
  { title: "Nissan Micra 1.2 Visia", slug: "nissan-micra-1-2-visia", yearModel: "2020", mileage: "36 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "8500", monthlyPayment: "3900" },
  { title: "Nissan Almera 1.5 Acenta", slug: "nissan-almera-1-5-acenta", yearModel: "2021", mileage: "28 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "10000", monthlyPayment: "4400" },
  { title: "Nissan X-Trail 2.5 Acenta 4x4", slug: "nissan-x-trail-2-5-acenta-4x4", yearModel: "2019", mileage: "71 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "19000", monthlyPayment: "7400" },
  { title: "Nissan Navara 2.3 TDi LE", slug: "nissan-navara-2-3-tdi-le", yearModel: "2020", mileage: "58 000 km", transmission: "Automatic", fuelType: "Diesel", depositAmount: "21000", monthlyPayment: "7900" },
  { title: "Nissan Qashqai 1.2T Acenta", slug: "nissan-qashqai-1-2t-acenta", yearModel: "2019", mileage: "66 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "14000", monthlyPayment: "5900" },
  { title: "Suzuki Swift 1.2 GL", slug: "suzuki-swift-1-2-gl", yearModel: "2021", mileage: "26 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "8500", monthlyPayment: "3700" },
  { title: "Suzuki Baleno 1.4 GLX", slug: "suzuki-baleno-1-4-glx", yearModel: "2020", mileage: "34 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "10500", monthlyPayment: "4700" },
  { title: "Suzuki Vitara 1.6 GL+", slug: "suzuki-vitara-1-6-gl-plus", yearModel: "2019", mileage: "52 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "14000", monthlyPayment: "5800" },
  { title: "Suzuki Jimny 1.5 GL", slug: "suzuki-jimny-1-5-gl", yearModel: "2022", mileage: "20 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "16000", monthlyPayment: "6500" },
  { title: "Suzuki Ertiga 1.5 GL", slug: "suzuki-ertiga-1-5-gl", yearModel: "2021", mileage: "31 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "12000", monthlyPayment: "5100" },
  { title: "Renault Kwid 1.0 Expression", slug: "renault-kwid-1-0-expression", yearModel: "2021", mileage: "29 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "8000", monthlyPayment: "3500" },
  { title: "Renault Sandero 900T Stepway", slug: "renault-sandero-900t-stepway", yearModel: "2020", mileage: "42 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "9500", monthlyPayment: "4200" },
  { title: "Renault Duster 1.5 dCi Dynamique", slug: "renault-duster-1-5-dci-dynamique", yearModel: "2019", mileage: "63 000 km", transmission: "Manual", fuelType: "Diesel", depositAmount: "13000", monthlyPayment: "5500" },
  { title: "Honda Jazz 1.5 Comfort CVT", slug: "honda-jazz-1-5-comfort-cvt", yearModel: "2020", mileage: "38 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "12000", monthlyPayment: "5300" },
  { title: "Honda HR-V 1.8 Elegance CVT", slug: "honda-hr-v-1-8-elegance-cvt", yearModel: "2019", mileage: "57 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "16000", monthlyPayment: "6600" },
  { title: "Mazda 3 1.6 Dynamic", slug: "mazda-3-1-6-dynamic", yearModel: "2020", mileage: "44 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "13000", monthlyPayment: "5700" },
  { title: "Mazda CX-3 2.0 Dynamic", slug: "mazda-cx3-2-0-dynamic", yearModel: "2019", mileage: "59 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "15000", monthlyPayment: "6400" },
  { title: "Mazda CX-5 2.0 Active", slug: "mazda-cx5-2-0-active", yearModel: "2020", mileage: "48 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "19000", monthlyPayment: "7500" },
  { title: "Opel Corsa 1.4 Enjoy", slug: "opel-corsa-1-4-enjoy", yearModel: "2020", mileage: "40 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "9500", monthlyPayment: "4300" },
  { title: "Opel Mokka 1.4T Enjoy", slug: "opel-mokka-1-4t-enjoy", yearModel: "2019", mileage: "65 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "13500", monthlyPayment: "5600" },
  { title: "Peugeot 208 1.2 PureTech Active", slug: "peugeot-208-1-2-puretech-active", yearModel: "2021", mileage: "25 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "11000", monthlyPayment: "4900" },
  { title: "Peugeot 2008 1.2 PureTech Active", slug: "peugeot-2008-1-2-puretech-active", yearModel: "2020", mileage: "35 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "14000", monthlyPayment: "5900" },
  { title: "Haval Jolion 1.5T City", slug: "haval-jolion-1-5t-city", yearModel: "2022", mileage: "21 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "14500", monthlyPayment: "6000" },
  { title: "Haval H2 1.5T City", slug: "haval-h2-1-5t-city", yearModel: "2021", mileage: "33 000 km", transmission: "Manual", fuelType: "Petrol", depositAmount: "12500", monthlyPayment: "5400" },
  { title: "Chery Tiggo 4 Pro 1.5T CVT", slug: "chery-tiggo-4-pro-1-5t-cvt", yearModel: "2022", mileage: "19 000 km", transmission: "Automatic", fuelType: "Petrol", depositAmount: "13000", monthlyPayment: "5500" },
];

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let created = 0;
    let skipped = 0;

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const existing = await prisma.vehicleOffer.findUnique({ where: { slug: v.slug } });
      if (existing) { skipped++; continue; }

      await prisma.vehicleOffer.create({
        data: {
          title: v.title,
          slug: v.slug,
          featuredImage: PLACEHOLDER_IMAGE,
          depositAmount: v.depositAmount,
          monthlyPayment: v.monthlyPayment,
          yearModel: v.yearModel,
          mileage: v.mileage,
          transmission: v.transmission,
          fuelType: v.fuelType,
          term: "54 Months",
          rentToOwnLabel: "Available for Rent to Own",
          status: "AVAILABLE",
          featured: i < 6,
          sortOrder: i + 1,
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      message: `Done — ${created} vehicles created, ${skipped} already existed.`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
