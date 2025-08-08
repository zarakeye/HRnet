// components/DatabaseSpinner.tsx
import React from 'react';

const DatabaseSpinner = () => (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90"
    style={{ backdropFilter: 'blur(4px)' }}
  >
    <div className="flex flex-col items-center max-w-sm px-4 text-center">
      {/* Conteneur du spinner */}
      <div className="relative mb-6">
        {/* Cercle de fond */}
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        
        {/* Partie animée */}
        <div 
          className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full"
          style={{ 
            animation: 'spin 1s linear infinite',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent'
          }}
        ></div>
        
        {/* Icône de base de données */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg 
            className="w-8 h-8 text-blue-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" 
            />
          </svg>
        </div>
      </div>

      {/* Texte explicatif */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Initialisation de la base de données
      </h3>
      <p className="text-gray-600 mb-4">
        Nous réveillons votre instance de base de données. Cette opération peut prendre quelques secondes après une période d'inactivité.
      </p>
      
      {/* Barre de progression */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500"
          style={{ 
            width: '0%',
            animation: 'progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite' 
          }}
        ></div>
      </div>
    </div>
  </div>
);

export default DatabaseSpinner;