import React from 'react';
import './ARLoader.css';

export default function ARLoader() {
  return (
    <>
      <div className="ar-loader-blur" />
      <div className="ar-loader-container">
        <div className="ar-loader-content">
          <div className="ar-loader-spinner-container">
            <div className="ar-loader-spinner" />
          </div>
          <div className="ar-loader-text-container">
            <h3 className="ar-loader-title">Generating AR Assets</h3>
            <p className="ar-loader-subtitle">This may take a couple of minutes</p>
          </div>
          <div className="ar-loader-progress-container">
            <div className="ar-loader-progress-bar" />
          </div>
        </div>
      </div>
    </>
  );
} 