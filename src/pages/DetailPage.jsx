import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, AlertTriangle, ArrowLeft, Frown, Hash, DollarSign, Clock, TrendingUp, FileText, Image as ImageIcon, Shield, CreditCard, Briefcase } from 'lucide-react';
import blacklistService from '@/services/blacklistService';

const DetailPage = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const data = await blacklistService.getById(id);
        setEntry(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching entry:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
        setEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">กำลังโหลดข้อมูล...</div>;
  }

  if (!entry) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 h-full">
            <Frown className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">ไม่พบข้อมูล</h1>
            <p className="text-muted-foreground mb-6">ไม่พบข้อมูลของช่างที่คุณกำลังค้นหา</p>
            <Button asChild>
                <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าแรก
                </Link>
            </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>รายละเอียด: {entry.name} - รู้ทันช่าง</title>
        <meta name="description" content={`รายละเอียดและหลักฐานการแจ้งของ ${entry.name}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-6 lg:px-12"
        >
          <div className="w-full">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              asChild 
              className="mb-6 hover:bg-gray-100"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปหน้าแรก
              </Link>
            </Button>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header Card */}
                <Card className="border-2 border-gray-300 bg-white shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-3 bg-white rounded-full">
                          <AlertTriangle className="h-8 w-8 text-gray-900" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {entry.name}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs bg-white text-gray-900">
                              <Shield className="h-3 w-3 mr-1" />
                              รายงานแล้ว
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-white border border-gray-600">
                              #{entry.reportId || entry.id}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {/* พฤติกรรม */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-gray-900">
                        <FileText className="h-5 w-5 text-gray-900" />
                        <h3 className="font-bold text-lg text-gray-900">พฤติกรรมที่ถูกแจ้ง</h3>
                      </div>
                      <p className="text-gray-800 p-5 bg-gray-100 rounded-lg border-2 border-gray-300 leading-relaxed text-base">
                        {entry.offense}
                      </p>
                    </div>

                    {/* รายละเอียดเพิ่มเติม */}
                    <div className="border-t-2 border-gray-300 pt-6">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                        <FileText className="h-5 w-5 text-gray-900" />
                        <h3 className="font-bold text-lg text-gray-900">รายละเอียดเพิ่มเติม</h3>
                      </div>
                      <div className="bg-gray-100 p-5 rounded-lg border-2 border-gray-300">
                        <p className="text-gray-800 leading-relaxed mb-4">
                          ช่างรายนี้มีประวัติการทำงานที่ไม่น่าเชื่อถือ มีการรับงานแล้วไม่มาทำตามนัด 
                          หรือทำงานไม่เสร็จตามที่ตกลงไว้ ควรระมัดระวังในการจ้างงาน และตรวจสอบข้อมูลให้ดีก่อนตัดสินใจ
                        </p>
                        <p className="text-gray-700 text-sm">
                          <span className="font-bold text-gray-900">คำแนะนำ:</span> ควรมีสัญญาเป็นลายลักษณ์อักษร 
                          จ่ายเงินเป็นงวด และเก็บหลักฐานการทำงานไว้ทุกขั้นตอน
                        </p>
                      </div>
                    </div>

                    {/* ข้อมูลรายละเอียดครบถ้วน */}
                    <div className="border-t-2 border-gray-300 pt-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-4 pb-2 border-b-2 border-gray-900">ข้อมูลการรายงานครบถ้วน</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <User className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">ชื่อช่าง</p>
                            <p className="font-bold text-gray-900">{entry.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <CreditCard className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">เลขบัตรประชาชน</p>
                            <p className="font-bold text-gray-900">{entry.idCard || 'ไม่ระบุ'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <DollarSign className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">ยอดโอน</p>
                            <p className="font-bold text-gray-900 text-lg">{(entry.amount || 0).toLocaleString()} บาท</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <Briefcase className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">งานที่จ้าง</p>
                            <p className="font-bold text-gray-900">{entry.workType || 'ไม่ระบุ'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <CreditCard className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">เลขบัญชี</p>
                            <p className="font-bold text-gray-900 text-sm">{entry.bankAccount || 'ไม่ระบุ'}</p>
                            <p className="text-xs text-gray-600 mt-1">{entry.bankName || ''}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <User className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">ผู้แจ้ง/เพจ</p>
                            <p className="font-bold text-gray-900">{entry.reportedBy}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <Calendar className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">วันโอนเงิน</p>
                            <p className="font-bold text-gray-900">{entry.transferDate || entry.date}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <Clock className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">วันที่ลงประกาศ</p>
                            <p className="font-bold text-gray-900">{entry.postedDate || entry.date}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-gray-900">
                          <Hash className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="text-xs text-gray-600 mb-1 font-semibold uppercase">เลขรายงาน</p>
                            <p className="font-bold text-gray-900 text-lg">{entry.reportId || entry.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* หลักฐานภาพถ่าย */}
                    <div className="border-t-2 border-gray-300 pt-6">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-900">
                        <ImageIcon className="h-5 w-5 text-gray-900" />
                        <h3 className="font-bold text-lg text-gray-900">หลักฐานภาพถ่าย</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="หลักฐานการโอนเงิน" 
                            src="https://images.unsplash.com/photo-1694411986993-a3e41668a1fd" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">หลักฐานการโอนเงิน</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="สภาพงานที่ถูกทิ้ง" 
                            src="https://images.unsplash.com/photo-1649738991547-b46b723d6c8a" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">สภาพงานที่ถูกทิ้ง</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="การสนทนาทาง LINE" 
                            src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">การสนทนาทาง LINE</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="สัญญาจ้างงาน" 
                            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">สัญญาจ้างงาน</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="บัตรประชาชน/ใบอนุญาต" 
                            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">บัตรประชาชน/ใบอนุญาต</p>
                          </div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }} 
                          transition={{ duration: 0.2 }}
                          className="relative group"
                        >
                          <img 
                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-900 shadow-lg group-hover:shadow-2xl transition-shadow" 
                            alt="หลักฐานอื่นๆ" 
                            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4" 
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <p className="text-white font-bold text-center px-4">หลักฐานอื่นๆ</p>
                          </div>
                        </motion.div>
                      </div>
                      <p className="text-xs text-center mt-4 text-gray-600 bg-gray-100 p-3 rounded border border-gray-300">
                        * รูปภาพเป็นเพียงตัวอย่างเพื่อประกอบการออกแบบ - ในระบบจริงจะแสดงรูปภาพหลักฐานที่ผู้แจ้งอัพโหลด
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-6">
                {/* สถิติ */}
                <Card className="bg-white shadow-xl border-2 border-gray-900">
                  <CardHeader className="bg-gray-900 text-white border-b-2 border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                      <TrendingUp className="h-5 w-5" />
                      สถิติการรายงาน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center py-6 bg-gray-100 rounded-lg border-2 border-gray-900">
                      <p className="text-gray-700 text-sm mb-2 font-semibold uppercase">จำนวนครั้งที่ถูกรายงาน</p>
                      <p className="text-5xl font-bold text-gray-900">{entry.reportCount || 1}</p>
                      <p className="text-gray-600 text-sm mt-2 font-medium">ครั้ง</p>
                    </div>
                    
                    <div className="text-center py-6 bg-white rounded-lg border-2 border-gray-900">
                      <p className="text-gray-700 text-sm mb-2 font-semibold uppercase">ยอดเงินรวมทั้งหมด</p>
                      <p className="text-4xl font-bold text-gray-900">
                        {(entry.totalAmount || entry.amount || 0).toLocaleString()}
                      </p>
                      <p className="text-gray-600 text-sm mt-2 font-medium">บาท</p>
                    </div>
                  </CardContent>
                </Card>

                {/* คำเตือน */}
                <Card className="bg-white border-2 border-gray-900 shadow-xl">
                  <CardHeader className="bg-gray-900 text-white border-b-2 border-gray-700">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                      <Shield className="h-5 w-5" />
                      คำเตือนสำคัญ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4 text-sm text-gray-800">
                    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                      <p className="flex items-start gap-3 mb-3">
                        <span className="text-gray-900 font-bold text-lg mt-0.5">•</span>
                        <span className="leading-relaxed">ตรวจสอบข้อมูลให้ละเอียดก่อนตัดสินใจจ้างงาน</span>
                      </p>
                      <p className="flex items-start gap-3 mb-3">
                        <span className="text-gray-900 font-bold text-lg mt-0.5">•</span>
                        <span className="leading-relaxed">ขอดูหลักฐานและใบอนุญาตประกอบวิชาชีพ</span>
                      </p>
                      <p className="flex items-start gap-3 mb-3">
                        <span className="text-gray-900 font-bold text-lg mt-0.5">•</span>
                        <span className="leading-relaxed">ทำสัญญาเป็นลายลักษณ์อักษร</span>
                      </p>
                      <p className="flex items-start gap-3 mb-3">
                        <span className="text-gray-900 font-bold text-lg mt-0.5">•</span>
                        <span className="leading-relaxed">อย่าจ่ายเงินล่วงหน้าทั้งหมด</span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="text-gray-900 font-bold text-lg mt-0.5">•</span>
                        <span className="leading-relaxed">เก็บหลักฐานการทำงานไว้ทุกขั้นตอน</span>
                      </p>
                    </div>
                    <div className="bg-gray-900 text-white p-4 rounded-lg text-center">
                      <p className="font-bold text-sm">
                        ⚠️ ระมัดระวัง! มิจฉาชีพอาจใช้ช่องทางนี้หลอกลวง
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* ข้อมูลติดต่อ */}
                <Card className="bg-white border-2 border-gray-900 shadow-xl">
                  <CardHeader className="bg-gray-100 border-b-2 border-gray-900">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <FileText className="h-5 w-5" />
                      ข้อมูลเพิ่มเติม
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">สถานะ:</span>
                      <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">ตรวจสอบแล้ว</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">ความรุนแรง:</span>
                      <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">สูง</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">อัพเดทล่าสุด:</span>
                      <span className="font-bold text-gray-900">{entry.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DetailPage;