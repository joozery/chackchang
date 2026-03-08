import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShieldCheck,
    Award,
    TrendingUp,
    Phone,
    MessageSquare,
    Link2,
    Briefcase,
    Loader2,
    AlertCircle,
    ArrowLeft,
    MapPin,
    Calendar,
    CheckCircle2,
    MessageCircle,
    ChevronRight,
    User,
    Facebook,
    Share2,
    ThumbsUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import technicianService from '@/services/technicianService';

export function TechnicianDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [technician, setTechnician] = useState(null);
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTechnicianAndPortfolios = async () => {
            try {
                setLoading(true);
                setError(null);

                const techResponse = await technicianService.getById(id);
                if (techResponse.success) {
                    setTechnician(techResponse.data);
                } else {
                    setError('ไม่พบข้อมูลช่างที่ระบุ');
                    return;
                }

                try {
                    const portResponse = await technicianService.getPortfolioItems(id);
                    if (portResponse.success) {
                        setPortfolios(portResponse.data);
                    }
                } catch (portErr) {
                    console.error('Error fetching portfolios:', portErr);
                }

            } catch (err) {
                console.error('Error fetching technician details:', err);
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลช่าง');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTechnicianAndPortfolios();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">กำลังโหลดข้อมูลโปรไฟล์...</p>
            </div>
        );
    }

    if (error || !technician) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-gray-600 mb-6">{error || 'ไม่พบข้อมูลช่าง'}</p>
                    <Button
                        onClick={() => navigate('/good-workers')}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-6 rounded-xl"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> กลับไปหน้าค้นหาช่าง
                    </Button>
                </div>
            </div>
        );
    }

    const profileImageUrl = technician.profileImage?.startsWith('http')
        ? technician.profileImage
        : technician.profileImage
            ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}${technician.profileImage}`
            : null;

    return (
        <>
            <Helmet>
                <title>{technician.fullName} - ช่างโปรไฟล์ดี | ช่างรับงานดี</title>
                <meta name="description" content={`ดูโปรไฟล์และผลงานของ ${technician.fullName} ช่างที่มีประวัติการทำงานดี`} />
            </Helmet>

            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* Header/Banner Area */}
                <section className="relative pt-24 pb-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/good-workers')}
                            className="text-white/70 hover:text-white hover:bg-white/10 mb-8"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าค้นหา
                        </Button>
                    </div>
                </section>

                {/* Main Profile Info Card */}
                <div className="container mx-auto px-4 -mt-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Profile Card & Quick Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-3xl">
                                    <CardContent className="p-0">
                                        <div className="h-24 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                                        <div className="px-6 pb-8 -mt-12 text-center">
                                            <div className="relative inline-block">
                                                {profileImageUrl ? (
                                                    <img
                                                        src={profileImageUrl}
                                                        alt={technician.fullName}
                                                        className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                                                    />
                                                ) : (
                                                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                                                        {technician.fullName?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                {!!technician.isVerified && (
                                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                                                        <ShieldCheck className="h-5 w-5 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">
                                                {technician.fullName}
                                            </h1>

                                            <div className="flex items-center justify-center gap-1.5 mb-4">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span className="ml-1 font-bold text-gray-900">{(Number(technician.rating) || 0).toFixed(1)}</span>
                                                </div>
                                                <span className="text-gray-400 text-sm">•</span>
                                                <span className="text-gray-500 text-sm">{technician.totalReviews} รีวิว</span>
                                            </div>

                                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                                {technician.workTypes?.map((type, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100 px-3 py-1 rounded-full text-xs font-medium">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="space-y-3">
                                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl shadow-lg shadow-green-200 transition-all font-bold">
                                                    <MessageCircle className="mr-2 h-5 w-5" /> ติดต่อจ้างงาน
                                                </Button>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button variant="outline" className="rounded-xl border-gray-200 py-6 font-semibold">
                                                        <ThumbsUp className="mr-2 h-4 w-4" /> แนะนำ
                                                    </Button>
                                                    <Button variant="outline" className="rounded-xl border-gray-200 py-6 font-semibold">
                                                        <Share2 className="mr-2 h-4 w-4" /> แชร์
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-100 w-full" />

                                        <div className="p-6 space-y-4">
                                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">ข้อมูลการติดต่อ</h4>
                                            <div className="space-y-4">
                                                {technician.province && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500">
                                                            <MapPin className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">พื้นที่รับงาน</p>
                                                            <p className="text-sm font-semibold text-gray-900">{technician.province}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {technician.phone && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-green-600">
                                                            <Phone className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">เบอร์โทรศัพท์</p>
                                                            <p className="text-sm font-semibold text-gray-900">{technician.phone}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {technician.lineId && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-green-600">
                                                            <MessageSquare className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">LINE ID</p>
                                                            <p className="text-sm font-semibold text-gray-900">{technician.lineId}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {technician.facebookLink && (
                                                    <div className="flex items-center gap-4 text-gray-600">
                                                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                                                            <Facebook className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Facebook</p>
                                                            <a href={technician.facebookLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline">
                                                                เยี่ยมชมโปรไฟล์
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Verified Badge Detail */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-green-100"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck className="h-8 w-8" />
                                    <div>
                                        <h3 className="font-extrabold text-lg">ผ่านการยืนยันแล้ว</h3>
                                        <p className="text-white/80 text-xs">Verified Technician</p>
                                    </div>
                                </div>
                                <p className="text-sm text-white/90 leading-relaxed font-light mb-4">
                                    ช่างท่านนี้ได้ผ่านการยืนยันตัวตนด้วยบัตรประชาชนและการตรวจสอบเบื้องต้นจากทางระบบแล้ว มั่นใจได้ในการจ้างงาน
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 p-2 rounded-lg">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> ตรวจสอบประวัติอาชญากรรมเบื้องต้น
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 p-2 rounded-lg">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> ยืนยันตัวตนด้วยบัตรประชาชน
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Details, Projects, Reviews */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Stats Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                            >
                                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
                                                <Star className="h-6 w-6 fill-current" />
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 leading-none">{(Number(technician.rating) || 0).toFixed(1)}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">คะแนนรีวิว</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                                <Briefcase className="h-6 w-6" />
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 leading-none">{technician.totalJobs || 0}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">งานที่สำเร็จ</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden group hidden md:block">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <p className="text-2xl font-black text-gray-900 leading-none">100%</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">งานสมบูรณ์</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Tabs Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-3xl overflow-hidden">
                                    <Tabs defaultValue="about" className="w-full">
                                        <CardHeader className="bg-white pb-0 px-8 pt-6">
                                            <TabsList className="w-full justify-start gap-8 bg-transparent h-12 p-0 border-b rounded-none mb-0">
                                                <TabsTrigger
                                                    value="about"
                                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-wider text-gray-400 data-[state=active]:text-green-600"
                                                >
                                                    ข้อมูลช่าง
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="projects"
                                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-wider text-gray-400 data-[state=active]:text-green-600"
                                                >
                                                    ผลงาน
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="reviews"
                                                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-wider text-gray-400 data-[state=active]:text-green-600"
                                                >
                                                    รีวิว ({technician.totalReviews})
                                                </TabsTrigger>
                                            </TabsList>
                                        </CardHeader>

                                        <CardContent className="p-8">
                                            <TabsContent value="about" className="mt-0 space-y-8">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Award className="h-6 w-6 text-green-600" /> ข้อมูลเบื้องต้น
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                        {technician.bio || `สวัสดีครับ ผม ${technician.fullName} เป็นช่างผู้เชี่ยวชาญด้านงาน ${technician.workTypes?.join(', ')} ที่มีประสบการณ์การทำงานมากกว่า 5 ปี ครับ รับงานด้วยใจ ทำงานละเอียด และตรงต่อเวลา เพื่อความพึงพอใจสูงสุดของลูกค้าครับ`}
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Briefcase className="h-6 w-6 text-green-600" /> ประเภทงานที่รับผิดชอบ
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {technician.workTypes?.map((type, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-green-200 hover:bg-green-50/50 transition-all">
                                                                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold group-hover:scale-110 transition-transform">
                                                                    {idx + 1}
                                                                </div>
                                                                <span className="font-semibold text-gray-800">{type}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                    <div className="flex items-start gap-4">
                                                        <Calendar className="h-6 w-6 text-green-600 flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 mb-1">ระยะเวลาที่เริ่มรับงานในระบบ</h4>
                                                            <p className="text-sm text-gray-500">
                                                                เป็นสมาชิกตั้งแต่: {new Date(technician.createdAt).toLocaleDateString('th-TH', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="projects" className="mt-0">
                                                {portfolios.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {portfolios.map((item) => {
                                                            const imageUrl = item.image_url.startsWith('http')
                                                                ? item.image_url
                                                                : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5002'}${item.image_url}`;

                                                            return (
                                                                <div key={item.id} className="group overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white hover:shadow-xl transition-all duration-300">
                                                                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={item.title || 'ผลงาน'}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                        />
                                                                    </div>
                                                                    <div className="p-5">
                                                                        <h4 className="font-bold text-gray-900 mb-2 truncate">{item.title || 'ไม่มีชื่อผลงาน'}</h4>
                                                                        {item.description && (
                                                                            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                                                                {item.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                                        <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                        <h3 className="font-bold text-gray-900 mb-2">ยังไม่มีผลงานที่อัปโหลด</h3>
                                                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                                            ช่างยังไม่ได้ทำการอัปโหลดรูปภาพผลงานก่อนหน้านี้ลงในระบบ คุณสามารถสอบถามรูปผลงานเพิ่มเติมได้จากข้อมูลการติดต่อ
                                                        </p>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="reviews" className="mt-0">
                                                {technician.totalReviews > 0 ? (
                                                    <div className="space-y-6">
                                                        {/* Mock reviews as requested */}
                                                        {[1, 2, 3].map((i) => (
                                                            <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                                            <User className="h-6 w-6" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 text-sm">ลูกค้าทั่วไป #{i}</p>
                                                                            <div className="flex items-center text-yellow-500 mt-0.5">
                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                    <Star key={star} className={`h-3 w-3 ${star <= 5 ? 'fill-current' : ''}`} />
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-400 font-bold uppercase font-mono">2 สัปดาห์ที่แล้ว</span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                                                    "ช่างมาตรงเวลาตามนัด งานเรียบร้อยมากครับ ราคาเป็นกันเอง แนะนำเลยครับ"
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                                        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                        <h3 className="font-bold text-gray-900 mb-2">ยังไม่มีรีวิวจากผู้ใช้</h3>
                                                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                                            ช่างท่านนี้ยังไม่มีการรีวิวจากลูกค้าในระบบ คุณสามารถเป็นคนแรกได้เมื่อจ้างงานช่าง
                                                        </p>
                                                    </div>
                                                )}
                                            </TabsContent>
                                        </CardContent>
                                    </Tabs>
                                </Card>
                            </motion.div>

                            {/* Security Warning for Users */}
                            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl">
                                <div className="flex items-start gap-4">
                                    <div className="bg-yellow-100 p-2 rounded-xl text-yellow-700">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-bold text-yellow-900">ข้อควรระวังเพื่อความปลอดภัย</h4>
                                        <p className="text-sm text-yellow-800/80 leading-relaxed">
                                            ถึงแม้ช่างจะผ่านการยืนยันตัวตนแล้ว เรายังแนะนำให้คุณทำสัญญาว่าจ้างเป็นลายลักษณ์อักษร เก็บหลักฐานการแชทและการโอนเงิน และ **ไม่แนะนำให้โอนเงินมัดจำล่วงหน้า 100%** ก่อนวันเริ่มงาน
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

// Helper icons
function ImageIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
}
