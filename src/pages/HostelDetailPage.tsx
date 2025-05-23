import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, DollarSign, Users, Star, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Hostel {
  _id: string;
  name: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  price: number;
  type: string;
  gender: string;
  amenities: string[];
  rules: string[];
  vacancies: number;
  rating: number;
  numReviews: number;
  reviews: Array<{
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  contactPhone: string;
  contactEmail: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

const HostelDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/hostels/${id}`);
      setHostel(response.data);
    } catch (error: any) {
      console.error('Error fetching hostel details:', error);
      setError(error.response?.data?.message || 'Failed to fetch hostel details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post(`/api/hostels/${id}/reviews`, {
        rating,
        comment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchHostelDetails(); // Refresh hostel details to show new review
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error || 'Hostel not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-96">
            <img
              src={hostel.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
              alt={hostel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
              {hostel.type.charAt(0).toUpperCase() + hostel.type.slice(1)}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{hostel.name}</h1>
              <div className="flex items-center bg-primary-50 px-3 py-1 rounded-full">
                <Star className="h-5 w-5 text-primary-500 fill-current" />
                <span className="ml-1 font-medium text-primary-700">
                  {hostel.rating.toFixed(1)} ({hostel.numReviews} reviews)
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <span>
                {hostel.address.street}, {hostel.address.city}, {hostel.address.state} {hostel.address.zipCode}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  ₹{hostel.price.toLocaleString()}/month
                </span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span>
                  {hostel.vacancies} {hostel.vacancies === 1 ? 'space' : 'spaces'} available
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                  {hostel.gender === 'coed' ? 'Co-Ed' : `${hostel.gender.charAt(0).toUpperCase() + hostel.gender.slice(1)} Only`}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{hostel.description}</p>
            
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`tel:${hostel.contactPhone}`} className="text-primary-600 hover:text-primary-700">
                    {hostel.contactPhone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`mailto:${hostel.contactEmail}`} className="text-primary-600 hover:text-primary-700">
                    {hostel.contactEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities & Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {hostel.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Rules</h2>
            <div className="grid grid-cols-1 gap-3">
              {hostel.rules.map((rule, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>
          
          {user && (
            <form onSubmit={handleSubmitReview} className="mb-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="form-input"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="form-input"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary w-full"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
          
          <div className="space-y-6">
            {hostel.reviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{review.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-primary-500 fill-current" />
                    <span className="ml-1 text-gray-600">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            
            {hostel.reviews.length === 0 && (
              <p className="text-gray-600 text-center">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;