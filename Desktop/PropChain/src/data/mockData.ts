import { Property, Transaction } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Downtown Apartment",
    description: "Luxurious apartment in the heart of downtown with stunning city views. Features include high ceilings, hardwood floors, and state-of-the-art appliances. The building offers amenities such as a fitness center, rooftop pool, and 24-hour concierge service.",
    price: 425000,
    location: "New York, NY",
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2018,
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg"
    ],
    status: "forSale",
    tokenId: "0x123abc456def",
    featured: true
  },
  {
    id: "prop-2",
    title: "Suburban Family Home",
    description: "Spacious family home in a quiet suburban neighborhood. Features a large backyard, updated kitchen, and finished basement. Located near excellent schools, parks, and shopping centers.",
    price: 625000,
    location: "Austin, TX",
    area: 2800,
    bedrooms: 4,
    bathrooms: 3,
    yearBuilt: 2010,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
    ],
    status: "forSale",
    tokenId: "0x789xyz012uvw"
  },
  {
    id: "prop-3",
    title: "Beachfront Condo",
    description: "Stunning beachfront condo with panoramic ocean views. Recently renovated with high-end finishes throughout. Complex includes private beach access, swimming pool, and tennis courts.",
    price: 875000,
    location: "Miami, FL",
    area: 1500,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2015,
    images: [
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg",
      "https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg"
    ],
    status: "pending",
    tokenId: "0x456mno789pqr",
    featured: true
  },
  {
    id: "prop-4",
    title: "Mountain Retreat Cabin",
    description: "Cozy cabin nestled in the mountains. Perfect for nature lovers and outdoor enthusiasts. Features include stone fireplace, wraparound deck, and modern amenities. Close to hiking trails and ski resorts.",
    price: 350000,
    location: "Denver, CO",
    area: 1800,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 2005,
    images: [
      "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg",
      "https://images.pexels.com/photos/463734/pexels-photo-463734.jpeg"
    ],
    status: "forSale",
    tokenId: "0x321efg654hij"
  },
  {
    id: "prop-5",
    title: "Historic Brownstone",
    description: "Charming historic brownstone with original architectural details and modern updates. Features include crown molding, hardwood floors, and a gourmet kitchen. Located in a vibrant neighborhood with restaurants, shops, and cultural attractions.",
    price: 950000,
    location: "Boston, MA",
    area: 2200,
    bedrooms: 3,
    bathrooms: 2.5,
    yearBuilt: 1920,
    images: [
      "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
      "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg"
    ],
    status: "forSale",
    tokenId: "0x789rst012uvw"
  },
  {
    id: "prop-6",
    title: "Waterfront Estate",
    description: "Luxurious waterfront estate on a private lot. Features include a chef's kitchen, home theater, wine cellar, and outdoor entertainment area with infinity pool. Private dock with direct access to the bay.",
    price: 2950000,
    location: "Seattle, WA",
    area: 5500,
    bedrooms: 5,
    bathrooms: 4.5,
    yearBuilt: 2017,
    images: [
      "https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg",
      "https://images.pexels.com/photos/7031406/pexels-photo-7031406.jpeg"
    ],
    status: "forSale",
    tokenId: "0x012xyz345abc",
    featured: true
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    propertyId: "prop-3",
    fromAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    toAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    amount: 875000,
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    status: "completed",
    txHash: "0x8c3f27bf5ded69a68e8fc926831f8cf8ee9e24a32b17ff1c919e4d34dfd3c615"
  },
  {
    id: "tx-2",
    propertyId: "prop-1",
    fromAddress: "0x5aeda56215b167893e80b4fe645ba6d5bab767de",
    toAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    amount: 425000,
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    status: "completed",
    txHash: "0x7fa89bbbe19e5033cadd0ffe662a64c0155181b9eef6ee4fd893b629d9432e7a"
  },
  {
    id: "tx-3",
    propertyId: "prop-5",
    fromAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    toAddress: "0x0000000000000000000000000000000000000000",
    amount: 950000,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    status: "pending",
    txHash: "0x5a2ea5135f911c1e8cc99543d19360d30f9af1d3e63f507fb28c5033a5fcdfc2"
  }
];