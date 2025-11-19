import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Upload, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ReportPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    amount: '',
    workType: '',
    bankAccount: '',
    bankName: '',
    reportedBy: '',
    transferDate: '',
    postedDate: '',
    offense: '',
    description: '',
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.offense || !formData.reportedBy) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    // Create new entry
    const newEntry = {
      id: Date.now(),
      ...formData,
      reportId: Date.now().toString().slice(-6),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      images: images.map(img => img.url),
      reportCount: 1,
      totalAmount: parseInt(formData.amount) || 0,
    };

    // Save to localStorage
    const storedBlacklist = localStorage.getItem('technician-blacklist');
    const blacklist = storedBlacklist ? JSON.parse(storedBlacklist) : [];
    blacklist.unshift(newEntry);
    localStorage.setItem('technician-blacklist', JSON.stringify(blacklist));

    toast({
      title: "✅ แจ้งข้อมูลสำเร็จ",
      description: "ขอบคุณที่แจ้งข้อมูล รายงานของคุณจะถูกตรวจสอบโดยเร็วที่สุด",
    });

    // Redirect to home
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>แจ้งข้อมูลบัญชีดำ - รู้ทันช่าง</title>
        <meta name="description" content="แจ้งข้อมูลช่างที่ทิ้งงานหรือมีพฤติกรรมไม่เหมาะสม" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl"
        >
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              แจ้งข้อมูลบัญชีดำ
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              กรุณากรอกข้อมูลให้ครบถ้วนและแนบหลักฐานที่เกี่ยวข้อง ข้อมูลของคุณจะถูกตรวจสอบก่อนเผยแพร่
            </p>
          </div>

          {/* Form */}
          <Card className="border-2 border-gray-900 shadow-xl">
            <CardHeader className="bg-gray-50 border-b-2 border-gray-900">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-gray-900" />
                ข้อมูลการแจ้ง
              </CardTitle>
              <CardDescription>
                กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1: ข้อมูลช่าง */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    ข้อมูลช่าง
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        ชื่อช่าง <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ชื่อ-นามสกุล หรือชื่อเล่น"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idCard">เลขบัตรประชาชน</Label>
                      <Input
                        id="idCard"
                        name="idCard"
                        value={formData.idCard}
                        onChange={handleInputChange}
                        placeholder="x-xxxx-xxxxx-xx-x"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: ข้อมูลการทำงาน */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    ข้อมูลการทำงาน
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workType">งานที่จ้าง</Label>
                      <Input
                        id="workType"
                        name="workType"
                        value={formData.workType}
                        onChange={handleInputChange}
                        placeholder="เช่น งานไฟฟ้า, ปูกระเบื้อง"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">ยอดเงิน (บาท)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offense">
                      พฤติกรรมที่ถูกแจ้ง <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="offense"
                      name="offense"
                      value={formData.offense}
                      onChange={handleInputChange}
                      placeholder="เช่น ทิ้งงาน, โกงเงิน, งานไม่เรียบร้อย"
                      required
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="อธิบายรายละเอียดเพิ่มเติมเกี่ยวกับเหตุการณ์..."
                      rows={4}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                {/* Section 3: ข้อมูลการโอนเงิน */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    ข้อมูลการโอนเงิน
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">เลขบัญชี</Label>
                      <Input
                        id="bankAccount"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        placeholder="xxx-x-xxxxx-x"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">ธนาคาร</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="เช่น ธนาคารกสิกรไทย"
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transferDate">วันที่โอนเงิน</Label>
                      <Input
                        id="transferDate"
                        name="transferDate"
                        type="date"
                        value={formData.transferDate}
                        onChange={handleInputChange}
                        className="border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postedDate">วันที่เริ่มงาน/ตกลง</Label>
                      <Input
                        id="postedDate"
                        name="postedDate"
                        type="date"
                        value={formData.postedDate}
                        onChange={handleInputChange}
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: ข้อมูลผู้แจ้ง */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    ข้อมูลผู้แจ้ง
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reportedBy">
                      ชื่อผู้แจ้ง / เพจ <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="reportedBy"
                      name="reportedBy"
                      value={formData.reportedBy}
                      onChange={handleInputChange}
                      placeholder="ชื่อของคุณหรือชื่อเพจ"
                      required
                      className="border-gray-300"
                    />
                  </div>
                </div>

                {/* Section 5: อัปโหลดรูปภาพ */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    หลักฐานภาพถ่าย
                  </h3>
                  
                  <div className="space-y-2">
                    <Label>อัปโหลดรูปภาพ (สูงสุด 10 รูป)</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG หรือ JPEG</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">ข้อควรระวัง:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>ข้อมูลที่คุณแจ้งจะถูกตรวจสอบความถูกต้องก่อนเผยแพร่</li>
                        <li>การแจ้งข้อมูลเท็จอาจมีความผิดตามกฎหมาย</li>
                        <li>กรุณาแนบหลักฐานที่ชัดเจนและเป็นจริง</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1 border-gray-300"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    ส่งข้อมูล
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ReportPage;

