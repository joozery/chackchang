import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/hooks/use-auth';
import { LogOut, UserCircle, Settings, Home, Bell, Menu, Search, Globe, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 backdrop-blur-md px-6 sm:px-8 border-b border-gray-100">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-xl hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Global Search Bar */}
      <div className="hidden lg:flex items-center gap-6 flex-1 max-w-lg">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
          <Input
            placeholder="ค้นหารายงาน, ชื่อสมาชิก หรือการตั้งค่า..."
            className="pl-11 pr-4 bg-gray-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-[#FF6B35]/20 focus-visible:bg-white transition-all w-full text-xs font-medium h-10"
          />
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-900 transition-colors">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-900 transition-colors relative">
            <Mail className="h-4 w-4" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#FF6B35]"></span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-900 transition-colors relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 p-0 flex items-center justify-center bg-gray-900 text-white text-[9px] border border-white">
              5
            </Badge>
          </Button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-100 mx-2 hidden sm:block"></div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 h-10">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                {(user?.username || 'A')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{user?.username || 'แอดมิน'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1">{user?.role === 'admin' ? 'ผู้ดูแลระบบสูงสุด' : 'เจ้าหน้าที่'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border-gray-100 shadow-2xl">
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-bold leading-none">{user?.username || 'แอดมิน'}</p>
                <p className="text-[10px] text-gray-500">{user?.email || 'admin@checkchang.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-50" />
            <div className="p-1">
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                <Link to="/dashboard" className="flex items-center">
                  <UserCircle className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-[11px]">ข้อมูลส่วนตัว</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                <Link to="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-[11px]">ตั้งค่าระบบ</span>
                </Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-gray-50" />
            <div className="p-1">
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold text-[11px]">ออกจากระบบ</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;