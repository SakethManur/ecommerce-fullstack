import React from 'react';

const SkeletonCard = () => {
  return (
    <div style={{ 
        border: '1px solid #eee', 
        padding: '15px', 
        borderRadius: '10px', 
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        background: 'white'
    }}>
      {/* Image Placeholder */}
      <div style={{ 
          width: '100%', 
          height: '200px', 
          background: '#e0e0e0', 
          borderRadius: '8px',
          animation: 'pulse 1.5s infinite' 
      }}></div>
      
      {/* Title Placeholder */}
      <div style={{ width: '80%', height: '20px', background: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      
      {/* Category Placeholder */}
      <div style={{ width: '40%', height: '15px', background: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      
      {/* Price Placeholder */}
      <div style={{ width: '30%', height: '25px', background: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
      
      {/* Button Placeholder */}
      <div style={{ marginTop: 'auto', width: '100%', height: '40px', background: '#e0e0e0', borderRadius: '5px', animation: 'pulse 1.5s infinite' }}></div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;