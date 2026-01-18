
import React, { useState, useEffect } from 'react';

const messages = [
  "Setting the table...",
  "Arranging the restaurant lighting...",
  "Applying the purple 'Alles is fixbaar' magic...",
  "Polishing the glasses...",
  "Positioning your logo perfectly...",
  "Finalizing the professional touch...",
];

const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-utensils text-purple-600 animate-pulse"></i>
        </div>
      </div>
      <p className="mt-6 text-xl font-medium text-slate-700 animate-fade-in text-center px-4">
        {messages[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-slate-500 italic">Preparing your professional visual</p>
    </div>
  );
};

export default LoadingOverlay;
