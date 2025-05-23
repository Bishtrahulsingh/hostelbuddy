import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MapPin, DollarSign, BedDouble, UserCheck } from 'lucide-react';
import HostelCard from '../components/common/HostelCard';

interface Hostel {
  _id: string;
  name: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  price: number;
  rating: number;
  numReviews: number;
  vacancies: number;
  gender: string;
  type: string;
  amenities: string[];
}

interface FilterState {
  keyword: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  type: string;
  gender: string;
  amenities: string[];
}

const HostelSearchPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    gender: '',
    amenities: [],
  });
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  // List of amenities to filter by
  const amenitiesList = [
    'WiFi', 'AC', 'Parking', 'Laundry', 'TV', 'Kitchen', 'Hot Water', 
    'Security', 'Gym', 'Study Room', 'Power Backup'
  ];

  useEffect(() => {
    fetchHostels();
  }, [page]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      let queryParams = new URLSearchParams();
      queryParams.append('pageNumber', page.toString());
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.amenities.length > 0) queryParams.append('amenities', filters.amenities.join(','));
      
      const response = await axios.get(`/api/hostels?${queryParams.toString()}`);
      setHostels(response.data.hostels);
      setTotalPages(response.data.pages);
    } catch (error: any) {
      console.error('Error fetching hostels:', error);
      setError(error.response?.data?.message || 'Failed to fetch hostels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFilters(prevFilters => {
      const newAmenities = prevFilters.amenities.includes(amenity)
        ? prevFilters.amenities.filter(a => a !== amenity)
        : [...prevFilters.amenities, amenity];
      
      return {
        ...prevFilters,
        amenities: newAmenities,
      };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prevFilters => ({
      ...prevFilters,
      keyword: searchQuery,
    }));
    setPage(1);
    fetchHostels();
  };

  const applyFilters = () => {
    setPage(1);
    fetchHostels();
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      type: '',
      gender: '',
      amenities: [],
    });
    setSearchQuery('');
    setPage(1);
    fetchHostels();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Hostel</h1>
          <p className="text-gray-600">
            Search hostels and PGs based on your budget and location preferences
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by hostel name or location"
                className="pl-10 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="btn btn-primary py-3 px-6"
            >
              Search
            </button>
            <button 
              type="button"
              className="btn btn-outline py-3 md:px-6 flex items-center justify-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Filters</span>
            </button>
          </form>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-enter">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  placeholder="Min price"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  placeholder="Max price"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  <BedDouble className="inline-block h-4 w-4 mr-1" />
                  Property Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="hostel">Hostel</option>
                  <option value="pg">PG</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  <UserCheck className="inline-block h-4 w-4 mr-1" />
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.gender}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="coed">Co-Ed</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      id={`amenity-${amenity}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hostels found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any hostels matching your search criteria. Try adjusting your filters or search for a different location.
              </p>
              <button 
                className="btn btn-primary"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                  <HostelCard key={hostel._id} hostel={hostel} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="btn btn-outline py-2 px-4 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`btn ${
                          pageNum === page ? 'btn-primary' : 'btn-outline'
                        } py-2 px-4`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="btn btn-outline py-2 px-4 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelSearchPage;