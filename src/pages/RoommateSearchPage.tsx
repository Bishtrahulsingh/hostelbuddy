import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import RoommateCard from '../components/common/RoommateCard';

interface Roommate {
  _id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  budget: {
    min: number;
    max: number;
  };
  preferredLocation: {
    city: string;
    areas: string[];
  };
  moveInDate: string;
  stayDuration: string;
  lifestyle: {
    smoking: boolean;
    drinking: boolean;
    pets: boolean;
    cooking: boolean;
    earlyRiser: boolean;
    nightOwl: boolean;
  };
  bio: string;
  profileImage?: string;
}

interface FilterState {
  keyword: string;
  city: string;
  minBudget: string;
  maxBudget: string;
  gender: string;
  occupation: string;
  minAge: string;
  maxAge: string;
  moveInDate: string;
  lifestylePreferences: string[];
}

const RoommateSearchPage: React.FC = () => {
  const [roommates, setRoommates] = useState<Roommate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    city: '',
    minBudget: '',
    maxBudget: '',
    gender: '',
    occupation: '',
    minAge: '',
    maxAge: '',
    moveInDate: '',
    lifestylePreferences: [],
  });
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchRoommates();
  }, [page]);

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string from filters
      let queryParams = new URLSearchParams();
      queryParams.append('pageNumber', page.toString());
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.occupation) queryParams.append('occupation', filters.occupation);
      if (filters.minAge) queryParams.append('minAge', filters.minAge);
      if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
      if (filters.moveInDate) queryParams.append('moveInDate', filters.moveInDate);
      
      const response = await axios.get(`/api/roommates?${queryParams.toString()}`);
      setRoommates(response.data.roommates);
      setTotalPages(response.data.pages);
    } catch (error: any) {
      console.error('Error fetching roommates:', error);
      setError(error.response?.data?.message || 'Failed to fetch roommates');
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prevFilters => ({
      ...prevFilters,
      keyword: searchQuery,
    }));
    setPage(1);
    fetchRoommates();
  };

  const applyFilters = () => {
    setPage(1);
    fetchRoommates();
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      city: '',
      minBudget: '',
      maxBudget: '',
      gender: '',
      occupation: '',
      minAge: '',
      maxAge: '',
      moveInDate: '',
      lifestylePreferences: [],
    });
    setSearchQuery('');
    setPage(1);
    fetchRoommates();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="bg-gray-50 min-h-screen animate-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Ideal Roommate</h1>
          <p className="text-gray-600">
            Connect with potential roommates based on location, budget, and lifestyle preferences
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
                placeholder="Search by name or location"
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
                <label htmlFor="minBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Min Budget (₹)
                </label>
                <input
                  type="number"
                  id="minBudget"
                  name="minBudget"
                  placeholder="Min budget"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.minBudget}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Max Budget (₹)
                </label>
                <input
                  type="number"
                  id="maxBudget"
                  name="maxBudget"
                  placeholder="Max budget"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.maxBudget}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="inline-block h-4 w-4 mr-1" />
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
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.occupation}
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="student">Student</option>
                  <option value="working">Working Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  Move-in Date (Before)
                </label>
                <input
                  type="date"
                  id="moveInDate"
                  name="moveInDate"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.moveInDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Age
                </label>
                <input
                  type="number"
                  id="minAge"
                  name="minAge"
                  placeholder="Min age"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Age
                </label>
                <input
                  type="number"
                  id="maxAge"
                  name="maxAge"
                  placeholder="Max age"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                />
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
          ) : roommates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No roommates found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any roommates matching your search criteria. Try adjusting your filters or search for a different location.
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
              <div className="space-y-6">
                {roommates.map((roommate) => (
                  <RoommateCard key={roommate._id} roommate={roommate} />
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

export default RoommateSearchPage;