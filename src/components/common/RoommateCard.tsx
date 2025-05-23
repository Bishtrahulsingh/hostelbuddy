import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Clock } from 'lucide-react';

interface RoommateProps {
  roommate: {
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
  };
}

const RoommateCard: React.FC<RoommateProps> = ({ roommate }) => {
  // Default images based on gender
  const defaultMaleImage = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg';
  const defaultFemaleImage = 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg';
  const defaultOtherImage = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg';
  
  const getDefaultImage = () => {
    switch (roommate.gender) {
      case 'male':
        return defaultMaleImage;
      case 'female':
        return defaultFemaleImage;
      default:
        return defaultOtherImage;
    }
  };

  const imageUrl = roommate.profileImage || getDefaultImage();
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format stay duration text
  const formatStayDuration = (duration: string) => {
    return duration.charAt(0).toUpperCase() + duration.slice(1);
  };

  // Format occupation text
  const formatOccupation = (occupation: string) => {
    switch (occupation) {
      case 'student':
        return 'Student';
      case 'working':
        return 'Working Professional';
      case 'other':
        return 'Other';
      default:
        return occupation;
    }
  };

  // Get lifestyle tags
  const getLifestyleTags = () => {
    const tags = [];
    
    if (roommate.lifestyle.smoking) tags.push('Smoker');
    if (roommate.lifestyle.drinking) tags.push('Drinker');
    if (roommate.lifestyle.pets) tags.push('Pet Friendly');
    if (roommate.lifestyle.cooking) tags.push('Cooks Often');
    if (roommate.lifestyle.earlyRiser) tags.push('Early Riser');
    if (roommate.lifestyle.nightOwl) tags.push('Night Owl');
    
    return tags;
  };

  return (
    <div className="card group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-1/3">
          <img 
            src={imageUrl} 
            alt={roommate.name} 
            className="h-48 sm:h-full w-full object-cover sm:rounded-l-lg rounded-t-lg sm:rounded-t-none"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium">
            {formatOccupation(roommate.occupation)}
          </div>
        </div>
        
        <div className="p-4 sm:w-2/3">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {roommate.name}, {roommate.age}
            </h3>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full capitalize">
              {roommate.gender}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            <span>Looking in {roommate.preferredLocation.city}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
            <span>₹{roommate.budget.min.toLocaleString()} - ₹{roommate.budget.max.toLocaleString()}/month</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex items-center text-gray-600 text-xs">
              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
              <span>Move-in: {formatDate(roommate.moveInDate)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 text-xs">
              <Clock className="h-3 w-3 text-gray-400 mr-1" />
              <span>Stay: {formatStayDuration(roommate.stayDuration)}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {roommate.bio}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {getLifestyleTags().map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Link 
              to={`/roommates/${roommate._id}`}
              className="btn btn-secondary py-1 px-3 text-xs"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;