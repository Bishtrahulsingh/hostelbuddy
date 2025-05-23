import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, DollarSign, Calendar, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  contactPreference: string;
  phone?: string;
  user: {
    _id: string;
    email: string;
  };
}

const RoommateDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [roommate, setRoommate] = useState<Roommate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoommateDetails();
  }, [id]);

  const fetchRoommateDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/roommates/${id}`);
      setRoommate(response.data);
    } catch (error: any) {
      console.error('Error fetching roommate details:', error);
      setError(error.response?.data?.message || 'Failed to fetch roommate details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !roommate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error || 'Roommate not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="relative h-64 md:h-96">
            <img
              src={roommate.profileImage || `https://images.pexels.com/photos/${roommate.gender === 'female' ? '415829' : '220453'}/pexels-photo-${roommate.gender === 'female' ? '415829' : '220453'}.jpeg`}
              alt={roommate.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
              {roommate.occupation.charAt(0).toUpperCase() + roommate.occupation.slice(1)}
            </div>
          </div>

          <div className="p-6">
            {/* Basic Info */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {roommate.name}, {roommate.age}
                </h1>
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {roommate.gender.charAt(0).toUpperCase() + roommate.gender.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Looking in {roommate.preferredLocation.city}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Budget: ₹{roommate.budget.min.toLocaleString()} - ₹{roommate.budget.max.toLocaleString()}/month</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Move-in: {new Date(roommate.moveInDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span>Stay Duration: {roommate.stayDuration}</span>
                </div>
              </div>

              <p className="text-gray-600">{roommate.bio}</p>
            </div>

            {/* Preferred Areas */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Preferred Areas</h2>
              <div className="flex flex-wrap gap-2">
                {roommate.preferredLocation.areas.map((area, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Lifestyle</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(roommate.lifestyle).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center ${
                      value ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      value ? 'bg-green-500' : 'bg-gray-400'
                    } mr-2`}></span>
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            {user && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(roommate.contactPreference === 'email' || roommate.contactPreference === 'both') && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`mailto:${roommate.user.email}`} className="text-primary-600 hover:text-primary-700">
                        {roommate.user.email}
                      </a>
                    </div>
                  )}
                  {(roommate.contactPreference === 'phone' || roommate.contactPreference === 'both') && roommate.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`tel:${roommate.phone}`} className="text-primary-600 hover:text-primary-700">
                        {roommate.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!user && (
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <p className="text-gray-600 text-center">
                  Please <a href="/login" className="text-primary-600 hover:text-primary-700">login</a> to view contact information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateDetailPage;