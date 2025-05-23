import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Home as HomeIcon, MapPin, DollarSign, Shield } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-enter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect Hostel & Ideal Roommate
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Search affordable accommodations based on your budget and location preferences. 
              Connect with compatible roommates to share your space.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hostels" className="btn btn-accent py-3 px-8 text-base">
                <Search className="mr-2 h-5 w-5" />
                Find Hostels
              </Link>
              <Link to="/roommates" className="btn btn-secondary py-3 px-8 text-base">
                <Users className="mr-2 h-5 w-5" />
                Find Roommates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              RoomBuddy makes finding hostels and roommates simple with just a few steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search By Location</h3>
              <p className="text-gray-600">Find hostels and PGs in your preferred area with our location-based search.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filter By Budget</h3>
              <p className="text-gray-600">Set your budget range and find accommodations that match your financial needs.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 text-accent-600 rounded-full mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Match With Roommates</h3>
              <p className="text-gray-600">Connect with potential roommates based on preferences and compatibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose RoomBuddy</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers unique features to make your hostel and roommate search seamless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Search className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Advanced Filtering</h3>
                <p className="mt-2 text-gray-600">
                  Find exactly what you're looking for with our comprehensive filtering system. Filter by budget, location, amenities, and more.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Roommate Matching</h3>
                <p className="mt-2 text-gray-600">
                  Our intelligent algorithm helps you find roommates with similar lifestyles, schedules, and preferences.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <HomeIcon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Verified Listings</h3>
                <p className="mt-2 text-gray-600">
                  Browse through our verified hostel and PG listings with authentic photos and accurate information.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Secure Platform</h3>
                <p className="mt-2 text-gray-600">
                  Your safety is our priority. All users go through a verification process for a secure experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Accommodation?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of students and professionals who found their ideal living space through RoomBuddy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-gray-100 py-3 px-8 text-base">
              Create an Account
            </Link>
            <Link to="/hostels" className="btn border-2 border-white text-white hover:bg-primary-700 py-3 px-8 text-base">
              Start Searching
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;