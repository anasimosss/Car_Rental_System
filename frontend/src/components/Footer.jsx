import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#14213D] text-white py-6 mt-12 border-t border-[#E5E5E5]">
      <div className="container mx-auto px-4 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} CarRental. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;