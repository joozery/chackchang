import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
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
  FileText
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/hooks/use-auth';
import logo from '@/assest/logo.jpg';

const SettingsPage = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleSaveSiteSettings = () => {
    toast({
      title: "✅ บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าเว็บไซต์ได้รับการอัปเดตแล้ว",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "✅ บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าการแจ้งเตือนได้รับการอัปเดตแล้ว",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "✅ บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าความปลอดภัยได้รับการอัปเดตแล้ว",
    });
  };

  const handleSaveProfile = () => {
    if (profileSettings.newPassword && profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "✅ บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลโปรไฟล์ของคุณได้รับการอัปเดตแล้ว",
    });

    setProfileSettings({
      ...profileSettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <>
      <Helmet>
        <title>ตั้งค่าระบบ - แดชบอร์ดแอดมิน</title>
      </Helmet>
      <motion.div
        key="settings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8" />
              ตั้งค่าระบบ
            </h1>
            <p className="text-gray-600 mt-1">จัดการการตั้งค่าเว็บไซต์และบัญชีของคุณ</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="site" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="site" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">เว็บไซต์</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">การแจ้งเตือน</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">ความปลอดภัย</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">โปรไฟล์</span>
              </TabsTrigger>
            </TabsList>

            {/* Site Settings */}
            <TabsContent value="site" className="space-y-4">
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    ตั้งค่าเว็บไซต์
                  </CardTitle>
                  <CardDescription>จัดการข้อมูลพื้นฐานของเว็บไซต์</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="h-16 w-16 rounded-lg object-contain"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">โลโก้เว็บไซต์</p>
                      <p className="text-sm text-gray-600">ขนาดแนะนำ: 200x200px</p>
                    </div>
                    <Button variant="outline">เปลี่ยนโลโก้</Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">ชื่อเว็บไซต์</Label>
                      <Input 
                        id="siteName" 
                        value={siteSettings.siteName}
                        onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteUrl">URL เว็บไซต์</Label>
                      <Input 
                        id="siteUrl" 
                        value={siteSettings.siteUrl}
                        onChange={(e) => setSiteSettings({...siteSettings, siteUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">คำอธิบายเว็บไซต์</Label>
                    <Input 
                      id="siteDescription" 
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">อีเมลผู้ดูแล</Label>
                      <Input 
                        id="adminEmail" 
                        type="email"
                        value={siteSettings.adminEmail}
                        onChange={(e) => setSiteSettings({...siteSettings, adminEmail: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">อีเมลสนับสนุน</Label>
                      <Input 
                        id="supportEmail" 
                        type="email"
                        value={siteSettings.supportEmail}
                        onChange={(e) => setSiteSettings({...siteSettings, supportEmail: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveSiteSettings} className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกการตั้งค่า
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    การแจ้งเตือน
                  </CardTitle>
                  <CardDescription>ตั้งค่าการรับแจ้งเตือนต่างๆ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">การแจ้งเตือนทางอีเมล</p>
                          <p className="text-sm text-gray-600">รับแจ้งเตือนผ่านอีเมล</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">แจ้งเตือนรายงานใหม่</p>
                          <p className="text-sm text-gray-600">แจ้งเตือนเมื่อมีรายงานใหม่</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.newReportAlert}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          newReportAlert: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">รายงานสรุปรายสัปดาห์</p>
                          <p className="text-sm text-gray-600">รับรายงานสรุปทุกสัปดาห์</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyReport}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          weeklyReport: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 flex-1">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">อัปเดตระบบ</p>
                          <p className="text-sm text-gray-600">แจ้งเตือนเมื่อมีอัปเดตระบบ</p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          systemUpdates: checked
                        })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกการตั้งค่า
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    ความปลอดภัย
                  </CardTitle>
                  <CardDescription>ตั้งค่าความปลอดภัยและการเข้าถึง</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">ต้องอนุมัติก่อนเผยแพร่</p>
                        <p className="text-sm text-gray-600">รายงานต้องได้รับการอนุมัติก่อนแสดงในหน้าสาธารณะ</p>
                      </div>
                      <Switch
                        checked={securitySettings.requireApproval}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings,
                          requireApproval: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">ตรวจสอบอัตโนมัติ</p>
                        <p className="text-sm text-gray-600">ใช้ AI ช่วยกรองรายงานอัตโนมัติ</p>
                      </div>
                      <Switch
                        checked={securitySettings.autoModeration}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings,
                          autoModeration: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">การยืนยันตัวตนสองขั้นตอน</p>
                        <p className="text-sm text-gray-600">เพิ่มความปลอดภัยด้วย 2FA</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: checked
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">ระยะเวลา Session หมดอายุ (นาที)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                      />
                      <p className="text-sm text-gray-600">ระบบจะออกจากระบบอัตโนมัติเมื่อไม่มีการใช้งาน</p>
                    </div>
                  </div>

                  <Button onClick={handleSaveSecurity} className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกการตั้งค่า
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    ข้อมูลโปรไฟล์
                  </CardTitle>
                  <CardDescription>จัดการข้อมูลส่วนตัวและรหัสผ่าน</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-2xl">
                      {(profileSettings.username || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <Button variant="outline" size="sm">เปลี่ยนรูปโปรไฟล์</Button>
                      <p className="text-xs text-gray-600 mt-1">JPG, PNG ไม่เกิน 2MB</p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">ชื่อผู้ใช้</Label>
                      <Input 
                        id="username" 
                        value={profileSettings.username}
                        onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      เปลี่ยนรหัสผ่าน
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                      <div className="relative">
                        <Input 
                          id="currentPassword" 
                          type={showPassword ? "text" : "password"}
                          value={profileSettings.currentPassword}
                          onChange={(e) => setProfileSettings({...profileSettings, currentPassword: e.target.value})}
                          placeholder="กรอกรหัสผ่านปัจจุบัน"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                        <Input 
                          id="newPassword" 
                          type={showPassword ? "text" : "password"}
                          value={profileSettings.newPassword}
                          onChange={(e) => setProfileSettings({...profileSettings, newPassword: e.target.value})}
                          placeholder="กรอกรหัสผ่านใหม่"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                        <Input 
                          id="confirmPassword" 
                          type={showPassword ? "text" : "password"}
                          value={profileSettings.confirmPassword}
                          onChange={(e) => setProfileSettings({...profileSettings, confirmPassword: e.target.value})}
                          placeholder="ยืนยันรหัสผ่านใหม่"
                        />
                      </div>
                    </div>

                    {profileSettings.newPassword && profileSettings.confirmPassword && (
                      <div className={`p-3 rounded-lg ${
                        profileSettings.newPassword === profileSettings.confirmPassword
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        {profileSettings.newPassword === profileSettings.confirmPassword ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">รหัสผ่านตรงกัน</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm">รหัสผ่านไม่ตรงกัน</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSaveProfile} className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    บันทึกข้อมูล
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsPage;
