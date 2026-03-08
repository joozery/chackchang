import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Award, TrendingUp, Search, UserPlus, ArrowRight, Phone, MessageSquare, Link2, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import technicianService from '@/services/technicianService';

export function GoodWorkersPage() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch technicians from API
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await technicianService.getAll({
          search: searchQuery,
          page: 1,
          limit: 50,
        });

        if (response.success) {
          setTechnicians(response.data || []);
        } else {
          setError('ไม่สามารถดึงข้อมูลช่างได้');
        }
      } catch (err) {
        console.error('Error fetching technicians:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลช่าง');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Helmet>
        <title>ช่างรับงานดี - ตรวจสอบช่าง</title>
        <meta name="description" content="ค้นหาช่างที่มีประวัติการทำงานดี มีรีวิวและคะแนนสูง" />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-grow">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative pt-28 pb-16 text-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg shadow-green-500/50">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
                  ช่างรับงานดี
                </h1>
                <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-300 mb-8 font-light">
                  ค้นหาช่างที่มีประวัติการทำงานดี มีรีวิวและคะแนนสูง เพื่อความมั่นใจในการจ้างงาน
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50"></div>

                  <div className="relative bg-white rounded-xl shadow-2xl p-1.5 flex items-center">
                    <div className="flex-shrink-0 pl-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="ค้นหาช่างด้วยชื่อ, ประเภทงาน, หรือพื้นที่..."
                      className="flex-1 border-0 bg-transparent text-base h-11 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-10 px-6 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl mr-1 transition-all duration-300"
                    >
                      ค้นหา
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Content Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              {loading ? (
                <div className="text-center py-20">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-green-500 animate-spin" />
                  <p className="text-gray-600">กำลังโหลดข้อมูลช่าง...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-gray-600">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                  >
                    ลองใหม่
                  </Button>
                </div>
              ) : technicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map((technician, index) => (
                    <motion.div
                      key={technician.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-2 border-green-500/30 bg-white hover:shadow-xl transition-all duration-300 hover:border-green-500/50 h-full flex flex-col">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            {/* Profile Image */}
                            <div className="relative flex-shrink-0">
                              {technician.profileImage && typeof technician.profileImage === 'string' && technician.profileImage.trim() ? (
                                <img
                                  src={technician.profileImage?.startsWith('http')
                                    ? technician.profileImage
                                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${technician.profileImage}`}
                                  alt={technician.fullName}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500/30"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-green-500/30">
                                  {technician.fullName?.charAt(0).toUpperCase() || technician.username?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {!!technician.isVerified && (
                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                  <ShieldCheck className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Name and Info */}
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-bold text-gray-900 mb-1 truncate">
                                {technician.fullName}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {technician.rating != null && !isNaN(technician.rating)
                                    ? (Number(technician.rating) || 0).toFixed(1)
                                    : '0.0'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({technician.totalReviews || 0} รีวิว)
                                </span>
                              </div>
                              {technician.totalJobs > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Briefcase className="h-3 w-3" />
                                  <span>งานที่ทำ: {technician.totalJobs}</span>
                                </div>
                              )}
                              {technician.province && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 font-medium">
                                  <MapPin className="h-3 w-3" />
                                  <span>{technician.province}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-grow flex flex-col">
                          {/* Work Types */}
                          {technician.workTypes && technician.workTypes.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {technician.workTypes.slice(0, 3).map((workType, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-300 text-xs"
                                  >
                                    {workType}
                                  </Badge>
                                ))}
                                {technician.workTypes.length > 3 && (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-300 text-xs">
                                    +{technician.workTypes.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Contact Info */}
                          <div className="space-y-2 mb-4 flex-grow">
                            {technician.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="truncate">{technician.phone}</span>
                              </div>
                            )}
                            {technician.lineId && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MessageSquare className="h-4 w-4 text-green-600" />
                                <span className="truncate">{technician.lineId}</span>
                              </div>
                            )}
                            {technician.facebookLink && (
                              <div className="flex items-center gap-2 text-sm">
                                <Link2 className="h-4 w-4 text-green-600" />
                                <a
                                  href={technician.facebookLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate"
                                >
                                  Facebook
                                </a>
                              </div>
                            )}
                          </div>

                          {/* View Profile Button */}
                          <Button
                            variant="outline"
                            className="w-full border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => {
                              navigate(`/good-workers/${technician.id}`);
                            }}
                          >
                            ดูโปรไฟล์
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-lg shadow-green-500/50">
                        <Award className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {searchQuery ? 'ไม่พบช่างที่ค้นหา' : 'ยังไม่มีช่างในระบบ'}
                  </h2>
                  <p className="text-gray-300 max-w-md mx-auto mb-6">
                    {searchQuery
                      ? 'ลองค้นหาด้วยคำอื่น หรือลบคำค้นหาเพื่อดูช่างทั้งหมด'
                      : 'เป็นช่างคนแรกที่สมัครสมาชิกในระบบช่างรับงานดี'
                    }
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
                      <Star className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">รีวิวและคะแนน</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">ผ่านการตรวจสอบ</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-gray-700">ประวัติการทำงานดี</span>
                    </div>
                  </div>

                  {/* Registration Section for Technicians */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-2xl mx-auto mt-8"
                  >
                    <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                      <CardHeader className="text-center pb-4">
                        <div className="inline-flex items-center justify-center mb-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg shadow-green-500/50">
                              <UserPlus className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                          คุณเป็นช่างหรือไม่?
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          สมัครสมาชิกเพื่อเพิ่มโปรไฟล์ของคุณในระบบ และรับงานจากลูกค้า
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white/80 rounded-lg p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Star className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">เพิ่มโปรไฟล์ช่าง</h4>
                              <p className="text-sm text-gray-600">สร้างโปรไฟล์ของคุณเพื่อให้ลูกค้าค้นหาและติดต่อได้</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">รับรีวิวและคะแนน</h4>
                              <p className="text-sm text-gray-600">สร้างความน่าเชื่อถือด้วยรีวิวจากลูกค้าจริง</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">เพิ่มโอกาสรับงาน</h4>
                              <p className="text-sm text-gray-600">แสดงในรายการช่างรับงานดีเพื่อเพิ่มโอกาสรับงาน</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate('/auth?register=technician')}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          สมัครสมาชิกเป็นช่าง
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                          หรือ{' '}
                          <button
                            onClick={() => navigate('/auth')}
                            className="text-green-600 hover:text-green-700 font-medium underline"
                          >
                            เข้าสู่ระบบ
                          </button>
                          {' '}ถ้ามีบัญชีอยู่แล้ว
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

