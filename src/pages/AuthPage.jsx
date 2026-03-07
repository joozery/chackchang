import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/lib/hooks/use-auth';
import { Lock, User, Shield, FileText, Mail, Phone, Calendar, Image, Link2, MessageCircle, Upload, X } from 'lucide-react';
import logo from '@/assest/logo.jpg';

const AuthForm = ({ isLogin, onSubmit, isTechnician = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [registerAsTechnician, setRegisterAsTechnician] = useState(isTechnician);
  
  // Technician specific fields
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [lineId, setLineId] = useState('');
  const [facebookLink, setFacebookLink] = useState('');

  // Work types options
  const workTypes = [
    'ซ่อมบ้าน',
    'ทาสี',
    'ติดตั้งแอร์',
    'งานไฟฟ้า',
    'งานประปา',
    'ปูกระเบื้อง',
    'ทำหลังคา',
    'ตกแต่งภายใน',
    'ทำรั้ว',
    'อื่นๆ'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกรูปภาพเท่านั้น');
        return;
      }
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const toggleWorkType = useCallback((workType) => {
    setSelectedWorkTypes(prev => {
      if (prev.includes(workType)) {
        return prev.filter(type => type !== workType);
      } else {
        return [...prev, workType];
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && !acceptTerms) {
      alert('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }
    
    if (isLogin) {
      onSubmit(username, password);
    } else {
      const formData = {
        firstName,
        lastName,
        email,
        phone,
        birthDate,
        isTechnician: registerAsTechnician
      };

      if (registerAsTechnician) {
        // Validate technician fields
        if (!profileImage) {
          alert('กรุณาอัปโหลดรูปภาพโปรไฟล์');
          return;
        }
        if (selectedWorkTypes.length === 0) {
          alert('กรุณาเลือกประเภทงานอย่างน้อย 1 ประเภท');
          return;
        }
        
        formData.profileImage = profileImage;
        formData.workTypes = selectedWorkTypes;
        formData.lineId = lineId;
        formData.facebookLink = facebookLink;
      }

      onSubmit(username, password, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700">
            ชื่อผู้ใช้
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              id="username" 
              type="text" 
              placeholder="กรอกชื่อผู้ใช้" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            รหัสผ่าน
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              id="password" 
              type="password" 
              placeholder="กรอกรหัสผ่าน"
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
            />
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  ชื่อจริง
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="กรอกชื่อจริง" 
                    required 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  นามสกุล
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="กรอกนามสกุล" 
                    required 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                อีเมล
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                เบอร์โทรศัพท์
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="0xx-xxx-xxxx" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                วันเดือนปีเกิด
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  id="birthDate" 
                  type="date" 
                  required 
                  value={birthDate} 
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Technician Registration Option */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Checkbox 
                  id="technician" 
                  checked={registerAsTechnician}
                  onCheckedChange={(checked) => {
                    setRegisterAsTechnician(checked === true);
                  }}
                  className="mt-1"
                />
                <label 
                  htmlFor="technician" 
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1"
                >
                  <span className="font-semibold text-green-700">สมัครเป็นช่าง</span>
                  <span className="block text-gray-600 mt-1">
                    เลือกเพื่อสร้างโปรไฟล์ช่างและแสดงในระบบช่างรับงานดี
                  </span>
                </label>
              </div>
            </div>

            {/* Technician Additional Fields */}
            {registerAsTechnician && (
              <div className="space-y-5 pt-4 border-t border-gray-200">
                {/* Profile Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="profileImage" className="text-sm font-medium text-gray-700">
                    รูปภาพโปรไฟล์ <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    {profileImagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={profileImagePreview} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="profileImage"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากวาง
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (ขนาดไม่เกิน 5MB)</p>
                        </div>
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Work Types Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    ประเภทงานที่รับ <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">เลือกได้หลายประเภท</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {workTypes.map((workType) => {
                      const isSelected = selectedWorkTypes.includes(workType);
                      return (
                        <div
                          key={workType}
                          className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <Checkbox
                            id={`worktype-${workType}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleWorkType(workType)}
                          />
                          <label 
                            htmlFor={`worktype-${workType}`}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {workType}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Line ID */}
                <div className="space-y-2">
                  <Label htmlFor="lineId" className="text-sm font-medium text-gray-700">
                    Line ID
                  </Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      id="lineId" 
                      type="text" 
                      placeholder="กรอก Line ID (ถ้ามี)" 
                      value={lineId} 
                      onChange={(e) => setLineId(e.target.value)}
                      className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </div>

                {/* Facebook Link */}
                <div className="space-y-2">
                  <Label htmlFor="facebookLink" className="text-sm font-medium text-gray-700">
                    ลิงก์ Facebook
                  </Label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      id="facebookLink" 
                      type="url" 
                      placeholder="https://www.facebook.com/..." 
                      value={facebookLink} 
                      onChange={(e) => setFacebookLink(e.target.value)}
                      className="pl-10 h-11 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                  className="mt-1"
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                >
                  ฉันได้อ่านและยอมรับ{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-black font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    ข้อกำหนดและเงื่อนไขการใช้งาน
                  </button>
                </label>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full h-11 bg-black hover:bg-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
          type="submit"
          disabled={!isLogin && !acceptTerms}
        >
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </Button>
      </CardFooter>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              ข้อกำหนดและเงื่อนไขการใช้งาน
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <p className="mb-4">
                ตลอดเว็บไซด์นี้ คำว่า "ผู้ใช้บริการ" หมายถึงบุคคลใดๆที่เข้าถึงเว็บไซด์นี้
              </p>
              <p className="mb-4">
                คำว่า "ผู้ให้บริการ" หมายถึง www.ตรวจสอบช่าง.com
              </p>
              <p className="mb-4">
                การใช้เว็บไซต์นี้ต้องเป็นไปตามข้อตกลงและเงื่อนไขการใช้บริการต่อไปนี้ ซึ่งผู้ใช้บริการควรอ่านอย่างละเอียด การใช้เว็บไซต์หรือเข้าไปดูข้อมูลในหน้าใดๆ ถือว่าท่านยอมรับข้อกำหนดและเงื่อนไขการใช้งานที่ระบุไว้ในข้อกำหนดและเงื่อนไขการใช้งานนี้ หากผู้ใช้บริการไม่ยอมรับข้อตกลงในการใช้เว็บไซด์นี้ ผู้ใช้บริการต้องยุติการใช้เว็บไซด์นี้ทันที
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">ผู้ใช้บริการ (User)</h3>
              <p className="mb-3">
                ผู้ใช้บริการต้องนำเข้าข้อมูลที่สุจริต ถูกต้องและเป็นความจริง พร้อมทั้งมีข้อมูลประกอบที่เพียงพอ หากผู้ให้บริการตรวจสอบว่า ผู้ใช้บริการให้ข้อมูลอันเป็นเท็จ ผู้ให้บริการสามารถระงับการให้บริการได้ทันทีโดยไม่ต้องแจ้งล่วงหน้า ผู้ใช้บริการต้องรับผิดชอบต่อข้อมูลที่นำเข้าในระบบ ผู้ให้บริการไม่รับผิดชอบต่อข้อมูลที่ผู้ใช้บริการนำเข้า
              </p>
              <p className="mb-3">
                ผู้ใช้บริการต้องไม่ใช้เว็บไซด์นี้ในทางที่ผิดกฎหมาย หรือทำให้ผู้อื่นเสียหายเพื่อผลประโยชน์ส่วนตัว เว้นแต่เป็นการเตือนภัยเพื่อผลประโยชน์ต่อสาธารณะ
              </p>
              <p className="mb-3">
                โดยข้อมูลที่ถูกนำเข้า จะต้องเป็นของผู้ใช้บริการ หรือ ได้รับความยินยอมจากบุคคลที่เกี่ยวข้องแล้วเท่านั้น ทางผู้ให้บริการจะไม่รับผิดชอบต่อสิ่งที่ผู้ใช้บริการละเมิดและสร้างความเสียหายใดๆ กับผู้อื่นในทุกกรณี โดยจะถือว่าข้อมูลที่ผู้ใช้บริการนำเข้ามาใน ตรวจสอบช่าง.com เป็นความรับผิดชอบของผู้ใช้บริการนั้นๆแต่เพียงผู้เดียว
              </p>
              <p className="mb-3">
                ผู้ใช้บริการต้องไม่ใช้เว็บไซด์นี้เพื่อการโฆษณา การขายสินค้าและบริการ เผยแพร่ข้อมูลที่ไม่เหมาะสม หรือข้อมูลที่ผิดกฎหมาย
              </p>
              <p className="mb-3">
                ห้ามผู้ใช้บริการนำเข้าข้อมูลในเชิงข่มขู่ ใช้ภาษารุนแรง หยาบคาย ไม่สุภาพ หรือนำเข้าเรื่องส่วนตัวของบุคคลที่สาม
              </p>
              <p className="mb-3">
                ห้ามใช้ ตรวจสอบช่าง.com เพื่อผลประโยชน์ทางธุรกิจในทุกรูปแบบ ทั้งการแอบอ้าง หรือขายบริการต่อ หากผู้ใช้บริการก่อให้เกิดความเสียหาย ไม่ว่าทางใดทางหนึ่ง ผู้ให้บริการจะไม่รับผิดชอบต่อข้อเสียหายในทุกกรณี ทั้งนี้ผู้ให้บริการเปิดให้บริการเว็บไซต์ในรูปแบบ User-generated content
              </p>
              <p className="mb-3">
                หากพบว่าผู้ใช้บริการ ละเมิดข้อห้ามตามข้อตกลง หรือผิดต่อ พ.ร.บ.ว่าด้วยการกระทำผิด เกี่ยวกับระบบคอมพิวเตอร์ หรือ นำไปใช้ในทางที่ผิดต่อกฎหมายในราชอาณาจักรไทย ผู้ให้บริการที่ขอสงวนสิทธ์งดให้บริการแก่ผู้ใช้บริการผู้นั้นต่อไป รวมทั้งลบรายงานทั้งหมดของผู้ใช้บริการท่านนั้นทันที รวมถึงการเปิดเผยข้อมูลของผู้ใช้งานให้กับหน่วยงานที่ร้องขอตามที่กฎหมายระบุ
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">ผู้ให้บริการ (Service Provider)</h3>
              <p className="mb-3">
                ตรวจสอบช่าง.com ให้บริการเว็บไซต์ การสร้างรายงานโดยผู้ใช้งาน อีกทั้งบริการค้นหาข้อมูล แก่ผู้ใช้บริการทุกท่าน โดยไม่คิดค่าบริการใดๆ
              </p>
              <p className="mb-3">
                ผู้ให้บริการขอสงวนสิทธิ์อย่างเด็ดขาดในการเปลี่ยนแปลงหรือแก้ไขข้อตกลงและเงื่อนไขใดๆ ในการใช้บริการเว็บไซต์นี้ ไม่ว่าทั้งหมดหรือบางส่วน โดยไม่จำเป็นต้องแจ้งให้ผู้ใช้บริการทราบล่วงหน้า และการที่ผู้ใช้บริการยังคงใช้บริการเว็บไซต์นี้ย่อมถือว่าผู้ใช้บริการยินยอมผูกพันตามข้อตกลงและเงื่อนไขที่มีการเปลี่ยนแปลงหรือบังคับใช้แล้วทุกประการ หากพบว่าผู้ใช้บริการ ละเมิดข้อตกลงที่ได้กำหนดไว้ ผู้ให้บริการขอสงวนสิทธิ์ในการระงับการให้บริการ โดยมิต้องแจ้งให้ทราบล่วงหน้า
              </p>
              <p className="mb-3">
                เว็บไซต์มีระบบจะมีการตรวจจับการสะกดชื่อ การกรอกอักขระผิดต่างๆ รวมถึงการตรวจสอบชื่อโดยเปรียบเทียบกับสลิปโอนเงินที่แนบเข้ามาในรายงาน หากพบว่ามีการสะกดชื่อแตกต่างจากสลิปโอนเงินที่ได้ลงไว้ ระบบจะมีการแก้ไขข้อมูลอัตโนมัติ(เท่าที่ระบบจะสามารถทำได้) รวมทั้งแก้ไขข้อมูลที่เกิดจากการลงผิดพลาด เช่นการลงข้อมูลชื่อผู้บริสุทธิ์จากรูปบัตรประชาชนที่คนขายส่งมาเพื่อตั้งใจแอบอ้าง ทั้งนี้คำนึงถึงความถูกต้องของข้อมูลเป็นสำคัญ และเป็นการแก้ปัญหาการกรอกข้อมูลที่ไม่ถูกต้อง เพื่อป้องกันปัญหาที่จะเกิดกับผู้บริสุทธิ์
              </p>
              <p className="mb-3">
                เว็บไซต์มีระบบที่คอยตรวจสอบและประมวลผลข้อมูลที่นำเข้าจากผู้ใช้บริการเป็นประจำทุกวัน โดยจะมีทั้งทีมงานตรวจคุณภาพรายงาน และ AI ที่เป็นระบบ automation หากพบว่ารายงานใดที่มีหลักฐานไม่เพียงพอ หรือนำเข้าข้อมูลรายงานที่ผิดเงื่อนไขของเว็บไซต์ ระบบจะทำการลบรายงานนั้นทิ้งทันที โดยไม่ต้องแจ้งให้ทราบล่วงหน้า (โดยผู้ใช้งานจะเห็นข้อความว่ามีรายงานบางส่วนที่ผิดเงื่อนไข ที่หน้า profile ของแต่ละผู้ใช้งาน)
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">การติดต่อเพื่อรับผิดชอบความเสียหายจากการฉ้อโกงออนไลน์ (Reimbursement)</h3>
              <p className="mb-3">
                ผู้ให้บริการไม่มีส่วนเกี่ยวข้องกับการซื้อขายใดๆ นั่นเป็นเหตุระหว่างผู้ใช้บริการกับผู้ขาย ผู้ใช้บริการต้องรับผิดชอบต่อการซื้อขายของตนเอง หากผู้ใช้บริการได้รับความเสียหายจากการซื้อขายใดๆ ผู้ใช้บริการต้องติดต่อผู้ขายโดยตรง ผู้ให้บริการไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดขึ้นจากการซื้อขาย
              </p>
              <p className="mb-3">
                ในกรณีที่ได้รับการติดต่อจากคนขายผ่านทางช่องทางการติดต่อของเว็บไซต์ โดยมีเจตนาเพื่อขอรับผิดชอบยอดความเสียหายตามหลักฐานในรายงาน เมื่อตรวจสอบเจตนาของคนขายอย่างชัดเจนแล้ว ทางทีมงานจะให้ติดต่อกับคนสร้างรายงานเพื่อเคลียร์ปัญหากันโดยตรง โดยผ่านรายละเอียดช่องทางการติดต่อที่มีในระบบ เช่น เฟสบุ๊ค อีเมล ไลน์ หรือ เบอร์โทร โดยการให้ข้อมูลเพื่อไปรับผิดชอบ ทางทีมงานจะให้ข้อมูลการติดต่ออย่างจำเป็นเท่านั้น ทั้งนี้เพื่อปกป้องผลประโยชน์และความเป็นส่วนตัวของผู้ใช้บริการ โดยเมื่อผู้ใช้บริการได้รับการรับผิดชอบตามสมควร เช่นได้เงินคืน หรือได้รับสินค้า ผู้ใช้บริการจะต้องรับผิดชอบในการลบข้อมูลที่ได้สร้างเข้ามา
              </p>
              <p className="mb-3">
                หากคนขายต้องการรับผิดชอบยอดความเสียหายเพื่อนำชื่อออกจากระบบ แต่มีเหตุสุดวิสัยที่ไม่สามารถติดต่อกับคนสร้างรายงานเพื่อรับผิดชอบคืนเงินได้ เพื่อความเป็นธรรมต่อคนขายในการเอาชื่อออก และผลประโยชน์ต่อคนสร้างรายงาน ตรวจสอบช่าง จะให้ชดใช้ค่าเสียหายผ่านทางระบบ พร้อมทั้งบันทึกประวัติการคืน และกันยอดความรับผิดชอบไว้ เพื่อส่งคืนผู้เสียหายหรือผู้ใช้บริการ เมื่อสามารถติดต่อได้
              </p>
              <p className="mb-3">
                ในกรณีมีการชดใช้ค่าเสียหาย ผู้ใช้บริการสามารถติดต่อขอรับเงินคืนได้ผ่านช่องทางการติดต่อที่มีในระบบ โดยยอดชดใช้ที่ได้รับ จะมีการหักค่าธรรมเนียมที่เกิดขึ้นจากธุรกรรมการชดใช้ค่าเสียหายที่เกิดจาก payment gateway
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">การปฏิเสธความรับผิดและข้อจำกัดความรับผิด (Disclaimer Policy)</h3>
              <p className="mb-3">
                ผู้ให้บริการไม่รับรองหรือรับประกัน และขอปฏิเสธความรับผิดชอบต่อข้อมูลใดๆที่ผู้ใช้บริการนำเข้ามา ไม่ว่าโดยชัดแจ้งหรือโดยปริยาย ทั้งความถูกต้อง ความเหมาะสม ความน่าเชื่อถือ การมีอยู่และใช้งานได้ ของข้อมูลและ/หรือเนื้อหาตลอดจนส่วนประกอบต่างๆ ที่มีอยู่ในเว็บไซต์นี้ โดยข้อมูลที่ปรากฏในเว็บไซด์แห่งนี้ จะตกความรับผิดชอบของผู้ใช้บริการผู้นำเสนอข้อมูลนั้นๆ แต่เพียงผู้เดียว โดยข้อมูลในเว็บไซด์นี้เป็นข้อมูลที่มีให้ "ตามสภาพเท่าที่เป็น" และ "เท่าที่อยู่" ซึ่งกระทำผ่านเครื่องคอมพิวเตอร์อัตโนมัติทั้งหมดเท่านั้น ทางเว็บไซด์ไม่รับประกัน หรือรับรองว่าข้อมูลที่ถูกนำเข้ามาจะสมบูรณ์และถูกต้อง และเชื่อถือได้เป็นปัจจุบัน อย่างไรก็ตาม หากผู้ใช้บริการพบข้อมูลที่ไม่เหมาะสม หรือไม่เป็นความจริง ผู้ใช้บริการสามารถร้องเรียนรายงานที่ไม่เหมาะสมได้
              </p>
              <p className="mb-3">
                ผู้ให้บริการจะไม่รับผิดชอบต่อความสูญเสียหรือความเสียหายใดๆ ที่เกิดขึ้น ไม่ว่าโดยตรงหรือโดยอ้อม รวมถึงความเสียหายอันเป็นผลสืบเนื่อง ความเสียหายเกี่ยวเนื่อง และความเสียหายซึ่งไม่ใช่ผลอันอาจคาดหมายได้โดยตรง จากข้อมูลที่นำเข้าและการใช้บริการเว็บไซต์นี้
              </p>
              <p className="mb-3">
                ผู้ให้บริการมีระบบตรวจสอบและแก้ไขข้อมุลที่นำเข้า เพื่อรักษาความถูกต้องของข้อมูล (Data Integrity) อย่างเต็มที่สุดความสามารถ อย่างไรก็ตาม ผู้ให้บริการไม่สามารถไม่รับประกันว่าเว็บไซด์นี้จะทำงานได้อย่างต่อเนื่อง หรือปราศจากข้อผิดพลาด รวมถึง ข้อมูลที่แสดงในเว็บไซด์นี้จะถูกต้อง ครบถ้วน หรือเป็นปัจจุบัน
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">การเปลี่ยนแปลงเว็บไซต์และข้อตกลงในการใช้เว็บไซต์</h3>
              <p className="mb-3">
                ผู้ให้บริการสงวนสิทธิในการเปลี่ยนแปลง หรือระงับการใช้เว็บไซต์และข้อตกลงในการใช้เว็บไซต์นี้ไม่ว่าในเวลาใดๆ โดยอาจจะบอกกล่าวหรือมิต้องบอกกล่าวแก่ผู้ใช้บริการ และปราศจากความผิดต่อผู้ใช้บริการหรือต่อบุคคลภายนอกใดๆ หากผู้ใช้บริการยังคงใช้เว็บไซต์นี้ต่อไป เมื่อมีความเปลี่ยนแปลงใดๆ ย่อมถือว่าผู้ใช้บริการได้รับยอมรับความเปลี่ยนแปลงดังกล่าวแล้ว
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">การละเมิดข้อตกลงในการใช้เว็บไซต์</h3>
              <p className="mb-3">
                ผู้ให้บริการสงวนสิทธิที่จะได้รับการเยียวยาที่มีขึ้นโดยกฎหมายและในกรณีที่มีการละเมิดข้อตกลงนี้ รวมถึงสิทธิที่จะระงับการเข้าถึงเว็บไซต์ทางอินเทอร์เน็ต
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">กฎหมายที่บังคับใช้</h3>
              <p className="mb-3">
                การกดยอมรับ หมายถึงผู้ใช้ยินยอมตามนโยบาย พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล ข้อตกลงในการใช้เว็บไซต์นี้ให้เป็นไปตามกฎหมายไทย และไม่อยู่ภายใต้การขัดกันแห่งกฎหมาย ตั้งแต่ 1 มิถุนายน 2565 ทางเว็บไซด์ได้มีการกำหนดมาตรการในการรักษาและใช้งานข้อมูลส่วนบุคคลของผู้ใช้งาน ประกอบกับจำกัดประเภทข้อมูลที่ผู้ใช้งานสามารถนำเข้ามาในระบบ โดยสามารถอ่านข้อกำหนด PDPA เพิ่มเติมได้ที่ PDPA Policy ขอให้อ่านและทำความเข้าใจอย่างละเอียด
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">ข้อร้องเรียน (Complaint)</h3>
              <p className="mb-3">
                หากผู้ใช้บริการมีคำถามหรือต้องการร้องเรียน โปรดติดต่อผู้ดูแลเว็บไซต์ ที่ admin@ตรวจสอบช่าง.com
              </p>
            </section>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setShowTerms(false)}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                ปิด
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export function AuthPage() {
  const { login, register } = useAuth();
  const [searchParams] = useSearchParams();
  const isTechnicianParam = searchParams.get('register') === 'technician';
  const [defaultTab, setDefaultTab] = useState('login');

  useEffect(() => {
    if (isTechnicianParam) {
      setDefaultTab('register');
    }
  }, [isTechnicianParam]);

  return (
    <>
      <Helmet>
        <title>เข้าสู่ระบบ - รู้ทันช่าง</title>
        <meta name="description" content="เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานระบบตรวจสอบช่างมืออาชีพ" />
      </Helmet>
      
      {/* Background with gradient */}
      <div className="min-h-full relative flex items-center justify-center p-4 pt-32 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-900/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-800/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          key="auth-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg relative z-10"
        >
          {/* Logo and Title */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-900 rounded-2xl blur-lg opacity-30"></div>
              <img 
                src={logo} 
                alt="รู้ทันช่าง Logo" 
                className="h-20 w-20 object-contain rounded-2xl shadow-2xl relative z-10 ring-4 ring-white"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              รู้ทันช่าง
            </h1>
            <p className="text-gray-600 text-sm">ระบบตรวจสอบช่างมืออาชีพ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white shadow-md p-1 h-12">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-medium transition-all duration-300"
                >
                  เข้าสู่ระบบ
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-black data-[state=active]:text-white font-medium transition-all duration-300"
                >
                  สมัครสมาชิก
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90">
                  <CardHeader className="space-y-1 pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</CardTitle>
                    <CardDescription className="text-gray-600">
                      กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ
                    </CardDescription>
                  </CardHeader>
                  <AuthForm isLogin={true} onSubmit={login} />
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/90 max-h-[90vh] overflow-y-auto">
                  <CardHeader className="space-y-1 pb-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
                    <CardTitle className="text-2xl font-bold text-gray-900">สมัครสมาชิก</CardTitle>
                    <CardDescription className="text-gray-600">
                      สร้างบัญชีใหม่เพื่อเริ่มใช้งาน
                    </CardDescription>
                  </CardHeader>
                  <AuthForm isLogin={false} onSubmit={register} isTechnician={isTechnicianParam} />
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              <Shield className="inline-block h-4 w-4 mr-1" />
              ข้อมูลของคุณได้รับการปกป้องอย่างปลอดภัย
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}