import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Verified
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import authService from '@/services/authService';

const UserAccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [technicianData, setTechnicianData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    lineId: '',
    facebookLink: '',
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API if token exists
        const token = localStorage.getItem('token');
        if (token && user) {
          try {
            const data = await authService.getCurrentUser();
            setUserData(data.user);
            setTechnicianData(data.technician);
            setFormData(prev => ({
              ...prev,
              username: data.user.username || prev.username,
              email: data.user.email || prev.email,
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              phone: data.user.phone || '',
              lineId: data.user.lineId || '',
              facebookLink: data.user.facebookLink || '',
            }));
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to localStorage user
            setUserData(user);
            // If user is technician, create technician data from localStorage
            if (user.role === 'technician' || user.isTechnician) {
              setTechnicianData({
                workTypes: user.workTypes || [],
                rating: 0,
                totalReviews: 0,
                totalJobs: 0,
                isVerified: false
              });
            }
          }
        } else {
          setUserData(user);
          // If user is technician, create technician data from localStorage
          if (user.role === 'technician' || user.isTechnician) {
            setTechnicianData({
              workTypes: user.workTypes || [],
              rating: 0,
              totalReviews: 0,
              totalJobs: 0,
              isVerified: false
            });
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setUserData(user);
        // If user is technician, create technician data from localStorage
        if (user.role === 'technician' || user.isTechnician) {
          setTechnicianData({
            workTypes: user.workTypes || [],
            rating: 0,
            totalReviews: 0,
            totalJobs: 0,
            isVerified: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Mock user reports data
  const userReports = [
    { id: 1, technicianName: 'สมชาย ทิ้งงาน', status: 'approved', date: '2025-11-15', offense: 'รับเงินมัดจำแล้วหาย' },
    { id: 2, technicianName: 'ประวิทย์ ไม่มา', status: 'pending', date: '2025-11-18', offense: 'งานไม่เรียบร้อย' },
    { id: 3, technicianName: 'มานะ โกงเงิน', status: 'rejected', date: '2025-11-10', offense: 'เบิกเงินเกินจริง' },
  ];

  const stats = {
    total: userReports.length,
    approved: userReports.filter(r => r.status === 'approved').length,
    pending: userReports.filter(r => r.status === 'pending').length,
    rejected: userReports.filter(r => r.status === 'rejected').length,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if user is technician - check multiple sources
  const checkIsTechnician = () => {
    if (!user && !userData) return false;
    
    const checkUser = userData || user;
    const roleCheck = checkUser?.role === 'technician';
    const isTechnicianCheck = checkUser?.isTechnician === true;
    const result = roleCheck || isTechnicianCheck;
    
    console.log('=== CHECKING IS TECHNICIAN ===');
    console.log('CheckUser:', checkUser);
    console.log('Role check:', roleCheck, '(role:', checkUser?.role, ')');
    console.log('IsTechnician check:', isTechnicianCheck, '(isTechnician:', checkUser?.isTechnician, ')');
    console.log('Result:', result);
    console.log('================================');
    
    return result;
  };

  const isTechnician = checkIsTechnician();

  // Debug log
  useEffect(() => {
    if (user || userData) {
      const checkUser = userData || user;
      console.log('=== DEBUG INFO ===');
      console.log('User:', user);
      console.log('UserData:', userData);
      console.log('CheckUser (userData || user):', checkUser);
      console.log('User.role:', user?.role);
      console.log('User.isTechnician:', user?.isTechnician);
      console.log('UserData.role:', userData?.role);
      console.log('UserData.isTechnician:', userData?.isTechnician);
      console.log('TechnicianData:', technicianData);
      console.log('IsTechnician (calculated):', isTechnician);
      console.log('==================');
    }
  }, [user, userData, technicianData, isTechnician]);

  const handleSave = () => {
    // In a real app, this would call an API to update user info
    toast({
      title: "✅ บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลของคุณได้รับการอัปเดตแล้ว",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            รอตรวจสอบ
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            ปฏิเสธ
          </Badge>
        );
      default:
        return <Badge variant="outline">ไม่ระบุ</Badge>;
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>บัญชีของฉัน - รู้ทันช่าง</title>
        <meta name="description" content="จัดการข้อมูลบัญชีและดูประวัติการแจ้งของคุณ" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">บัญชีของฉัน</h1>
            <p className="text-gray-600">จัดการข้อมูลส่วนตัวและดูประวัติการแจ้งของคุณ</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="border-2 border-gray-900 shadow-xl">
                <CardHeader className="bg-gray-900 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    ข้อมูลส่วนตัว
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        {userData?.profileImage && typeof userData.profileImage === 'string' && userData.profileImage.trim() ? (
                          <img 
                            src={userData.profileImage.startsWith('/') ? userData.profileImage : `/api${userData.profileImage}`}
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                            {user.username?.charAt(0).toUpperCase() || userData?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {isTechnician && technicianData?.isVerified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                            <Verified className="h-4 w-4 text-white" />
                        </div>
                        )}
                        {!isTechnician && (
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                        )}
                      </div>
                    </div>

                    {/* User Info Form */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          ชื่อผู้ใช้
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          อีเมล
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          บทบาท
                        </Label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300">
                          <Badge variant="secondary" className={isTechnician ? 'bg-green-100 text-green-800' : ''}>
                            {user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                             isTechnician ? 'ช่าง' : 'ผู้ใช้ทั่วไป'}
                          </Badge>
                        </div>
                      </div>

                      {/* Technician specific fields */}
                      {isTechnician && (
                        <>
                          {formData.firstName && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                ชื่อ-นามสกุล
                              </Label>
                              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm text-gray-700">
                                {formData.firstName} {formData.lastName}
                              </div>
                            </div>
                          )}

                          {formData.phone && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                เบอร์โทรศัพท์
                              </Label>
                              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm text-gray-700">
                                {formData.phone}
                              </div>
                            </div>
                          )}

                          {formData.lineId && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Line ID
                              </Label>
                              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm text-gray-700">
                                {formData.lineId}
                              </div>
                            </div>
                          )}

                          {formData.facebookLink && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Link2 className="h-4 w-4" />
                                Facebook
                              </Label>
                              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300">
                                <a 
                                  href={formData.facebookLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  {formData.facebookLink}
                                </a>
                              </div>
                            </div>
                          )}

                          {((technicianData?.workTypes && technicianData.workTypes.length > 0) || 
                            (user?.workTypes && user.workTypes.length > 0)) && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                ประเภทงานที่รับ
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {(technicianData?.workTypes || user?.workTypes || []).map((workType, index) => (
                                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                    {workType}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          เข้าร่วมเมื่อ
                        </Label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm text-gray-700">
                          19 พฤศจิกายน 2025
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSave}
                            className="flex-1 bg-gray-900 hover:bg-gray-800"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            บันทึก
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1"
                          >
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="w-full border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไขข้อมูล
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-2 border-gray-300 shadow-lg">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg">การกระทำด่วน</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {isTechnician ? (
                    <>
                      <Button 
                        onClick={() => navigate('/good-workers')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        ดูโปรไฟล์ของฉัน
                      </Button>
                      <Button 
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        ดูรายชื่อบัญชีดำ
                      </Button>
                    </>
                  ) : (
                    <>
                  <Button 
                    onClick={() => navigate('/report')}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    แจ้งแบล็คลิสต์ใหม่
                  </Button>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    ดูรายชื่อบัญชีดำ
                  </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Reports & Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Technician Stats */}
              {isTechnician && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="border-2 border-green-500 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Star className="h-8 w-8 mx-auto mb-2 text-green-700" />
                        <div className="text-2xl font-bold text-green-900">
                          {(technicianData?.rating || 0).toFixed(1)}
                        </div>
                        <div className="text-xs text-green-700 mt-1">คะแนนเฉลี่ย</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-500 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-700" />
                        <div className="text-2xl font-bold text-blue-900">
                          {technicianData?.totalReviews || 0}
                        </div>
                        <div className="text-xs text-blue-700 mt-1">รีวิวทั้งหมด</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-500 bg-purple-50">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Briefcase className="h-8 w-8 mx-auto mb-2 text-purple-700" />
                        <div className="text-2xl font-bold text-purple-900">
                          {technicianData?.totalJobs || 0}
                        </div>
                        <div className="text-xs text-purple-700 mt-1">งานที่ทำ</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`border-2 ${technicianData?.isVerified ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        {technicianData?.isVerified ? (
                          <>
                            <Verified className="h-8 w-8 mx-auto mb-2 text-green-700" />
                            <div className="text-sm font-bold text-green-900">ยืนยันตัวตนแล้ว</div>
                          </>
                        ) : (
                          <>
                            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-700" />
                            <div className="text-sm font-bold text-yellow-900">รอยืนยัน</div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-2 border-gray-900">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-900" />
                      <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                      <div className="text-xs text-gray-600 mt-1">รายงานทั้งหมด</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-yellow-500 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-700" />
                      <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
                      <div className="text-xs text-yellow-700 mt-1">รอตรวจสอบ</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-500 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-700" />
                      <div className="text-2xl font-bold text-green-900">{stats.approved}</div>
                      <div className="text-xs text-green-700 mt-1">อนุมัติแล้ว</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-500 bg-red-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <XCircle className="h-8 w-8 mx-auto mb-2 text-red-700" />
                      <div className="text-2xl font-bold text-red-900">{stats.rejected}</div>
                      <div className="text-xs text-red-700 mt-1">ปฏิเสธ</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reports History or Technician Profile */}
              <Card className="border-2 border-gray-900 shadow-xl">
                <CardHeader className="bg-gray-900 text-white">
                  <CardTitle className="flex items-center gap-2">
                    {isTechnician ? (
                      <>
                        <Briefcase className="h-5 w-5" />
                        โปรไฟล์ช่าง
                      </>
                    ) : (
                      <>
                    <FileText className="h-5 w-5" />
                    ประวัติการแจ้งของฉัน
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {isTechnician 
                      ? 'ข้อมูลโปรไฟล์ช่างของคุณ' 
                      : 'รายการแจ้งแบล็คลิสต์ที่คุณส่งมา'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {isTechnician ? (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          สถิติการทำงาน
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-900">
                              {(technicianData?.rating || 0).toFixed(1)}
                            </div>
                            <div className="text-xs text-green-700 mt-1">คะแนน</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-900">
                              {technicianData?.totalReviews || 0}
                            </div>
                            <div className="text-xs text-green-700 mt-1">รีวิว</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-900">
                              {technicianData?.totalJobs || 0}
                            </div>
                            <div className="text-xs text-green-700 mt-1">งาน</div>
                          </div>
                        </div>
                      </div>

                      {((technicianData?.workTypes && technicianData.workTypes.length > 0) || 
                        (user?.workTypes && user.workTypes.length > 0)) && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            ประเภทงานที่รับ
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(technicianData?.workTypes || user?.workTypes || []).map((workType, index) => (
                              <Badge key={index} className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                                {workType}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!technicianData?.workTypes || technicianData.workTypes.length === 0) && 
                       (!user?.workTypes || user.workTypes.length === 0) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-900">
                            <strong>หมายเหตุ:</strong> คุณยังไม่ได้เลือกประเภทงานที่รับ กรุณาแก้ไขข้อมูลเพื่อเพิ่มประเภทงาน
                          </p>
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                          <strong>หมายเหตุ:</strong> โปรไฟล์ของคุณจะแสดงในระบบช่างรับงานดี 
                          {technicianData?.isVerified 
                            ? ' และได้รับการยืนยันตัวตนแล้ว' 
                            : ' หลังจากยืนยันตัวตนแล้ว'}
                        </p>
                      </div>
                    </div>
                  ) : userReports.length > 0 ? (
                    <div className="space-y-4">
                      {userReports.map((report) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-900 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-gray-900 truncate">
                                  {report.technicianName}
                                </h3>
                                {getStatusBadge(report.status)}
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {report.offense}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>แจ้งเมื่อ: {report.date}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/detail/${report.id}`)}
                              className="flex-shrink-0"
                            >
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium text-lg mb-2">ยังไม่มีรายการแจ้ง</p>
                      <p className="text-sm mb-4">คุณยังไม่เคยแจ้งรายงานใดๆ ในระบบ</p>
                      <Button 
                        onClick={() => navigate('/report')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        แจ้งแบล็คลิสต์ตอนนี้
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Info Card */}
              <Card className="border-2 border-blue-500 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">หมายเหตุ:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>รายงานที่ส่งจะถูกตรวจสอบโดยทีมงานก่อนเผยแพร่</li>
                        <li>คุณสามารถตรวจสอบสถานะรายงานได้ที่หน้านี้</li>
                        <li>หากมีข้อสงสัย กรุณาติดต่อทีมงาน</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserAccountPage;






