import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Frown, AlertTriangle, Calendar, User, Eye, Grid3x3, List, Hash, DollarSign, Clock, TrendingUp } from 'lucide-react';
import blacklistService from '@/services/blacklistService';

const initialBlacklist = [
  { 
    id: 1, 
    reportId: '497050',
    name: 'สมชาย ทิ้งงาน',
    idCard: '1234567890123',
    offense: 'รับเงินมัดจำแล้วหาย ไม่สามารถติดต่อได้', 
    workType: 'รับซ่อมบ้าน งานทาสี',
    reportedBy: 'สมหญิง ใจดี',
    bankAccount: '123-4-56789-0',
    bankName: 'ธนาคารกสิกรไทย',
    transferDate: '2025-10-15',
    date: '2025-10-28',
    postedDate: '2025-10-28 14:30',
    amount: 15000,
    reportCount: 1,
    totalAmount: 15000
  },
  { 
    id: 2, 
    reportId: '497051',
    name: 'ประวิทย์ ไม่มา',
    idCard: '2110201076xxx',
    offense: 'งานไม่เรียบร้อย ของไม่ตรงสเปคที่ตกลงกันไว้', 
    workType: 'งานติดตั้งแอร์',
    reportedBy: 'สมศักดิ์ แข็งแรง',
    bankAccount: '987-6-54321-0',
    bankName: 'ธนาคารกรุงเทพ',
    transferDate: '2025-10-10',
    date: '2025-10-20',
    postedDate: '2025-10-20 10:15',
    amount: 8500,
    reportCount: 2,
    totalAmount: 17000
  },
  { 
    id: 3, 
    reportId: '497052',
    name: 'มานะ โกงเงิน',
    idCard: '3567890123456',
    offense: 'เบิกเงินค่าของเกินจริง และไม่แสดงใบเสร็จ', 
    workType: 'งานไฟฟ้า ติดตั้งระบบไฟ',
    reportedBy: 'สมศรี มีสุข',
    bankAccount: '456-7-89012-3',
    bankName: 'ธนาคารไทยพาณิชย์',
    transferDate: '2025-09-01',
    date: '2025-09-15',
    postedDate: '2025-09-15 16:45',
    amount: 12000,
    reportCount: 3,
    totalAmount: 36000
  },
  { 
    id: 4, 
    reportId: '497053',
    name: 'ชาติชาย ใช้วัสดุปลอม',
    idCard: '4890123456789',
    offense: 'ใช้วัสดุราคาถูกกว่าที่ตกลงไว้ในสัญญา', 
    workType: 'งานปูกระเบื้อง',
    reportedBy: 'สมปอง อดทน',
    bankAccount: '789-0-12345-6',
    bankName: 'ธนาคารกรุงไทย',
    transferDate: '2025-08-25',
    date: '2025-09-10',
    postedDate: '2025-09-10 09:20',
    amount: 5500,
    reportCount: 1,
    totalAmount: 5500
  },
];

export function HomePage() {
  const [blacklist, setBlacklist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch blacklist data from API
  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        setLoading(true);
        const data = await blacklistService.getApproved();
        setBlacklist(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blacklist:', err);
        setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
        // Fallback to initial data if API fails
        setBlacklist(initialBlacklist);
      } finally {
        setLoading(false);
      }
    };

    fetchBlacklist();
  }, []);

  const filteredBlacklist = searchTerm
    ? blacklist.filter(
        (entry) =>
          entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.offense.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleViewDetails = (entry) => {
    navigate(`/detail/${entry.id}`);
  };

  return (
    <>
      <Helmet>
        <title>หน้าแรก - บัญชีดำช่าง</title>
        <meta name="description" content="ค้นหาและตรวจสอบรายชื่อช่างในบัญชีดำ เพื่อความปลอดภัยในการจ้างงาน" />
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
              <motion.h1 
                className="text-3xl md:text-5xl font-extrabold mb-4 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                ตรวจสอบบัญชีดำช่าง
              </motion.h1>
              <motion.p 
                className="max-w-2xl mx-auto text-base md:text-lg text-gray-300 mb-8 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                ค้นหาเพื่อความมั่นใจ ก่อนตัดสินใจจ้างงาน
              </motion.p>
              
              <motion.div 
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
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
                      placeholder="ค้นหาด้วยชื่อ หรือพฤติกรรม..."
                      className="flex-1 border-0 bg-transparent text-base h-11 px-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button 
                      className="bg-black hover:bg-gray-800 text-white h-10 px-6 rounded-lg text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-xl mr-1"
                      onClick={() => {
                        // ค้นหาเมื่อกดปุ่ม
                        if (searchTerm) {
                          document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      ค้นหา
                    </Button>
                  </div>
                </div>
                
                {/* Search suggestions */}
                <motion.div 
                  className="mt-6 flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <span className="text-gray-400 text-sm">ค้นหายอดนิยม:</span>
                  {['ทิ้งงาน', 'โกงเงิน', 'วัสดุปลอม', 'งานไม่เสร็จ'].map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(tag)}
                      className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      {tag}
                    </button>
                  ))}
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-0.5">{blacklist.length}</div>
                  <div className="text-gray-400 text-xs">รายงานทั้งหมด</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-0.5">
                    {blacklist.reduce((sum, item) => sum + (item.reportCount || 1), 0)}
                  </div>
                  <div className="text-gray-400 text-xs">ครั้งที่ถูกรายงาน</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-0.5">
                    {(blacklist.reduce((sum, item) => sum + (item.totalAmount || item.amount || 0), 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-gray-400 text-xs">ยอดเงินรวม (บาท)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-0.5">24/7</div>
                  <div className="text-gray-400 text-xs">ตรวจสอบได้ตลอด</div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Search Results or Preview Cards */}
          <section id="search-results" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <AnimatePresence mode="wait">
                {searchTerm ? (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">ผลการค้นหา</h2>
                    {filteredBlacklist.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="border rounded-lg shadow-sm"
                      >
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ชื่อ-นามสกุล</TableHead>
                              <TableHead>พฤติกรรม</TableHead>
                              <TableHead>ดูรายละเอียด</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredBlacklist.map((entry) => (
                              <motion.tr key={entry.id} variants={itemVariants} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{entry.name}</TableCell>
                                <TableCell>{entry.offense}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(entry)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-muted-foreground py-10"
                      >
                        <Frown className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview-cards"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                      <h2 className="text-3xl font-bold text-gray-900">รายชื่อล่าสุดในบัญชีดำ</h2>
                      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <Button
                          variant={viewMode === 'card' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('card')}
                          className="transition-all duration-200"
                        >
                          <Grid3x3 className="h-4 w-4 mr-2" />
                          การ์ด
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="transition-all duration-200"
                        >
                          <List className="h-4 w-4 mr-2" />
                          รายการ
                        </Button>
                      </div>
                    </div>

                    {viewMode === 'card' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {blacklist.slice(0, 4).map((entry) => (
                          <motion.div key={entry.id} variants={itemVariants}>
                            <Card className="bg-white border-2 hover:border-red-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                              <CardHeader className="pb-2 space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                  <span className="font-bold line-clamp-1">{entry.name}</span>
                                </CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                  {entry.offense}
                                </CardDescription>
                              </CardHeader>
                              
                              <CardContent className="flex-grow py-3 px-4">
                                <div className="space-y-2.5 text-xs">
                                  {/* Grid 2 columns */}
                                  <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                                    <div className="flex items-center gap-2">
                                      <Hash className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                      <div className="flex-grow min-w-0">
                                        <span className="text-gray-500 text-[10px] block">เลขรายงาน</span>
                                        <span className="font-semibold text-gray-900 truncate block">{entry.reportId || '-'}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-red-600 flex-shrink-0" />
                                      <div className="flex-grow min-w-0">
                                        <span className="text-gray-500 text-[10px] block">ยอดเงิน</span>
                                        <span className="font-bold text-red-600 truncate block">{(entry.amount || 0).toLocaleString()} บาท</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                      <div className="flex-grow min-w-0">
                                        <span className="text-gray-500 text-[10px] block">ชื่อช่าง</span>
                                        <span className="font-semibold text-gray-900 truncate block">{entry.name}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                      <div className="flex-grow min-w-0">
                                        <span className="text-gray-500 text-[10px] block">วันลงข้อมูล</span>
                                        <span className="font-semibold text-gray-900 truncate block">{entry.date}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* สถิติ */}
                                  <div className="pt-2 mt-1 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                                      <div className="flex-grow">
                                        <span className="text-gray-500 text-[10px] block">สถิติ</span>
                                        <div className="flex items-center gap-2 text-xs">
                                          <span className="font-semibold text-gray-900">พบ {entry.reportCount || 0} ครั้ง</span>
                                          <span className="text-gray-400">•</span>
                                          <span className="font-bold text-red-600">รวม {(entry.totalAmount || 0).toLocaleString()} บาท</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                              
                              <CardFooter className="pt-2 pb-4 px-4">
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    className="w-full text-xs h-9" 
                                    onClick={() => handleViewDetails(entry)}
                                  >
                                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                                      ดูรายละเอียด
                                  </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {blacklist.slice(0, 4).map((entry) => (
                          <motion.div key={entry.id} variants={itemVariants}>
                            <Card className="bg-white border-2 hover:border-red-400 hover:shadow-lg transition-all duration-300">
                              <div className="p-4">
                                <div className="flex flex-col lg:flex-row gap-4">
                                  {/* Main Info */}
                                  <div className="flex-grow space-y-3">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                      <div className="flex-grow min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{entry.name}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2">{entry.offense}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Detailed Info Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                      <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-gray-500 block text-[10px]">เลขรายงาน</span>
                                          <span className="font-semibold text-gray-900 text-xs truncate block">{entry.reportId || '-'}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-gray-500 block text-[10px]">ยอดเงิน</span>
                                          <span className="font-bold text-red-600 text-xs">{(entry.amount || 0).toLocaleString()} บาท</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-gray-500 block text-[10px]">วันลงข้อมูล</span>
                                          <span className="font-semibold text-gray-900 text-xs">{entry.date}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                          <span className="text-gray-500 block text-[10px]">สถิติ</span>
                                          <div className="text-xs">
                                            <span className="font-semibold text-gray-900">พบ {entry.reportCount || 0} ครั้ง</span>
                                            <span className="text-gray-400 mx-1">•</span>
                                            <span className="font-bold text-red-600">รวม {(entry.totalAmount || 0).toLocaleString()} บาท</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Action Button */}
                                  <div className="flex items-center lg:items-start">
                                    <Button 
                                      variant="secondary"
                                      size="sm"
                                      className="w-full lg:w-auto lg:min-w-[140px] text-xs h-9" 
                                      onClick={() => handleViewDetails(entry)}
                                    >
                                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                                      ดูรายละเอียด
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}