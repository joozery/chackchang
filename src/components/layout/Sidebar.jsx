import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Users, Settings, Home, BarChart3, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assest/logo.jpg';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-gray-900 hover:bg-gray-100",
      { "bg-gray-900 text-white hover:bg-gray-800 hover:text-white": isActive }
    );

  const closeMobile = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex h-full max-h-screen flex-col">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 bg-gradient-to-r from-gray-50 to-white">
        <Link to="/dashboard" onClick={closeMobile} className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-900 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img 
              src={logo} 
              alt="รู้ทันช่าง" 
              className="h-10 w-10 object-contain rounded-xl shadow-md relative z-10 ring-2 ring-white"
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">รู้ทันช่าง</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
        {/* Mobile Close Button */}
        {setIsMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobile}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-3 text-sm font-medium gap-1">
          <NavLink to="/dashboard" end className={navLinkClass} onClick={closeMobile}>
            <LayoutDashboard className="h-4 w-4" />
            ภาพรวมระบบ
          </NavLink>
          <NavLink to="/dashboard/blacklist" className={navLinkClass} onClick={closeMobile}>
            <ListTodo className="h-4 w-4" />
            จัดการบัญชีดำ
          </NavLink>
          <NavLink to="/dashboard/users" className={navLinkClass} onClick={closeMobile}>
            <Users className="h-4 w-4" />
            จัดการผู้ใช้งาน
          </NavLink>
          <NavLink to="/dashboard/settings" className={navLinkClass} onClick={closeMobile}>
            <Settings className="h-4 w-4" />
            ตั้งค่าระบบ
          </NavLink>
          
          <div className="h-px bg-gray-200 my-2 mx-2"></div>
          
          <Link 
            to="/" 
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-gray-900 hover:bg-gray-100"
            onClick={closeMobile}
          >
            <Home className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BarChart3 className="h-4 w-4" />
          <span>ระบบจัดการหลังบ้าน v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobile}
          />
          
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;