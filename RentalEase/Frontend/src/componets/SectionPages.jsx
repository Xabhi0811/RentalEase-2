import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";

const SectionPages = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/hosting/${propertyId}`
      );
      
      const enhancedProperty = response.data;
      if (!enhancedProperty.images || enhancedProperty.images.length === 0) {
        enhancedProperty.images = [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
          'https://images.unsplash.com/photo-1628592102751-ba83b0314276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
        ];
      } else if (enhancedProperty.images.length > 4) {
        // Only keep the first 4 images
        enhancedProperty.images = enhancedProperty.images.slice(0, 4);
      }
      
      setProperty(enhancedProperty);
      setError('');
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError('Failed to load property details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const openImageGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowImageGallery(true);
  };

  const closeImageGallery = () => {
    setShowImageGallery(false);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center">
            <div className="animate-pulse bg-gradient-to-r from-blue-400 to-indigo-600 w-16 h-16 rounded-full"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading property details...</p>
          <p className="text-sm text-gray-500 mt-2">Just a moment please</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md">
              <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeImageGallery}
            className="absolute top-6 right-6 text-white text-3xl z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            &times;
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 text-white text-2xl z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            &#8249;
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-6 text-white text-2xl z-50 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            &#8250;
          </button>
          
          <div className="max-w-5xl w-full max-h-full">
            <img 
              src={property.images[currentImageIndex]} 
              alt={`${property.placename} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain max-h-[80vh] rounded-lg"
            />
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Header with navigation */}
      <div className="bg-white/80 backdrop-blur-md py-5 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-700 hover:text-indigo-900 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Properties
          </button>
          
          {property.location && (
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 text-sm px-4 py-2 rounded-full font-semibold shadow-sm">
              {property.location}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Property header */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900">{property.placename}</h1>
          <div className="flex flex-wrap items-center mt-3 gap-4">
            <p className="text-gray-700 flex items-center">
              <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {property.address}
            </p>
            
            <div className="flex items-center text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Available now
            </div>
          </div>
        </div>

        {/* Image gallery - Only 4 images */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Main image */}
            <div 
              className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden cursor-pointer h-80 relative group"
              onClick={() => openImageGallery(0)}
            >
              <img 
                src={property.images[0]} 
                alt={property.placename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <svg className="h-10 w-10 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Additional images - Only 3 more */}
            {property.images.slice(1, 4).map((image, index) => (
              <div 
                key={index+1}
                className="rounded-2xl overflow-hidden cursor-pointer h-40 relative group"
                onClick={() => openImageGallery(index+1)}
              >
                <img 
                  src={image} 
                  alt={`${property.placename} - Image ${index+2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Property details */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('amenities')}
                    className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'amenities' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Amenities
                  </button>
                  <button
                    onClick={() => setActiveTab('host')}
                    className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors ${activeTab === 'host' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    Host Info
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'details' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">About this property</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.room} room{property.room !== 1 ? 's' : ''}</p>
                          <p className="text-sm text-gray-600 mt-1">Spacious and comfortable rooms</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Up to {property.capacity || 4} guests</p>
                          <p className="text-sm text-gray-600 mt-1">Perfect for families and groups</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.bedrooms || 2} bedrooms</p>
                          <p className="text-sm text-gray-600 mt-1">Comfortable sleeping arrangements</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4 flex-shrink-0">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Flexible check-in</p>
                          <p className="text-sm text-gray-600 mt-1">After 3:00 PM</p>
                        </div>
                      </div>
                    </div>
                    
                    {property.PropertyDetails && (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                        <p className="text-gray-700 bg-blue-50 p-6 rounded-xl leading-relaxed">
                          {property.PropertyDetails}
                        </p>
                      </>
                    )}
                  </>
                )}
                
                {activeTab === 'amenities' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Wi-Fi</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Kitchen</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">TV</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Parking</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Air Conditioning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">Washer</span>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'host' && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hosted by {property.ownername}</h2>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.ownername}</p>
                          <p className="text-sm text-gray-600">Your host</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.contactno}</p>
                          <p className="text-sm text-gray-600">Contact number</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{property.email}</p>
                          <p className="text-sm text-gray-600">Email address</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2">About the host</h3>
                        <p className="text-gray-600">
                          Your host is committed to providing you with a comfortable and memorable stay. They are available to answer any questions you may have during your visit.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 sticky top-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{property.price}</span>
                <span className="text-gray-500">/mo </span>
              </div>
              
              <Link 
                to={`/booking/${propertyId}`}
                state={{ property }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg font-semibold text-center block mb-4"
              >
                Check Availability
              </Link>
              
              <div className="text-center text-sm text-gray-500 mb-6">
                You won't be charged yet
              </div>
              
              {/* Price breakdown section removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPages;