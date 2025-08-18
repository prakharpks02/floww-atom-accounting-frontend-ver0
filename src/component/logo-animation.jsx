import React from 'react';

const LoadingOverlay = ({ show }) => {
  if (!show) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div className="fixed inset-0 bg-[#ffffff]  backdrop-blur-sm z-[9998]" />

      {/* Image Container */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]">
        <img
          src="https://cdn.gofloww.co/websitegraphics/graphics/floww/new-preloader.gif"
          alt="Loading"
          className="w-full max-w-[200px] mx-auto"
        />
      </div>
    </>
  );
};

export const LogoAnimation = ({ isShow }) => {
  return (
    <div>
      <LoadingOverlay show={isShow} />
    </div>
  );
};
