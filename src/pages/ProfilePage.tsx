import React from 'react';

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">John Doe</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">john.doe@example.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-gray-900">+1 234 567 8900</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-gray-900">New York, USA</p>
              </div>
            </div>
          </div>

          {/* Account Settings Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
              <button className="ml-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-900 font-medium">Hostel Listing Updated</p>
                <p className="text-gray-600 text-sm">Yesterday at 2:30 PM</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-900 font-medium">New Message Received</p>
                <p className="text-gray-600 text-sm">2 days ago</p>
              </div>
              <div className="border-b pb-4">
                <p className="text-gray-900 font-medium">Profile Updated</p>
                <p className="text-gray-600 text-sm">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;