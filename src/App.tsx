import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import HostelSearchPage from './pages/HostelSearchPage';
import RoommateSearchPage from './pages/RoommateSearchPage';
import HostelDetailPage from './pages/HostelDetailPage';
import RoommateDetailPage from './pages/RoommateDetailPage';
import RegisterHostelPage from './pages/RegisterHostelPage';
import RegisterRoommatePage from './pages/RegisterRoommatePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hostels" element={<HostelSearchPage />} />
              <Route path="/hostels/:id" element={<HostelDetailPage />} />
              <Route path="/roommates" element={<RoommateSearchPage />} />
              <Route path="/roommates/:id" element={<RoommateDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/register-hostel" 
                element={
                  <ProtectedRoute>
                    <RegisterHostelPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register-roommate" 
                element={
                  <ProtectedRoute>
                    <RegisterRoommatePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;