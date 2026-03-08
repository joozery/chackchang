import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Frown,
  Hash,
  DollarSign,
  Clock,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Shield,
  CreditCard,
  Briefcase,
  AlertCircle,
  ChevronRight,
  ShieldAlert,
  Info,
  ExternalLink,
  MapPin,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import blacklistService from '@/services/blacklistService';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const data = await blacklistService.getById(id);
        if (data) {
          setEntry(data);
          setError(null);
        } else {
          setError('ไม่พบข้อมูลรายการที่ระบุ');
        }
      } catch (err) {
        console.error('Error fetching entry:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium tracking-wide">กำลังโหลดข้อมูลแบล็คลิสต์...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-200 text-center max-w-md border border-gray-100"
        >
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Frown className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">{error || 'ไม่พบข้อมูลของช่างที่คุณกำลังค้นหาในระบบบัญชีดำ'}</p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-2xl shadow-xl transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> กลับสู่หน้าหลัก
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>รายงานแบล็คลิสต์: {entry.name} - รู้ทันช่าง</title>
        <meta name="description" content={`รายละเอียดและหลักฐานการแจ้งของ ${entry.name} ในระบบบัญชีดำช่าง`} />
      </Helmet>

      <div className="min-h-screen bg-[#FDFDFD] pb-24">
        {/* Banner Section */}
        <section className="relative pt-28 pb-40 bg-gradient-to-br from-red-900 via-gray-900 to-black overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gray-500/5 rounded-full blur-[100px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white/60 hover:text-white hover:bg-white/10 mb-8 rounded-xl transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าค้นหา
              </Button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Blacklisted
                    </Badge>
                    <span className="text-white/40 text-sm font-mono tracking-tighter">ID: {entry.reportId || entry.id}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                    {entry.name}
                  </h1>
                  <p className="text-white/60 text-lg font-light max-w-xl">
                    ข้อมูลนี้ถูกแจ้งเข้าระบบเนื่องจากพฤติกรรมที่ไม่เหมาะสม โปรดระมัดระวังในการจ้างงาน
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:block h-16 w-px bg-white/10 mx-4"></div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                    <p className="text-white/40 text-[10px] font-bold uppercase mb-1 tracking-widest">ยอดเงินที่เกี่ยวข้อง</p>
                    <p className="text-3xl font-black text-red-500">{(entry.amount || 0).toLocaleString()} <span className="text-lg text-white/80">บาท</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Details & Evidence */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[35px] overflow-hidden">
                  <Tabs defaultValue="offense" className="w-full">
                    <div className="px-8 pt-8 bg-white">
                      <TabsList className="w-full justify-start gap-8 bg-transparent h-12 p-0 border-b rounded-none">
                        <TabsTrigger
                          value="offense"
                          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-widest text-gray-400 data-[state=active]:text-red-600"
                        >
                          พฤติกรรมที่แจ้ง
                        </TabsTrigger>
                        <TabsTrigger
                          value="details"
                          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-widest text-gray-400 data-[state=active]:text-red-600"
                        >
                          ข้อมูลส่วนตัว
                        </TabsTrigger>
                        <TabsTrigger
                          value="evidence"
                          className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-widest text-gray-400 data-[state=active]:text-red-600"
                        >
                          หลักฐาน ({6})
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <CardContent className="p-8 pb-10">
                      {/* Offense Tab */}
                      <TabsContent value="offense" className="mt-0 pt-2">
                        <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100/50 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="h-40 w-40 text-red-900" />
                          </div>
                          <div className="relative z-10">
                            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                              <AlertCircle className="h-6 w-6" /> พฤติกรรมที่ถูกแจ้ง
                            </h3>
                            <p className="text-red-800/80 text-lg leading-relaxed font-medium">
                              "{entry.offense}"
                            </p>
                            <div className="h-px bg-red-200/50 w-full my-6" />
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 text-red-700/60 text-sm">
                                <Clock className="h-4 w-4" />
                                วันที่แจ้ง: {entry.date}
                              </div>
                              <div className="flex items-center gap-2 text-red-700/60 text-sm">
                                <TrendingUp className="h-4 w-4" />
                                ความรุนแรง: สูง
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 px-2">
                            <Info className="h-6 w-6 text-gray-400" /> สรุปรายละเอียด
                          </h3>
                          <div className="space-y-4">
                            <p className="text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100/50 leading-relaxed italic">
                              {entry.description || `ผู้เสียหายได้แจ้งว่าช่างรายนี้ ${entry.offense} ซึ่งส่งผลกระทบต่อทรัพย์สินและแผนงานของผู้ที่เกี่ยวข้อง ข้อมูลนี้ได้รับการรวบรวมเพื่อเตือนภัยแก่ผู้จ้างงานรายอื่นๆ ในอนาคต`}
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Details Tab */}
                      <TabsContent value="details" className="mt-0 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: 'ชื่อ-นามสกุล', value: entry.name, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'เลขบัตรประชาชน', value: entry.idCard || 'ไม่ระบุ', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { label: 'ยอดเงินเสียหาย', value: `${(entry.amount || 0).toLocaleString()} บาท`, icon: DollarSign, color: 'text-red-600', bg: 'bg-red-50' },
                            { label: 'งานที่จ้าง', value: entry.workType || 'ไม่ระบุ', icon: Briefcase, color: 'text-gray-600', bg: 'bg-gray-50' },
                            { label: 'เลขบัญชี', value: entry.bankAccount || 'ไม่ระบุ', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: entry.bankName },
                            { label: 'ผู้แจ้งข่าว', value: entry.reportedBy, icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { label: 'วันโอนเงิน', value: entry.transferDate || entry.date, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'วันที่ตกลง/เริ่มงาน', value: entry.postedDate || 'ไม่ระบุ', icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' },
                            { label: 'เลขรายงาน', value: entry.reportId || entry.id, icon: Hash, color: 'text-gray-900', bg: 'bg-gray-100' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all group">
                              <div className={`h-12 w-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <item.icon className="h-6 w-6" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                                <p className="text-base font-bold text-gray-900 truncate">{item.value}</p>
                                {item.sub && <p className="text-[10px] text-gray-500 font-medium">{item.sub}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Evidence Tab */}
                      <TabsContent value="evidence" className="mt-0 pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { title: 'หลักฐานการโอนเงิน', img: 'https://images.unsplash.com/photo-1694411986993-a3e41668a1fd' },
                            { title: 'สภาพงานที่ถูกทิ้ง', img: 'https://images.unsplash.com/photo-1649738991547-b46b723d6c8a' },
                            { title: 'การสนทนาทาง LINE', img: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb' },
                            { title: 'สัญญาจ้างงาน', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85' },
                            { title: 'บัตรประชาชน/ใบอนุญาต', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c' },
                            { title: 'หลักฐานอื่นๆ', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4' },
                          ].map((e, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.02, y: -5 }}
                              className="relative' group cursor-pointer overflow-hidden rounded-3xl"
                            >
                              <img
                                src={e.img}
                                alt={e.title}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-[10px] font-bold tracking-wide">{e.title}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                          <p className="text-xs text-gray-400 font-medium italic">
                            * รูปภาพหลักฐานตัวอย่างเพื่อประกอบการออกแบบ ในสถานะจริงจะเป็นรูปที่ผู้เสียหายอัปโหลด
                          </p>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </motion.div>
            </div>

            {/* Right Column: Alerts & Statistics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[35px] overflow-hidden">
                  <CardHeader className="bg-gray-900 border-none p-8 pb-4">
                    <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-red-500" /> สถิติรายงาน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-900 p-8 pt-4 space-y-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center">
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">ความถี่ที่ถูกแจ้ง</p>
                      <p className="text-6xl font-black text-white">{entry.reportCount || 1}</p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">รายงานทั้งหมด</p>
                    </div>

                    <div className="bg-red-500/10 rounded-3xl p-6 border border-red-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">สถานะเคส</span>
                        <Badge className="bg-red-500 text-white border-none py-0.5 px-3">อันตราย</Badge>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed font-light">
                        ช่างรายนี้มีประวัติการทุจริตที่ได้รับการยืนยัน โปรดใช้ความระมัดระวังสูงสุด
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Warning Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[35px] overflow-hidden">
                  <CardContent className="p-8 space-y-6">
                    <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">ข้อแนะนำความปลอดภัย</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        เพื่อป้องกันความกังวลใจในการจ้างงาน เราขอเสนอขั้นตอนการป้องกันดังนี้:
                      </p>
                    </div>

                    <ul className="space-y-4">
                      {[
                        'ทำสัญญาเป็นลายลักษณ์อักษรทุกครั้ง',
                        'แบ่งจ่ายเงินเป็นงวดตามเนื้องานที่สำเร็จ',
                        'ขอสำเนาบัตรประชาชนตัวจริงเพื่อยืนยัน',
                        'เก็บข้อมูลการสนทนาไว้เป็นหลักฐาน',
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-700 font-medium">
                          <CheckIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-2xl py-6 font-bold shadow-lg shadow-orange-100">
                      อ่านคู่มือจ้างช่างปลอดภัย
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Verified Verification Label */}
              <div className="bg-gray-100/50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between group cursor-help">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm text-green-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Status</p>
                    <p className="text-sm font-bold text-gray-900">ผ่านการตรวจสอบเคส</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Simple check icon
function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default DetailPage;