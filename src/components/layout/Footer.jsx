import React from 'react';
import logo from '@/assest/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto py-8 px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
          <img 
            src={logo} 
            alt="รู้ทันช่าง Logo" 
            className="h-10 w-10 object-contain rounded-lg shadow-lg ring-2 ring-white/10" 
          />
          <span className="font-bold text-xl bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            รู้ทันช่าง
          </span>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} รู้ทันช่าง - ระบบตรวจสอบช่างมืออาชีพ. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;