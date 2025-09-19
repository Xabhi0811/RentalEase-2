// src/pages/LocationNotAvailable.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LocationNotAvailable = () => {
  const navigate = useNavigate();
  const availablePlaces = ["Gwalior "];

  const handleLocationClick = (place) => {
    // Navigate to home when a place is clicked
    navigate("/list");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:shadow-2xl">
        {/* Visual Element */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Location Not Available
        </h1>
        <p className="text-gray-600 mb-6">
          We're not currently serving your area yet, but we're expanding quickly!
        </p>
        
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            Currently serving these locations:
          </h2>
          <ul className="space-y-3">
            {availablePlaces.map((place, index) => (
              <li
                key={index}
                onClick={() => handleLocationClick(place)}
                className="bg-white border border-blue-200 rounded-xl py-3 px-4 text-blue-700 font-medium shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {place}
                <span className="text-xs text-gray-500 ml-2">( Soon we will come to our place )</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Check back soon as we're adding new locations regularly!
        </p>

        <Link 
          to='/' 
          className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default LocationNotAvailable;