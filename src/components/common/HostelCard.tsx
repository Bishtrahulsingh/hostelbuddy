import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, DollarSign, Star } from 'lucide-react';

interface HostelProps {
  hostel: {
    _id: string;
    name: string;
    images: string[];
    address: {
      street: string;
      city: string;
      state: string;
    };
    price: number;
    rating: number;
    numReviews: number;
    vacancies: number;
    gender: string;
    type: string;
    amenities: string[];
  };
}

const HostelCard: React.FC<HostelProps> = ({ hostel }) => {
  // Default image if none provided
  const defaultImage = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
  const imageUrl = hostel.images.length > 0 ? hostel.images[0] : defaultImage;

  // Format property type text
  const formatPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format gender text
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Men Only';
      case 'female':
        return 'Women Only';
      case 'coed':
        return 'Co-Ed';
      default:
        return gender;
    }
  };

  return (
    <div className="card group hover:translate-y-[-4px] transition-all duration-300">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={hostel.name} 
          className="h-48 w-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium">
          {formatPropertyType(hostel.type)}
        </div>
        <div className="absolute bottom-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-md text-xs font-medium">
          {formatGender(hostel.gender)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {hostel.name}
          </h3>
          <div className="flex items-center text-accent-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {hostel.rating.toFixed(1)} ({hostel.numReviews})
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span className="truncate">
            {hostel.address.street}, {hostel.address.city}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Users className="h-4 w-4 text-gray-400 mr-1" />
          <span>{hostel.vacancies} {hostel.vacancies === 1 ? 'space' : 'spaces'} available</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">₹{hostel.price.toLocaleString()}</span>
            <span className="text-gray-600 text-sm ml-1">/month</span>
          </div>
          <Link 
            to={`/hostels/${hostel._id}`}
            className="btn btn-primary py-1 px-3 text-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;