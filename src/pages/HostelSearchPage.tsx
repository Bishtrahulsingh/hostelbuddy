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
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      let queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.amenities.length > 0) queryParams.append('amenities', filters.amenities.join(','));
      
      // In a real app, we would call the API with these filters
      // For now, we'll just simulate a delay and show all hostels
      
      // Mock data for demonstration
      const mockHostels: Hostel[] = [
        {
          _id: '1',
          name: 'Sunshine Hostel',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          address: {
            street: '123 College Road',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India',
          },
          price: 8000,
          rating: 4.2,
          numReviews: 24,
          vacancies: 5,
          gender: 'male',
          type: 'hostel',
          amenities: ['WiFi', 'AC', 'Laundry', 'Security'],
        },
        {
          _id: '2',
          name: 'Green Valley PG',
          images: ['https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'],
          address: {
            street: '45 MG Road',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560002',
            country: 'India',
          },
          price: 10000,
          rating: 4.5,
          numReviews: 15,
          vacancies: 2,
          gender: 'female',
          type: 'pg',
          amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Kitchen'],
        },
        {
          _id: '3',
          name: 'Campus Corner Apartments',
          images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'],
          address: {
            street: '789 Tech Park',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560003',
            country: 'India',
          },
          price: 15000,
          rating: 4.8,
          numReviews: 31,
          vacancies: 3,
          gender: 'coed',
          type: 'apartment',
          amenities: ['WiFi', 'AC', 'Parking', 'Gym', 'Security', 'Study Room'],
        },
        {
          _id: '4',
          name: 'Serene Stay PG',
          images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'],
          address: {
            street: '56 Church Street',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560004',
            country: 'India',
          },
          price: 9500,
          rating: 4.0,
          numReviews: 18,
          vacancies: 7,
          gender: 'female',
          type: 'pg',
          amenities: ['WiFi', 'Hot Water', 'Laundry', 'Power Backup'],
        },
      ];

      // Filter mock data based on search filters
      let filteredHostels = [...mockHostels];
      
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.name.toLowerCase().includes(keyword) || 
          hostel.address.city.toLowerCase().includes(keyword)
        );
      }
      
      if (filters.city) {
        const city = filters.city.toLowerCase();
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.address.city.toLowerCase().includes(city)
        );
      }
      
      if (filters.minPrice) {
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.price >= Number(filters.minPrice)
        );
      }
      
      if (filters.maxPrice) {
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.price <= Number(filters.maxPrice)
        );
      }
      
      if (filters.type) {
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.type === filters.type
        );
      }
      
      if (filters.gender) {
        filteredHostels = filteredHostels.filter(hostel => 
          hostel.gender === filters.gender
        );
      }
      
      if (filters.amenities.length > 0) {
        filteredHostels = filteredHostels.filter(hostel => 
          filters.amenities.every(amenity => hostel.amenities.includes(amenity))
        );
      }
      
      setTimeout(() => {
        setHostels(filteredHostels);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setError('Failed to fetch hostels. Please try again.');
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
    fetchHostels();
  };

  const applyFilters = () => {
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {hostels.length} {hostels.length === 1 ? 'Result' : 'Results'}
                </h2>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    className="rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                  <HostelCard key={hostel._id} hostel={hostel} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelSearchPage;