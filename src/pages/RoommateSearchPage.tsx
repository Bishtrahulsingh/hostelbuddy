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

  // List of lifestyle preferences to filter by
  const lifestylePreferences = [
    'non-smoking', 'non-drinking', 'pet-friendly', 
    'early-riser', 'night-owl', 'vegetarian'
  ];

  useEffect(() => {
    fetchRoommates();
  }, []);

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      let queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget);
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.occupation) queryParams.append('occupation', filters.occupation);
      if (filters.minAge) queryParams.append('minAge', filters.minAge);
      if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
      if (filters.moveInDate) queryParams.append('moveInDate', filters.moveInDate);
      if (filters.lifestylePreferences.length > 0) {
        queryParams.append('lifestylePreferences', filters.lifestylePreferences.join(','));
      }
      
      // In a real app, we would call the API with these filters
      // For now, we'll just simulate a delay and show all roommates
      
      // Mock data for demonstration
      const mockRoommates: Roommate[] = [
        {
          _id: '1',
          name: 'Rahul Singh',
          age: 24,
          gender: 'male',
          occupation: 'working',
          budget: {
            min: 8000,
            max: 12000,
          },
          preferredLocation: {
            city: 'Bangalore',
            areas: ['Koramangala', 'Indiranagar', 'HSR Layout'],
          },
          moveInDate: '2023-07-15',
          stayDuration: '6-12 months',
          lifestyle: {
            smoking: false,
            drinking: true,
            pets: false,
            cooking: true,
            earlyRiser: true,
            nightOwl: false,
          },
          bio: 'Software engineer working at a startup. Clean, quiet, and respectful. I enjoy cooking and watching movies on weekends.',
          profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          age: 22,
          gender: 'female',
          occupation: 'student',
          budget: {
            min: 6000,
            max: 9000,
          },
          preferredLocation: {
            city: 'Bangalore',
            areas: ['Jayanagar', 'JP Nagar', 'Banashankari'],
          },
          moveInDate: '2023-06-01',
          stayDuration: '3-6 months',
          lifestyle: {
            smoking: false,
            drinking: false,
            pets: true,
            cooking: false,
            earlyRiser: false,
            nightOwl: true,
          },
          bio: 'Graduate student studying Computer Science. Looking for a clean and quiet place to stay. I have a small cat who is very well behaved.',
          profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        },
        {
          _id: '3',
          name: 'Amit Kumar',
          age: 27,
          gender: 'male',
          occupation: 'working',
          budget: {
            min: 10000,
            max: 15000,
          },
          preferredLocation: {
            city: 'Bangalore',
            areas: ['Whitefield', 'Marathahalli', 'Electronic City'],
          },
          moveInDate: '2023-08-01',
          stayDuration: 'more than 12 months',
          lifestyle: {
            smoking: true,
            drinking: true,
            pets: false,
            cooking: false,
            earlyRiser: false,
            nightOwl: true,
          },
          bio: 'Product manager at a tech company. I work long hours and mostly keep to myself. Looking for a modern apartment with good amenities.',
        },
        {
          _id: '4',
          name: 'Sneha Reddy',
          age: 25,
          gender: 'female',
          occupation: 'working',
          budget: {
            min: 9000,
            max: 14000,
          },
          preferredLocation: {
            city: 'Bangalore',
            areas: ['Indiranagar', 'Koramangala', 'Richmond Town'],
          },
          moveInDate: '2023-07-01',
          stayDuration: '6-12 months',
          lifestyle: {
            smoking: false,
            drinking: true,
            pets: false,
            cooking: true,
            earlyRiser: true,
            nightOwl: false,
          },
          bio: 'UX designer who loves cooking and yoga. Looking for like-minded roommates who appreciate cleanliness and occasional social gatherings.',
          profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        },
      ];

      // Filter mock data based on search filters
      let filteredRoommates = [...mockRoommates];
      
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.name.toLowerCase().includes(keyword) || 
          roommate.bio.toLowerCase().includes(keyword) ||
          roommate.preferredLocation.city.toLowerCase().includes(keyword)
        );
      }
      
      if (filters.city) {
        const city = filters.city.toLowerCase();
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.preferredLocation.city.toLowerCase().includes(city)
        );
      }
      
      if (filters.minBudget) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.budget.max >= Number(filters.minBudget)
        );
      }
      
      if (filters.maxBudget) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.budget.min <= Number(filters.maxBudget)
        );
      }
      
      if (filters.gender) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.gender === filters.gender
        );
      }
      
      if (filters.occupation) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.occupation === filters.occupation
        );
      }
      
      if (filters.minAge) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.age >= Number(filters.minAge)
        );
      }
      
      if (filters.maxAge) {
        filteredRoommates = filteredRoommates.filter(roommate => 
          roommate.age <= Number(filters.maxAge)
        );
      }
      
      if (filters.moveInDate) {
        const filterDate = new Date(filters.moveInDate);
        filteredRoommates = filteredRoommates.filter(roommate => {
          const moveInDate = new Date(roommate.moveInDate);
          return moveInDate <= filterDate;
        });
      }
      
      // Handle lifestyle preferences filtering
      if (filters.lifestylePreferences.length > 0) {
        filteredRoommates = filteredRoommates.filter(roommate => {
          for (const pref of filters.lifestylePreferences) {
            if (pref === 'non-smoking' && roommate.lifestyle.smoking) return false;
            if (pref === 'non-drinking' && roommate.lifestyle.drinking) return false;
            if (pref === 'pet-friendly' && !roommate.lifestyle.pets) return false;
            if (pref === 'early-riser' && !roommate.lifestyle.earlyRiser) return false;
            if (pref === 'night-owl' && !roommate.lifestyle.nightOwl) return false;
          }
          return true;
        });
      }
      
      setTimeout(() => {
        setRoommates(filteredRoommates);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching roommates:', error);
      setError('Failed to fetch roommates. Please try again.');
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

  const handleLifestyleChange = (preference: string) => {
    setFilters(prevFilters => {
      const newPreferences = prevFilters.lifestylePreferences.includes(preference)
        ? prevFilters.lifestylePreferences.filter(p => p !== preference)
        : [...prevFilters.lifestylePreferences, preference];
      
      return {
        ...prevFilters,
        lifestylePreferences: newPreferences,
      };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prevFilters => ({
      ...prevFilters,
      keyword: searchQuery,
    }));
    fetchRoommates();
  };

  const applyFilters = () => {
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lifestyle Preferences
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {lifestylePreferences.map((preference) => (
                  <div key={preference} className="flex items-center">
                    <input
                      id={`lifestyle-${preference}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={filters.lifestylePreferences.includes(preference)}
                      onChange={() => handleLifestyleChange(preference)}
                    />
                    <label htmlFor={`lifestyle-${preference}`} className="ml-2 text-sm text-gray-700">
                      {preference.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {roommates.length} {roommates.length === 1 ? 'Result' : 'Results'}
                </h2>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    className="rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="date">Most Recent</option>
                    <option value="budget_low">Budget: Low to High</option>
                    <option value="budget_high">Budget: High to Low</option>
                    <option value="age">Age</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                {roommates.map((roommate) => (
                  <RoommateCard key={roommate._id} roommate={roommate} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoommateSearchPage;