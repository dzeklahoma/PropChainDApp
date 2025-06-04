import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { Property, PropertyFilter } from "../../types/property";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

const PropertyGrid = ({ properties, loading = false }: PropertyGridProps) => {
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(properties);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilter>({});

  useEffect(() => {
    let result = properties;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query)
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(
        (property) => property.price >= (filters.minPrice || 0)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(
        (property) => property.price <= (filters.maxPrice || Infinity)
      );
    }

    // Apply bedroom filters
    if (filters.minBedrooms) {
      result = result.filter(
        (property) => property.bedrooms >= (filters.minBedrooms || 0)
      );
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter((property) =>
        property.location
          .toLowerCase()
          .includes(filters.location?.toLowerCase() || "")
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((property) => property.status === filters.status);
    }

    setFilteredProperties(result);
  }, [properties, searchQuery, filters]);

  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
              <div className="aspect-video"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search properties..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter section */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bedrooms
                </label>
                <select
                  value={filters.minBedrooms || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minBedrooms: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={filters.location || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      location: e.target.value || undefined,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: (e.target.value as any) || undefined,
                    })
                  }
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Any</option>
                  <option value="forSale">For Sale</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            ¯\_(ツ)_/¯
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters to find properties.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
