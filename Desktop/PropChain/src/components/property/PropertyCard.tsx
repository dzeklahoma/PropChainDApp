import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Square, Tag } from "lucide-react";
import { Property } from "../../types/property";
import { formatCurrency } from "../../lib/utils";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const statusColors = {
    forSale:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    sold: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  const statusLabels = {
    forSale: "For Sale",
    pending: "Pending",
    sold: "Sold",
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-video overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[property.status]
          }`}
        >
          {statusLabels[property.status]}
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 left-3 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Price */}
        <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {formatCurrency(property.price)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.location}</span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>

          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-gray-400" />
            <span>
              {property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>

          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1 text-gray-400" />
            <span>{property.area} ft²</span>
          </div>
        </div>

        {/* Token ID (if available) */}
        {property.tokenId && (
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Tag className="h-3 w-3 mr-1" />
            <span className="truncate">
              Token: {property.tokenId.substring(0, 8)}...
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
