import React, { useState, useEffect, useRef } from 'react';
import settingService from '@/services/settingService';
import authService from '@/services/authService';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle,
  AlertTriangle,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Plus,
  Trash2,
  ChevronRight,
  Info,
  Server,
  Key,
  Smartphone,
  ShieldCheck,
  Palette,
  LayoutDashboard
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/hooks/use-auth';
import logo from '@/assest/logo.jpg';

const SettingsPage = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'รู้ทันช่าง',
    siteUrl: 'www.ตรวจสอบช่าง.com',
    siteDescription: 'ระบบตรวจสอบบัญชีดำช่างมืออาชีพ',
    adminEmail: 'admin@ตรวจสอบช่าง.com',
    supportEmail: 'support@ตรวจสอบช่าง.com',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newReportAlert: true,
    weeklyReport: false,
    systemUpdates: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireApproval: true,
    autoModeration: false,
    twoFactorAuth: false,
    sessionTimeout: '30',
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    username: user?.username || 'admin',
    email: user?.email || 'admin@ตรวจสอบช่าง.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Work Types Settings
  const [workTypes, setWorkTypes] = useState([]);
  const [newWorkType, setNewWorkType] = useState('');
  const [loadingWorkTypes, setLoadingWorkTypes] = useState(false);

  // Profile Image State
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchWorkTypes = async () => {
      try {
        setLoadingWorkTypes(true);
        const data = await settingService.get('work_types');
        setWorkTypes(data || []);
      } catch (error) {
        console.error('Error fetching work types:', error);
      } finally {
        setLoadingWorkTypes(false);
      }
    };
    fetchWorkTypes();
  }, []);

  const handleAddWorkType = () => {
    if (!newWorkType.trim()) return;
    if (workTypes.includes(newWorkType.trim())) {
      toast({ title: 'ประเภทงานนี้มีอยู่แล้ว', variant: 'destructive' });
      return;
    }
    setWorkTypes([...workTypes, newWorkType.trim()]);
    setNewWorkType('');
  };

  const handleRemoveWorkType = (typeToRemove) => {
    setWorkTypes(workTypes.filter(t => t !== typeToRemove));
  };

  const handleSaveWorkTypes = async () => {
    try {
      setIsSaving(true);
      await settingService.update('work_types', workTypes);
      toast({
        title: "✅ บันทึกสำเร็จ",
        description: "รายการประเภทงานได้รับการอัปเดตแล้ว",
      });
    } catch (error) {
      toast({ title: '❌ เกิดข้อผิดพลาด', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = (section) => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "✅ บันทึกสำเร็จ",
        description: `การตั้งค่า ${section} ได้รับการอัปเดตแล้ว`,
      });
    }, 1000);
  };

  const handleSaveProfile = async () => {
    if (profileSettings.newPassword && profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast({
        title: "❌ รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านใหม่และยืนยันรหัสผ่านอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        username: profileSettings.username,
        email: profileSettings.email,
      };

      if (profileSettings.newPassword) {
        updateData.currentPassword = profileSettings.currentPassword;
        updateData.newPassword = profileSettings.newPassword;
      }

      if (profileImage) {
        updateData.image = profileImage;
      }

      const result = await authService.updateProfile(updateData);

      if (result.success) {
        // Update local storage if username or email or image changed
        const storedUser = JSON.parse(localStorage.getItem('black-list-user') || '{}');
        const updatedUser = {
          ...storedUser,
          username: profileSettings.username,
          email: profileSettings.email,
          profileImage: result.data?.user?.profileImage || storedUser.profileImage
        };
        localStorage.setItem('black-list-user', JSON.stringify(updatedUser));

        toast({
          title: "✅ อัปเดตโปรไฟล์สำเร็จ",
          description: "ข้อมูลโปรไฟล์ของคุณได้รับการบันทึกแล้ว",
        });

        // Clear password fields and image selection
        setProfileSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setProfileImage(null);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "❌ อัปเดตโปรไฟล์ไม่สำเร็จ",
        description: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const SectionTitle = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 bg-indigo-50 rounded-xl">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );

  const SettingRow = ({ icon: Icon, title, description, control }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100/50 hover:bg-white transition-all group gap-4">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <Icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        )}
        <div className="space-y-0.5">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex justify-end">{control}</div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>ตั้งค่าระบบ - แอดมินโปร</title>
      </Helmet>

      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 w-fit rounded-full text-xs font-bold border border-indigo-100">
                <LayoutDashboard className="h-3 w-3" />
                ADMIN CONTROL CENTER
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                ตั้งค่าระบบ
              </h1>
              <p className="text-slate-500 max-w-lg">
                ปรับแต่งข้อมูลเว็บไซต์ การแจ้งเตือน และความปลอดภัยของแพลตฟอร์ม รู้ทันช่าง
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-1.5 border-slate-200 bg-white shadow-sm text-slate-600">
                System Status: <span className="text-green-600 ml-1 font-bold">Active</span>
              </Badge>
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <Info className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </div>
          </div>

          {/* Main Content Layout */}
          <Tabs defaultValue="site" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Tabs */}
              <div className="lg:col-span-3">
                <TabsList className="flex lg:flex-col h-auto bg-transparent border-0 p-0 overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0">
                  {[
                    { id: 'site', label: 'ข้อมูลเว็บไซต์', icon: Globe },
                    { id: 'work-types', label: 'จัดการประเภทงาน', icon: FileText },
                    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
                    { id: 'security', label: 'ความปลอดภัย', icon: ShieldCheck },
                    { id: 'profile', label: 'โปรไฟล์ส่วนตัว', icon: User },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center justify-start gap-4 px-5 py-4 w-full rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-500/10 data-[state=active]:text-indigo-600 border border-transparent hover:border-indigo-100 hover:bg-white/50 transition-all text-slate-500 font-bold whitespace-nowrap lg:whitespace-normal group"
                    >
                      <tab.icon className="h-5 w-5" />
                      <span className="text-sm">{tab.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-data-[state=active]:opacity-100 hidden lg:block" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Content Area */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  {/* Site Settings Tab Content */}
                  <TabsContent value="site" className="m-0 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8">
                          <SectionTitle
                            icon={Globe}
                            title="ข้อมูลพื้นฐาน"
                            description="ตั้งค่าชื่อเว็บไซต์ โลโก้ และข้อมูลการติดต่อหลัก"
                          />
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                          {/* Logo Upload Section */}
                          <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed">
                            <div className="relative group">
                              <img
                                src={logo}
                                alt="Logo"
                                className="h-24 w-24 rounded-2xl object-contain shadow-xl border-4 border-white"
                              />
                              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-lg border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                                <Palette className="h-4 w-4 text-indigo-600" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                              <p className="font-bold text-slate-800">โลโก้แบรนด์หลัก</p>
                              <p className="text-sm text-slate-500">แนะนำขนาด 200x200px (PNG, SVG หรือ WebP)</p>
                              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                  อัปโหลดโลโก้ใหม่
                                </Button>
                                <Button size="sm" variant="ghost" className="text-slate-400">
                                  ลบรูปภาพ
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="siteName" className="font-bold text-slate-700 ml-1">ชื่อเว็บไซต์</Label>
                              <Input
                                id="siteName"
                                className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                value={siteSettings.siteName}
                                onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="siteUrl" className="font-bold text-slate-700 ml-1">Site URL</Label>
                              <Input
                                id="siteUrl"
                                className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                                value={siteSettings.siteUrl}
                                onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="siteDescription" className="font-bold text-slate-700 ml-1">คำอธิบาย Meta Description</Label>
                            <Input
                              id="siteDescription"
                              className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500"
                              value={siteSettings.siteDescription}
                              onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
                            <div className="space-y-2">
                              <Label htmlFor="adminEmail" className="font-bold text-slate-700 ml-1">Email ผู้ดูแล</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  id="adminEmail"
                                  className="h-12 pl-10 rounded-xl border-slate-200 bg-slate-50/50"
                                  value={siteSettings.adminEmail}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="supportEmail" className="font-bold text-slate-700 ml-1">Email สนับสนุน</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  id="supportEmail"
                                  className="h-12 pl-10 rounded-xl border-slate-200"
                                  value={siteSettings.supportEmail}
                                  onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={() => handleSaveSettings('พื้นฐาน')}
                              className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl shadow-slate-200 transition-all font-bold"
                              disabled={isSaving}
                            >
                              {isSaving ? "กำลังบันทึก..." : <><Save className="mr-2 h-4 w-4" /> บันทึกข้อมูลเว็บไซต์</>}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Work Types Tab Content */}
                  <TabsContent value="work-types" className="m-0 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8">
                          <SectionTitle
                            icon={FileText}
                            title="จัดการประเภทงาน"
                            description="เพิ่มหรือแก้ไขรายการทักษะที่ช่างสามารถเลือกได้ตอนสมัครสมาชิก"
                          />
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="ระบุชื่อประเภทงานใหม่เช่น 'ซ่อมมุ้งลวด'..."
                                className="h-12 pl-10 rounded-xl border-slate-200 focus:ring-green-500 focus:border-green-500"
                                value={newWorkType}
                                onChange={(e) => setNewWorkType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddWorkType()}
                              />
                            </div>
                            <Button
                              onClick={handleAddWorkType}
                              className="h-12 px-6 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 rounded-xl font-bold"
                            >
                              เพิ่มรายการ
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                              <p className="text-sm font-bold text-slate-700">รายการประเภทงานปัจจุบัน ({workTypes.length})</p>
                              <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100">
                                แสดงผลหน้าทะเบียนช่าง
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                              {loadingWorkTypes ? (
                                <div className="col-span-full py-10 text-center space-y-4">
                                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                  <p className="text-slate-500 font-medium">กำลังเตรียมข้อมูล...</p>
                                </div>
                              ) : workTypes.map((type, index) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  key={type}
                                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group"
                                >
                                  <span className="font-bold text-slate-700">{type}</span>
                                  <button
                                    onClick={() => handleRemoveWorkType(type)}
                                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </motion.div>
                              ))}
                            </div>

                            {workTypes.length === 0 && !loadingWorkTypes && (
                              <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                                <div className="p-4 bg-white rounded-full w-fit mx-auto shadow-sm mb-4">
                                  <FileText className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-slate-400 font-medium">ยังไม่มีรายการข้อมูลในระบบ</p>
                              </div>
                            )}
                          </div>

                          <div className="border-t pt-8 flex items-center justify-between">
                            <p className="text-xs text-slate-400 max-w-sm">
                              * การลบประเภทงานอาจส่งผลต่อการค้นหาของช่างที่ระบุประเภทงานนั้นๆ ไว้ก่อนหน้า
                            </p>
                            <Button
                              onClick={handleSaveWorkTypes}
                              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-100 transition-all font-bold"
                              disabled={isSaving}
                            >
                              {isSaving ? "กำลังบันทึก..." : <><CheckCircle className="mr-2 h-4 w-4" /> บันทึกการเปลี่ยนแปลงทั้งหมด</>}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Notifications Tab Content */}
                  <TabsContent value="notifications" className="m-0 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8">
                          <SectionTitle
                            icon={Bell}
                            title="ตั้งค่าแจ้งเตือน"
                            description="ปรับแต่งวิธีรับข่าวสารและรายงานความเคลื่อนไหวจากระบบ"
                          />
                        </CardHeader>
                        <CardContent className="pt-8 space-y-4">
                          <div className="grid gap-3">
                            <SettingRow
                              icon={Mail}
                              title="การแจ้งเตือนทางอีเมล"
                              description="ส่งรายงานและสรุปยอดไปยังอีเมลผู้ดูแล"
                              control={
                                <Switch
                                  checked={notificationSettings.emailNotifications}
                                  onCheckedChange={(checked) => setNotificationSettings({
                                    ...notificationSettings,
                                    emailNotifications: checked
                                  })}
                                />
                              }
                            />
                            <SettingRow
                              icon={AlertTriangle}
                              title="แจ้งเตือนรายงานใหม่"
                              description="แจ้งเตือนทันทีเมื่อมีผู้จ้างงานส่งรายงานบัญชีดำเข้ามา"
                              control={
                                <Switch
                                  checked={notificationSettings.newReportAlert}
                                  className="data-[state=checked]:bg-amber-500"
                                  onCheckedChange={(checked) => setNotificationSettings({
                                    ...notificationSettings,
                                    newReportAlert: checked
                                  })}
                                />
                              }
                            />
                            <SettingRow
                              icon={Calendar}
                              title="สรุปรายสัปดาห์"
                              description="รวบรวมสถิติประจำสัปดาห์ส่งเป็นไฟล์ PDF ทุกวันจันทร์"
                              control={
                                <Switch
                                  checked={notificationSettings.weeklyReport}
                                  onCheckedChange={(checked) => setNotificationSettings({
                                    ...notificationSettings,
                                    weeklyReport: checked
                                  })}
                                />
                              }
                            />
                            <SettingRow
                              icon={Server}
                              title="ประสิทธิภาพระบบ"
                              description="แจ้งเตือนเมื่อระบบมีการใช้อัตราทรัพยากรสูง"
                              control={
                                <Switch
                                  checked={notificationSettings.systemUpdates}
                                  onCheckedChange={(checked) => setNotificationSettings({
                                    ...notificationSettings,
                                    systemUpdates: checked
                                  })}
                                />
                              }
                            />
                          </div>

                          <div className="flex justify-end pt-6">
                            <Button
                              onClick={() => handleSaveSettings('การแจ้งเตือน')}
                              className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl transition-all font-bold"
                            >
                              บันทึกการตั้งค่า
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Security Tab Content */}
                  <TabsContent value="security" className="m-0 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8">
                          <SectionTitle
                            icon={ShieldCheck}
                            title="ระบบความปลอดภัย"
                            description="ควบคุมการเข้าถึงและระบบคัดกรองเนื้อหาอัตโนมัติ"
                          />
                        </CardHeader>
                        <CardContent className="pt-8 space-y-6">
                          <div className="grid gap-3">
                            <SettingRow
                              icon={CheckCircle}
                              title="ระบบคัดกรองข้อมูล"
                              description="รายงานใหม่ต้องได้รับการอนุมัติจากแอดมินก่อนแสดงผลจริง"
                              control={
                                <Switch
                                  checked={securitySettings.requireApproval}
                                  className="data-[state=checked]:bg-indigo-600"
                                  onCheckedChange={(checked) => setSecuritySettings({
                                    ...securitySettings,
                                    requireApproval: checked
                                  })}
                                />
                              }
                            />
                            <SettingRow
                              icon={Smartphone}
                              title="2FA Authentication"
                              description="เพิ่มความปลอดภัยชั้นที่สองด้วย Google Authenticator"
                              control={
                                <Switch
                                  checked={securitySettings.twoFactorAuth}
                                  onCheckedChange={(checked) => setSecuritySettings({
                                    ...securitySettings,
                                    twoFactorAuth: checked
                                  })}
                                />
                              }
                            />
                          </div>

                          <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4">
                            <div className="flex items-center gap-3">
                              <Key className="h-5 w-5 text-indigo-600" />
                              <Label htmlFor="sessionTimeout" className="font-bold text-slate-700">ระยะเวลา Session หมดอายุ (นาที)</Label>
                            </div>
                            <div className="flex items-center gap-4">
                              <Input
                                id="sessionTimeout"
                                type="number"
                                className="h-12 w-32 rounded-xl border-slate-200 bg-white"
                                value={securitySettings.sessionTimeout}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                              />
                              <p className="text-sm text-indigo-600 font-medium">แนะนำ: 30-60 นาที เพื่อความปลอดภัยสูงสุด</p>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={() => handleSaveSettings('ความปลอดภัย')}
                              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-100 transition-all font-bold"
                            >
                              อัปเดตการตั้งค่าความปลอดภัย
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Profile Tab Content */}
                  <TabsContent value="profile" className="m-0 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
                        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-8">
                          <SectionTitle
                            icon={User}
                            title="ข้อมูลส่วนตัว"
                            description="จัดการข้อมูลโปรไฟล์และเปลี่ยนรหัสผ่านผู้ดูแลระบบ"
                          />
                        </CardHeader>
                        <CardContent className="pt-8 space-y-10">
                          {/* Avatar Section */}
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative group">
                              {profileImagePreview ? (
                                <img
                                  src={profileImagePreview}
                                  alt="Profile"
                                  className="h-24 w-24 rounded-3xl object-cover shadow-2xl shadow-indigo-200 border-4 border-white"
                                />
                              ) : (
                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-extrabold text-3xl shadow-2xl shadow-indigo-200">
                                  {(profileSettings.username || 'A')[0].toUpperCase()}
                                </div>
                              )}
                              <div className="absolute -inset-1 rounded-3xl bg-indigo-500 opacity-20 blur group-hover:opacity-40 transition-opacity"></div>
                            </div>
                            <div className="space-y-1 text-center sm:text-left">
                              <h4 className="text-xl font-bold text-slate-800">{profileSettings.username}</h4>
                              <p className="text-sm text-slate-500">Administrator Role</p>
                              {/* Hidden File Input */}
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 rounded-lg border-slate-200 hover:bg-slate-50"
                                onClick={() => fileInputRef.current.click()}
                              >
                                อัปโหลดรูปโปรไฟล์
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="username" className="font-bold text-slate-700 ml-1">ชื่อผู้ใช้</Label>
                              <Input
                                id="username"
                                className="h-12 rounded-xl border-slate-200"
                                value={profileSettings.username}
                                onChange={(e) => setProfileSettings({ ...profileSettings, username: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="font-bold text-slate-700 ml-1">อีเมลติดต่อ</Label>
                              <Input
                                id="email"
                                type="email"
                                className="h-12 rounded-xl border-slate-200"
                                value={profileSettings.email}
                                onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <Lock className="h-5 w-5 text-indigo-600" />
                              <h4 className="text-lg font-bold text-slate-800">เปลี่ยนรหัสผ่าน</h4>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                              <div className="relative">
                                <Input
                                  id="currentPassword"
                                  type={showPassword ? "text" : "password"}
                                  className="h-12 pr-12 rounded-xl border-slate-200 bg-slate-50/30"
                                  value={profileSettings.currentPassword}
                                  onChange={(e) => setProfileSettings({ ...profileSettings, currentPassword: e.target.value })}
                                  placeholder="••••••••••••"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                                <Input
                                  id="newPassword"
                                  type={showPassword ? "text" : "password"}
                                  className="h-12 rounded-xl border-slate-200"
                                  value={profileSettings.newPassword}
                                  onChange={(e) => setProfileSettings({ ...profileSettings, newPassword: e.target.value })}
                                  placeholder="รหัสผ่านใหม่"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                                <Input
                                  id="confirmPassword"
                                  type={showPassword ? "text" : "password"}
                                  className="h-12 rounded-xl border-slate-200"
                                  value={profileSettings.confirmPassword}
                                  onChange={(e) => setProfileSettings({ ...profileSettings, confirmPassword: e.target.value })}
                                  placeholder="ยืนยันรหัสผ่าน"
                                />
                              </div>
                            </div>

                            <AnimatePresence>
                              {profileSettings.newPassword && profileSettings.confirmPassword && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className={`p-4 rounded-2xl flex items-center gap-3 ${profileSettings.newPassword === profileSettings.confirmPassword
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                                    }`}
                                >
                                  {profileSettings.newPassword === profileSettings.confirmPassword ? (
                                    <><CheckCircle className="h-5 w-5" /> <span className="font-bold">รหัสผ่านตรงกันสมบูรณ์</span></>
                                  ) : (
                                    <><AlertTriangle className="h-5 w-5" /> <span className="font-bold">รหัสผ่านที่ระบุไม่ตรงกัน</span></>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" className="text-slate-400">ยกเลิก</Button>
                            <Button
                              onClick={handleSaveProfile}
                              className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl transition-all font-bold"
                            >
                              บันทึกการเปลี่ยนแปลงโปรไฟล์
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </>
  );
};

export default SettingsPage;
