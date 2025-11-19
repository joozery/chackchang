import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { LogIn, LayoutDashboard, User, LogOut, Menu, X, AlertTriangle } from 'lucide-react';
import logo from '@/assest/logo.jpg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navbarBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.95)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleReportClick = () => {
    if (user) {
      navigate('/report');
    } else {
      // Save the intended destination
      sessionStorage.setItem('redirectAfterLogin', '/report');
      navigate('/auth');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: navbarBg }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'shadow-2xl border-b border-gray-800/50' : 'border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group relative"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                <img 
                  src={logo} 
                  alt="รู้ทันช่าง Logo" 
                  className="h-14 w-14 object-contain rounded-xl shadow-lg relative z-10 ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-300" 
                />
              </motion.div>
              <div className="hidden sm:flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  รู้ทันช่าง
                </span>
                <span className="text-xs text-gray-400 -mt-1">ระบบตรวจสอบช่างมืออาชีพ</span>
              </div>
              <span className="sm:hidden text-xl font-bold text-white">รู้ทันช่าง</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleReportClick}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 px-5"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span className="font-semibold">แจ้งแบล็คลิสต์</span>
                    </Button>
                  </motion.div>

                  <div className="w-px h-6 bg-gray-700" />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/dashboard')}
                      className="text-white hover:bg-white/10 hover:text-blue-400 transition-all duration-300 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <LayoutDashboard className="mr-2 h-4 w-4 relative z-10" />
                      <span className="relative z-10">แดชบอร์ด</span>
                    </Button>
                  </motion.div>
                  
                  <div className="w-px h-6 bg-gray-700" />
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="ghost"
                      className="text-white hover:bg-white/10 transition-all duration-300 group"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span className="max-w-[100px] truncate">{user.email || 'ผู้ใช้งาน'}</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      ออกจากระบบ
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleReportClick}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 px-5"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span className="font-semibold">แจ้งแบล็คลิสต์</span>
                    </Button>
                  </motion.div>

                  <div className="w-px h-6 bg-gray-700" />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="bg-white hover:bg-gray-100 text-black border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      <span className="font-semibold">เข้าสู่ระบบ</span>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          y: isMobileMenuOpen ? 0 : -20,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="md:hidden fixed top-20 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-800 shadow-2xl"
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          {user ? (
            <>
              <Button 
                onClick={handleReportClick}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                แจ้งแบล็คลิสต์
              </Button>

              <div className="border-t border-gray-800 my-2" />

              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-blue-400 transition-all"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                แดชบอร์ด
              </Button>
              
              <div className="border-t border-gray-800 my-2" />
              
              <div className="px-4 py-2 text-sm text-gray-400">
                <User className="inline-block mr-2 h-4 w-4" />
                {user.email || 'ผู้ใช้งาน'}
              </div>
              
              <Button 
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                <LogOut className="mr-2 h-5 w-5" />
                ออกจากระบบ
              </Button>
            </>
              ) : (
                <>
                  <Button 
                    onClick={handleReportClick}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    แจ้งแบล็คลิสต์
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-white hover:bg-gray-100 text-black"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    เข้าสู่ระบบ
                  </Button>
                </>
              )}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;