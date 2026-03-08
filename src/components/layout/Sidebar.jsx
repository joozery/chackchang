import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  Home,
  BarChart3,
  X,
  Menu,
  Shield,
  Star,
  ShieldAlert,
  ShieldCheck,
  Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinkClass = ({ isActive }) =>
  cn(
    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-gray-500 transition-all duration-300 hover:text-gray-900 hover:bg-gray-100/80 group",
    { "bg-gray-900 text-white shadow-md shadow-gray-200 hover:bg-gray-800 hover:text-white": isActive }
  );

const SidebarContent = ({ closeMobile }) => (
  <div className="flex h-full max-h-screen flex-col bg-white">
    {/* Brand Logo */}
    <div className="flex h-20 items-center px-6 border-b border-gray-50">
      <Link to="/dashboard" className="flex items-center gap-3" onClick={closeMobile}>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#FF8C61] flex items-center justify-center text-white shadow-lg shadow-orange-100">
          <Shield className="h-6 w-6" fill="currentColor" fillOpacity={0.2} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">CheckChang</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Admin Panel</span>
        </div>
      </Link>
    </div>

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-none">

      {/* Main Menu Section */}
      <div className="space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">เมนูหลัก</p>
        <NavLink to="/dashboard/overview" className={navLinkClass} onClick={closeMobile}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-sm font-semibold">แผงควบคุม</span>
        </NavLink>
        <NavLink to="/dashboard/blacklist" className={navLinkClass} onClick={closeMobile}>
          <ShieldAlert className="h-5 w-5" />
          <span className="text-sm font-semibold">จัดการบัญชีดำ</span>
        </NavLink>
        <NavLink to="/dashboard/good-technicians" className={navLinkClass} onClick={closeMobile}>
          <Star className="h-5 w-5" />
          <span className="text-sm font-semibold">ช่างรับงานดี</span>
        </NavLink>
      </div>

      {/* Management Section */}
      <div className="space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">การจัดการ</p>
        <NavLink to="/dashboard/users" className={navLinkClass} onClick={closeMobile}>
          <Users className="h-5 w-5" />
          <span className="text-sm font-semibold">สมาชิกในระบบ</span>
        </NavLink>
        <NavLink to="/dashboard/admins" className={navLinkClass} onClick={closeMobile}>
          <ShieldCheck className="h-5 w-5" />
          <span className="text-sm font-semibold">จัดการแอดมิน</span>
        </NavLink>
        <NavLink to="/dashboard/reports" className={navLinkClass} onClick={closeMobile}>
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm font-semibold">สถิติรายงาน</span>
        </NavLink>
      </div>

      {/* System Section */}
      <div className="space-y-1">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">ระบบ</p>
        <NavLink to="/dashboard/settings" className={navLinkClass} onClick={closeMobile}>
          <Settings className="h-5 w-5" />
          <span className="text-sm font-semibold">ตั้งค่าระบบ</span>
        </NavLink>
        <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-gray-500 hover:text-gray-900 transition-all hover:bg-gray-50">
          <Home className="h-5 w-5" />
          <span className="text-sm font-semibold">กลับหน้าหลัก</span>
        </Link>
      </div>
    </div>

    {/* Sidebar Footer - System Status */}
    <div className="p-4 border-t border-gray-50">
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">สถานะเซิร์ฟเวอร์</span>
        </div>
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          เวอร์ชัน 2.4.0-stable<br />เชื่อมต่อฐานข้อมูลปกติ
        </p>
      </div>
    </div>
  </div>
);

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const closeMobile = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r border-gray-100 bg-white">
        <SidebarContent closeMobile={closeMobile} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent closeMobile={closeMobile} />
      </aside>
    </>
  );
};

export default Sidebar;