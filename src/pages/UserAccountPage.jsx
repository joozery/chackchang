import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Phone,
  MessageCircle,
  Link2,
  Briefcase,
  TrendingUp,
  Verified,
  Facebook,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  ThumbsUp,
  MapPin,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Award,
  Trash2,
  Upload,
  Plus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import authService from '@/services/authService';
import technicianService from '@/services/technicianService';

const UserAccountPage = () => {
  const { user, logout, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [technicianData, setTechnicianData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const profileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    lineId: '',
    facebookLink: '',
    workTypes: [],
    bio: '',
    province: ''
  });

  const [portfolios, setPortfolios] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', description: '', image: null });
  const fileInputRef = React.useRef(null);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      if (data && data.user) {
        const u = data.user;
        const t = data.technician;
        setUserData(u);
        setTechnicianData(t);
        setFormData({
          username: u.username || '',
          email: u.email || '',
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          phone: u.phone || '',
          lineId: u.lineId || '',
          facebookLink: u.facebookLink || '',
          workTypes: t?.workTypes || [],
          bio: t?.bio || '',
          province: t?.province || ''
        });

        if (u.role === 'technician') {
          try {
            const portResponse = await technicianService.getPortfolioItems(u.id);
            if (portResponse.success) {
              setPortfolios(portResponse.data);
            }
          } catch (e) {
            console.error('Fetch portfolio error:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "ผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      navigate('/auth');
    }
  }, [user, fetchUserData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await authService.updateProfile(formData);

      if (response.success) {
        toast({
          title: "✅ บันทึกข้อมูลสำเร็จ",
          description: "ข้อมูลของคุณได้รับการอัปเดตแล้ว",
        });
        setIsEditing(false);
        setProfileImagePreview(null);
        fetchUserData();
        // Update auth context if needed
        if (updateUserInfo && response.data?.user) updateUserInfo(response.data.user);
      } else {
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: response.message || "ไม่สามารถอัปเดตข้อมูลได้",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData(prev => ({ ...prev, image: file }));
    }
  };

  const handleAddPortfolio = async () => {
    if (!uploadData.image) {
      toast({
        title: "กรุณาเลือกรูปภาพ",
        description: "ต้องมีรูปภาพสำหรับผลงาน",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('image', uploadData.image);
      fd.append('title', uploadData.title);
      fd.append('description', uploadData.description);

      const response = await technicianService.addPortfolioItem(fd);
      if (response.success) {
        toast({ title: "✅ เพิ่มผลงานสำเร็จ", description: "ผลงานของคุณได้ถูกแสดงในโปรไฟล์แล้ว" });
        setUploadData({ title: '', description: '', image: null });
        fetchUserData(); // To refresh portfolios
      } else {
        toast({ title: "❌ เกิดข้อผิดพลาด", description: response.message, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "❌ เกิดข้อผิดพลาด", description: "ไม่สามารถเพิ่มผลงานได้", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!confirm('คุณต้องการลบผลงานนี้ใช่หรือไม่?')) return;
    try {
      const response = await technicianService.deletePortfolioItem(id);
      if (response.success) {
        toast({ title: "✅ ลบผลงานสำเร็จ", description: "ผลงานได้ถูกลบออกจากระบบแล้ว" });
        setPortfolios(prev => prev.filter(p => p.id !== id));
      } else {
        toast({ title: "❌ เกิดข้อผิดพลาด", description: response.message, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "❌ เกิดข้อผิดพลาด", description: "ไม่สามารถลบผลงานได้", variant: "destructive" });
    }
  };

  const isTechnician = userData?.role === 'technician';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium tracking-wide">กำลังโหลดข้อมูลบัญชี...</p>
      </div>
    );
  }

  const profileImageUrl = profileImagePreview || (userData?.profileImage?.startsWith('http')
    ? userData.profileImage
    : userData?.profileImage
      ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5002'}${userData.profileImage}`
      : null);

  return (
    <>
      <Helmet>
        <title>บัญชีของฉัน - รู้ทันช่าง</title>
        <meta name="description" content="จัดการข้อมูลบัญชีและดูประวัติของคุณ" />
      </Helmet>

      <div className="min-h-screen bg-gray-50/50 pb-20">
        {/* Header/Banner Section */}
        <section className={`relative pt-28 pb-24 bg-gradient-to-br ${isTechnician ? 'from-green-900 via-gray-800 to-black' : 'from-blue-900 via-gray-800 to-black'} overflow-hidden`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isTechnician ? 'bg-green-500/10' : 'bg-blue-500/10'} rounded-full blur-[120px]`}></div>
            <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] ${isTechnician ? 'bg-emerald-500/5' : 'bg-indigo-500/5'} rounded-full blur-[100px]`}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">บัญชีของฉัน</h1>
                <p className="text-white/80 text-base font-light">จัดการข้อมูลส่วนตัวและตรวจสอบสถานะของคุณ</p>
              </div>
              {/* Removed duplicate buttons (Back to Home, Logout) as they are already in the Navbar */}
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Profile Insight */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[35px]">
                  <CardContent className="p-0">
                    <div className={`h-24 bg-gradient-to-r ${isTechnician ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'}`}></div>
                    <div className="px-6 pb-8 -mt-12 text-center">
                      <div className="relative inline-block mb-4">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt={userData?.username}
                            className={`w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl bg-white transition-opacity ${isEditing ? 'opacity-80' : ''}`}
                          />
                        ) : (
                          <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${isTechnician ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-2xl transition-opacity ${isEditing ? 'opacity-80' : ''}`}>
                            {userData?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {isTechnician && !!technicianData?.isVerified && !isEditing && (
                          <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                            <ShieldCheck className="h-5 w-5 text-white" />
                          </div>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => profileInputRef.current?.click()}
                            className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-black/40 text-white hover:bg-black/50 transition-colors"
                          >
                            <ImageIcon className="h-6 w-6 mb-1" />
                            <span className="text-[10px] font-bold tracking-wider">อัปโหลด</span>
                          </button>
                        )}
                        <input
                          type="file"
                          ref={profileInputRef}
                          onChange={handleProfileImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>

                      <h2 className="text-2xl font-black text-gray-900 mb-1">{userData?.firstName ? `${userData.firstName} ${userData.lastName}` : userData?.username}</h2>
                      <p className="text-gray-400 text-sm font-medium mb-6">@{userData?.username}</p>

                      {isTechnician && (
                        <div className="flex items-center justify-center gap-4 mb-8 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{(Number(technicianData?.rating) || 0).toFixed(1)}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{technicianData?.totalJobs || 0}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jobs</p>
                          </div>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="text-center">
                            <p className="text-xl font-black text-gray-900">{technicianData?.totalReviews || 0}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Reviews</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          className={`w-full ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100' : 'bg-gray-900 hover:bg-black text-white'} py-6 rounded-2xl shadow-xl transition-all font-bold`}
                        >
                          {isEditing ? <><X className="mr-2 h-4 w-4" /> ยกเลิกการแก้ไข</> : <><Edit className="mr-2 h-4 w-4" /> แก้ไขโปรไฟล์</>}
                        </Button>
                        {isTechnician && (
                          <Button
                            onClick={() => navigate(`/good-workers/${userData.id}`)}
                            variant="outline"
                            className="w-full py-6 rounded-2xl border-gray-200 font-bold hover:bg-gray-50"
                          >
                            <Share2 className="mr-2 h-4 w-4" /> ดูหน้าร้านของฉัน
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-8 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-blue-500">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold text-gray-800">{userData?.email}</p>
                          </div>
                        </div>
                        {userData?.phone && (
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-green-500">
                              <Phone className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Phone Number</p>
                              <p className="text-sm font-bold text-gray-800">{userData?.phone}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-purple-500">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Account Status</p>
                            <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter">
                              {userData?.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {isTechnician && !!technicianData?.isVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-600 p-6 rounded-[30px] text-white shadow-2xl shadow-green-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck className="h-7 w-7" />
                    <h3 className="font-black text-lg">ยืนยันตัวตนแล้ว</h3>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed font-light">
                    คุณได้ผ่านการตรวจสอบบัตรประชาชนและประวัติการทำงานเรียบร้อยแล้ว โปรไฟล์ของคุณจะได้รับความน่าเชื่อถือสูงกว่าปกติ
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right Column: Settings & Data */}
            <div className="lg:col-span-2 space-y-6">

              <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[35px] overflow-hidden">
                <Tabs defaultValue={isEditing ? "settings" : "overview"} className="w-full">
                  <CardHeader className="bg-white pb-0 px-8 pt-6">
                    <TabsList className="w-full justify-start gap-8 bg-transparent h-12 p-0 border-b rounded-none mb-0">
                      <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-wider text-gray-400 data-[state=active]:text-blue-600"
                      >
                        {isTechnician ? 'ผลงาน & รีวิว' : 'ภาพรวมบัญชี'}
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none px-0 h-12 text-sm font-bold uppercase tracking-wider text-gray-400 data-[state=active]:text-blue-600"
                      >
                        ตั้งค่าข้อมูลส่วนตัว
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  <CardContent className="p-8">
                    <TabsContent value="overview" className="mt-0">
                      {isTechnician ? (
                        <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden group">
                              <Award className="absolute -right-4 -bottom-4 h-24 w-24 text-blue-500/10 group-hover:scale-110 transition-transform" />
                              <h4 className="font-black text-blue-900 mb-2">ประเภทงานของคุณ</h4>
                              <div className="flex flex-wrap gap-2">
                                {technicianData?.workTypes?.map((w, i) => (
                                  <Badge key={i} className="bg-white text-blue-700 hover:bg-white border-none shadow-sm text-xs px-3">{w}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 relative overflow-hidden group">
                              <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 text-purple-500/10 group-hover:scale-110 transition-transform" />
                              <h4 className="font-black text-purple-900 mb-2">สถิติระบบ</h4>
                              <p className="text-xs text-purple-700/70 font-medium">คุณมีรีวิวใหม่ 0 รายการในสัปดาห์นี้</p>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="font-black text-lg text-gray-900">จัดการผลงาน (Projects)</h3>
                            </div>

                            <div className="space-y-6">
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h4 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                                  <Plus className="h-4 w-4 text-blue-500" /> เพิ่มผลงานใหม่
                                </h4>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                      placeholder="ชื่อผลงาน เช่น งานเดินลอยท่อ, ซ่อมปั๊มน้ำ..."
                                      value={uploadData.title}
                                      onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                                      className="rounded-xl border-gray-200"
                                    />
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleUploadClick}
                                        className="rounded-xl border-gray-200 bg-white"
                                      >
                                        <ImageIcon className="mr-2 h-4 w-4" /> เลือกรูปภาพ
                                      </Button>
                                      <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {uploadData.image ? uploadData.image.name : 'ยังไม่เลือกรูป'}
                                      </span>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                  />
                                  <Textarea
                                    placeholder="รายละเอียดผลงานสั้นๆ เล่าเกี่ยวกับสิ่งที่คุณทำได้เลย..."
                                    value={uploadData.description}
                                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                                    className="rounded-xl border-gray-200 resize-none h-20"
                                  />
                                  <Button
                                    onClick={handleAddPortfolio}
                                    disabled={isUploading || !uploadData.image}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                                  >
                                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                                    อัปโหลดผลงาน
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {portfolios.map(item => {
                                  const imgUrl = item.image_url.startsWith('http')
                                    ? item.image_url
                                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5002'}${item.image_url}`;
                                  return (
                                    <div key={item.id} className="relative group overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img src={imgUrl} alt={item.title || 'ผลงาน'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      </div>
                                      <div className="p-4 bg-white">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.title || 'ไม่มีชื่อผลงาน'}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                      </div>
                                      <button
                                        onClick={() => handleDeletePortfolio(item.id)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )
                                })}
                                {portfolios.length === 0 && (
                                  <div className="col-span-1 md:col-span-2 text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                    <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto">ยังไม่มีผลงาน เพิ่มรูปภาพผลงานของคุณให้ลูกค้าเห็นได้ง่ายขึ้น</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-gray-900">ประวัติการแจ้งข่าวของคุณ</h3>
                            <Button
                              onClick={() => navigate('/report')}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                            >
                              <AlertTriangle className="mr-2 h-4 w-4" /> แจ้งรายชื่อใหม่
                            </Button>
                          </div>

                          <div className="text-center py-20 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-100">
                            <FileText className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="font-black text-gray-900 mb-1">ยังไม่มีประวัติการแจ้ง</h3>
                            <p className="text-gray-400 text-sm max-w-xs mx-auto">ขอบคุณที่เป็นส่วนหนึ่งในการช่วยให้สังคมการจ้างช่างปลอดภัยขึ้น</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Username</Label>
                            <Input
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold focus:ring-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ชื่อ (First Name)</Label>
                            <Input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">นามสกุล (Last Name)</Label>
                            <Input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">เบอร์โทรศัพท์</Label>
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Line ID</Label>
                            <Input
                              name="lineId"
                              value={formData.lineId}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className="rounded-2xl border-gray-100 h-14 font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Facebook Profile Link</Label>
                          <Input
                            name="facebookLink"
                            value={formData.facebookLink}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="https://facebook.com/your-profile"
                            className="rounded-2xl border-gray-100 h-14 font-bold"
                          />
                        </div>

                        {isTechnician && (
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ประเภทงานที่คุณรับ (กด Enter เพื่อเพิ่ม)</Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {formData.workTypes.map((type, idx) => (
                                <Badge key={idx} className="bg-green-100 text-green-700 hover:bg-green-200 border-none px-3 py-1 flex items-center gap-2">
                                  {type}
                                  {isEditing && (
                                    <X
                                      className="h-3 w-3 cursor-pointer"
                                      onClick={() => setFormData(prev => ({
                                        ...prev,
                                        workTypes: prev.workTypes.filter((_, i) => i !== idx)
                                      }))}
                                    />
                                  )}
                                </Badge>
                              ))}
                            </div>
                            {isEditing && (
                              <Input
                                placeholder="เพิ่มประเภทงาน เช่น ช่างไฟฟ้า, ช่างประปา..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = e.target.value.trim();
                                    if (val && !formData.workTypes.includes(val)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        workTypes: [...prev.workTypes, val]
                                      }));
                                      e.target.value = '';
                                    }
                                  }
                                }}
                                className="rounded-2xl border-gray-100 h-14 font-bold"
                              />
                            )}
                          </div>
                        )}

                        {isTechnician && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">จังหวัดที่รับงาน (Province)</Label>
                              <Input
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="เช่น กรุงเทพมหานคร, เชียงใหม่..."
                                className="rounded-2xl border-gray-100 py-6 font-medium"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">แนะนำตัวเอง (Bio)</Label>
                              <Textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                placeholder="แนะนำตัวเองสั้นๆ เพื่อให้ลูกค้ารู้จักคุณมากขึ้น..."
                                className="rounded-2xl border-gray-100 min-h-[120px] font-medium leading-relaxed"
                              />
                            </div>
                          </div>
                        )}

                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-4 flex gap-4"
                          >
                            <Button
                              type="submit"
                              disabled={isSaving}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-8 font-black text-lg shadow-2xl shadow-blue-100"
                            >
                              {isSaving ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <Save className="mr-3 h-5 w-5" />}
                              บันทึกการเปลี่ยนแปลงทั้งหมด
                            </Button>
                          </motion.div>
                        )}
                      </form>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>

              <div className="bg-blue-50 border border-blue-100 p-8 rounded-[35px] flex flex-col md:flex-row items-center gap-6">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="text-center md:text-left">
                  <h4 className="font-extrabold text-blue-900 text-lg mb-1">รักษาข้อมูลของคุณให้เป็นปัจจุบัน</h4>
                  <p className="text-blue-700/60 text-sm leading-relaxed">การอัปเดตข้อมูลการติดต่อที่ถูกต้องจะช่วยให้ลูกค้าสามารถเข้าถึงคุณได้ง่ายขึ้น และเพิ่มโอกาสในการรับงานที่มากขึ้น</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccountPage;






