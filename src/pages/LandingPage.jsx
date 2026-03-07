import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { AlertTriangle, ShieldCheck, ArrowRight, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assest/logo.jpg';

export function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const handleSelect = (path) => {
    navigate(path);
  };

  return (
    <>
      <Helmet>
        <title>ตรวจสอบช่าง - หน้าแรก</title>
        <meta name="description" content="เลือกบริการที่ต้องการ: ตรวจสอบบัญชีดำช่าง หรือ ค้นหาช่างรับงานดี" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto max-w-6xl relative z-10"
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center mb-6"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <img 
                  src={logo} 
                  alt="รู้ทันช่าง Logo" 
                  className="h-20 w-20 md:h-24 md:w-24 object-contain rounded-xl shadow-lg relative z-10 ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-300" 
                />
              </div>
            </motion.div>

            {/* Brand Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                รู้ทันช่าง
              </h1>
              <p className="text-sm md:text-base text-gray-400 mb-4">ระบบตรวจสอบช่างมืออาชีพ</p>
              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                เลือกบริการที่คุณต้องการ
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            {/* Card 1: ตรวจสอบบัญชีดำช่าง */}
            <motion.div
              variants={cardVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-red-500/30 p-8 h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-red-500/20 hover:border-red-500/50"
                onClick={() => handleSelect('/home')}
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full shadow-lg shadow-red-500/50">
                      <AlertTriangle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    ตรวจสอบบัญชีดำช่าง
                  </h2>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    ค้นหาและตรวจสอบรายชื่อช่างที่ถูกแจ้งเตือน เพื่อความปลอดภัยในการจ้างงาน
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                      <Search className="h-3 w-3 inline mr-1" />
                      ค้นหาช่าง
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                      <ShieldCheck className="h-3 w-3 inline mr-1" />
                      ตรวจสอบความปลอดภัย
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('/home');
                  }}
                >
                  เข้าสู่ระบบตรวจสอบ
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Card 2: ช่างรับงานดี */}
            <motion.div
              variants={cardVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-green-500/30 p-8 h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-green-500/20 hover:border-green-500/50"
                onClick={() => handleSelect('/good-workers')}
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-lg shadow-green-500/50">
                      <Star className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    ช่างรับงานดี
                  </h2>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    ค้นหาช่างที่มีประวัติการทำงานดี มีรีวิวและคะแนนสูง เพื่อความมั่นใจในการจ้างงาน
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                      <Star className="h-3 w-3 inline mr-1" />
                      ช่างคุณภาพ
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                      <ShieldCheck className="h-3 w-3 inline mr-1" />
                      ผ่านการตรวจสอบ
                    </span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect('/good-workers');
                  }}
                >
                  ค้นหาช่างดี
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-sm text-gray-400 mt-8"
          >
            <p>เลือกบริการที่ต้องการเพื่อเริ่มต้นใช้งาน</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

