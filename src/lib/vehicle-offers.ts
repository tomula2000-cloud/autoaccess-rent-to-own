export type VehicleOffer = {
  id: string;
  title: string;
  featuredImage: string;
  gallery: string[];
  rentToOwnLabel: string;
  depositAmount: string;
  monthlyPayment: string;
  term: string;
  yearModel: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  featured?: boolean;
};

export const vehicleOffers: VehicleOffer[] = [
  {
    id: "toyota-corolla-cross-2021",
    title: "Toyota Corolla Cross 1.8 Xi 2021",
    featuredImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    ],
    rentToOwnLabel: "Available for Rent to Own",
    depositAmount: "R 45,000",
    monthlyPayment: "R 8,950 p/m",
    term: "54 Months",
    yearModel: "2021",
    mileage: "58,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
    featured: true,
  },
  {
    id: "vw-polo-tsi-2020",
    title: "VW Polo TSI Comfortline 2020",
    featuredImage:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1400&q=80",
    ],
    rentToOwnLabel: "Available for Rent to Own",
    depositAmount: "R 39,999",
    monthlyPayment: "R 7,650 p/m",
    term: "54 Months",
    yearModel: "2020",
    mileage: "72,000 km",
    transmission: "Manual",
    fuelType: "Petrol",
    featured: true,
  },
  {
    id: "ford-ranger-xlt-2019",
    title: "Ford Ranger 2.2 XLT 2019",
    featuredImage:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=1400&q=80",
    ],
    rentToOwnLabel: "Available for Rent to Own",
    depositAmount: "R 59,000",
    monthlyPayment: "R 10,900 p/m",
    term: "54 Months",
    yearModel: "2019",
    mileage: "94,000 km",
    transmission: "Manual",
    fuelType: "Diesel",
    featured: true,
  },
  {
    id: "toyota-rumion-2022",
    title: "Toyota Rumion 1.5 S 2022",
    featuredImage:
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1597007030739-6d2e28fbe0b0?auto=format&fit=crop&w=1400&q=80",
    ],
    rentToOwnLabel: "Available for Rent to Own",
    depositAmount: "R 47,500",
    monthlyPayment: "R 8,400 p/m",
    term: "54 Months",
    yearModel: "2022",
    mileage: "41,000 km",
    transmission: "Manual",
    fuelType: "Petrol",
  },
  {
    id: "bmw-320i-2018",
    title: "BMW 320i Auto 2018",
    featuredImage:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1518987048-93e29699e79a?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=80",
    ],
    rentToOwnLabel: "Available for Rent to Own",
    depositAmount: "R 65,000",
    monthlyPayment: "R 12,500 p/m",
    term: "54 Months",
    yearModel: "2018",
    mileage: "86,000 km",
    transmission: "Automatic",
    fuelType: "Petrol",
  },
];