import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

function normalizeString(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as
      | {
          email?: string;
          role?: string;
        }
      | undefined;

    if (!sessionUser?.email || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = normalizeString(body.title);
    const slug = normalizeString(body.slug);
    const featuredImage = normalizeString(body.featuredImage);
    const galleryImage1 = normalizeString(body.galleryImage1) || null;
    const galleryImage2 = normalizeString(body.galleryImage2) || null;
    const galleryImage3 = normalizeString(body.galleryImage3) || null;
    const galleryImage4 = normalizeString(body.galleryImage4) || null;
    const rentToOwnLabel =
      normalizeString(body.rentToOwnLabel) || "Available for Rent to Own";
    const depositAmount = normalizeString(body.depositAmount);
    const monthlyPayment = normalizeString(body.monthlyPayment);
    const term = normalizeString(body.term) || "54 Months";
    const yearModel = normalizeString(body.yearModel);
    const mileage = normalizeString(body.mileage);
    const transmission = normalizeString(body.transmission);
    const fuelType = normalizeString(body.fuelType);
    const status = normalizeString(body.status);
    const featured = Boolean(body.featured);
    const sortOrder = Number(body.sortOrder ?? 0);

    if (
      !title ||
      !slug ||
      !featuredImage ||
      !depositAmount ||
      !monthlyPayment ||
      !term ||
      !yearModel ||
      !mileage ||
      !transmission ||
      !fuelType ||
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required vehicle fields.",
        },
        { status: 400 }
      );
    }

    if (!["AVAILABLE", "UNDER_OFFER", "SOLD"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid vehicle status: ${status}`,
        },
        { status: 400 }
      );
    }

    const existingVehicle = await prisma.vehicleOffer.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "That vehicle slug already exists. Please use a different slug.",
        },
        { status: 400 }
      );
    }

    await prisma.vehicleOffer.create({
      data: {
        title,
        slug,
        featuredImage,
        galleryImage1,
        galleryImage2,
        galleryImage3,
        galleryImage4,
        rentToOwnLabel,
        depositAmount,
        monthlyPayment,
        term,
        yearModel,
        mileage,
        transmission,
        fuelType,
        status: status as "AVAILABLE" | "UNDER_OFFER" | "SOLD",
        featured,
        sortOrder,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle offer created successfully.",
    });
  } catch (error) {
    console.error("Vehicle create failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        message: `Vehicle create failed: ${message}`,
      },
      { status: 500 }
    );
  }
}