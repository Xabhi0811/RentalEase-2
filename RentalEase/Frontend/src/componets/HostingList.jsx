import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HostingList = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Array of random placeholder images
  const randomImages = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwa90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1628592102751-ba83b0314276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  // Function to get random images from the array
  const getRandomImages = () => {
    const shuffled = [...randomImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get token from wherever you store it (localStorage, context, etc.)
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/hosting/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Verify the response structure
      if (response.data && Array.isArray(response.data)) {
        // Enhance properties with sample images if needed
        const enhancedProperties = response.data.map(property => {
          // If property has no images, add random images
          if (!property.images || property.images.length === 0) {
            return {
              ...property,
              images: getRandomImages()
            };
          }
          
          // Ensure we have at least 4 images for display
          if (property.images.length < 4) {
            const additionalImagesNeeded = 4 - property.images.length;
            const additionalImages = getRandomImages().slice(0, additionalImagesNeeded);
            return {
              ...property,
              images: [...property.images, ...additionalImages]
            };
          }
          
          return property;
        });
        
        setProperties(enhancedProperties);
        console.log('Properties data received:', enhancedProperties);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      
      // More specific error messages
      if (err.response) {
        if (err.response.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response.status === 403) {
          setError('You do not have permission to view these properties.');
        } else if (err.response.status === 404) {
          setError('Properties endpoint not found.');
        } else {
          setError(`Server error: ${err.response.status}. Please try again later.`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to load properties. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/section/${propertyId}`);
  };

  const openImageGallery = (property, index = 0) => {
    setExpandedProperty(property);
    setCurrentImageIndex(index);
  };

  const closeImageGallery = () => {
    setExpandedProperty(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === expandedProperty.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? expandedProperty.images.length - 1 : prev - 1
    );
  };

  // Helper function to check if property has required fields
  const isValidProperty = (property) => {
    return property && property._id && property.placename;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"></path>
          </svg>
          <p className="mt-4 text-lg text-blue-800">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-md max-w-md">
          <div className="bg-blue-50 p-4 rounded-lg">
            <svg className="h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-blue-800 mt-3">{error}</p>
            <button 
              onClick={fetchProperties}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {expandedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeImageGallery}
            className="absolute top-4 right-4 text-white text-3xl z-50 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            &times;
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 text-white text-2xl z-50 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            &#8249;
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 text-white text-2xl z-50 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
          >
            &#8250;
          </button>
          
          <div className="max-w-4xl w-full max-h-full">
            <img 
              src={expandedProperty.images[currentImageIndex]} 
              alt={`${expandedProperty.placename} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain max-h-[80vh]"
            />
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {expandedProperty.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-blue-900">Hosted Properties</h1>
          <p className="mt-2 text-sm text-blue-600">Browse all available properties with photo galleries</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="mx-auto h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-blue-900">No properties found</h3>
            <p className="mt-1 text-sm text-blue-600">Get started by hosting a new property.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              isValidProperty(property) ? (
                <div 
                  key={property._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-100"
                >
                  {/* Image Gallery Section - Fixed to prevent overflow */}
                  <div className="h-60 overflow-hidden relative">
                    <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                      {property.images.slice(0, 4).map((image, index) => (
                        <div 
                          key={index} 
                          className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''} cursor-pointer overflow-hidden`}
                          onClick={() => openImageGallery(property, index)}
                        >
                          <img 
                            src={image} 
                            alt={`${property.placename} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                            }}
                          />
                          {index === 3 && property.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                +{property.images.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {property.location && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {property.location}
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 flex space-x-1">
                      {property.images.slice(0, 4).map((_, index) => (
                        <div 
                          key={index} 
                          className="w-2 h-2 rounded-full bg-white bg-opacity-80"
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                        {property.room || 'N/A'} room{property.room !== 1 ? 's' : ''}
                      </span>
                      <span className="text-blue-600 font-bold text-lg">
                        ₹{property.price || '0'}<span className="text-gray-500 text-sm">/mo</span>
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-blue-900 mb-2">{property.placename || 'Unnamed Property'}</h4>
                    
                    <div className="mb-4">
                      <span className="text-gray-600 text-sm">Hosted by </span>
                      <span className="text-blue-800 font-medium">{property.ownername || 'Unknown Owner'}</span>
                    </div>
                    
                    <div className="space-y-2 border-t border-blue-50 pt-4">
                      {property.address && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700 text-sm truncate">{property.address}</span>
                        </div>
                      )}
                      
                      {property.contactno && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700 text-sm">{property.contactno}</span>
                        </div>
                      )}
                      
                      {property.email && (
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 text-sm truncate">{property.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handlePropertyClick(property._id)}
                      className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details & Book
                    </button>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostingList;