import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/lib/hooks/use-auth';
import { Lock, Shield, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import logo from '@/assest/logo.jpg';

export function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // login handles navigation
    } catch (err) {
      setError(err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>เข้าสู่ระบบผู้ดูแล - รู้ทันช่าง</title>
        <meta name="description" content="เข้าสู่ระบบสำหรับผู้ดูแลระบบ" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors flex items-center gap-1.5 group z-10"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs">กลับหน้าหลัก</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          <Card className="border-2 border-white/20 bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-3 pb-4">
              {/* Logo */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-white/10 p-3 rounded-xl backdrop-blur-sm ring-2 ring-white/20">
                    <Shield className="h-8 w-8 text-red-500" />
                  </div>
                </motion.div>
              </div>

              {/* Title */}
              <div className="text-center space-y-1.5">
                <Badge variant="secondary" className="bg-red-600/20 text-red-400 border-red-600/30 text-xs">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  Admin Access Only
                </Badge>
                <CardTitle className="text-xl font-bold text-white">
                  ระบบผู้ดูแล
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  เข้าสู่ระบบจัดการหลังบ้าน
                </CardDescription>
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-yellow-400 leading-tight">
                    หน้านี้สำหรับผู้ดูแลระบบเท่านั้น การเข้าถึงโดยไม่ได้รับอนุญาตจะถูกบันทึก
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-600/20 border border-red-600/50 text-red-400 px-3 py-2 rounded-lg text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-medium text-gray-300">
                    ชื่อผู้ใช้
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="กรอกชื่อผู้ใช้"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-9 bg-white/5 border-white/20 text-white text-sm placeholder:text-gray-500 focus:border-red-600 focus:ring-red-600"
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-gray-300">
                    รหัสผ่าน
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="กรอกรหัสผ่าน"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 bg-white/5 border-white/20 text-white text-sm placeholder:text-gray-500 focus:border-red-600 focus:ring-red-600 pr-9"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-9 px-2.5 text-gray-400 hover:text-white hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-9 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>กำลังตรวจสอบ...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      <span>เข้าสู่ระบบผู้ดูแล</span>
                    </div>
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 mt-3">
                  <p className="text-[10px] text-gray-400 text-center mb-1.5">
                    🔑 ข้อมูลทดสอบ (Demo)
                  </p>
                  <div className="space-y-0.5 text-[11px] text-gray-500 font-mono text-center">
                    <p>Username: <span className="text-red-400">admin</span></p>
                    <p>Password: <span className="text-red-400">admin</span></p>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-gray-900 px-2 text-gray-500">สำหรับผู้ใช้ทั่วไป</span>
                  </div>
                </div>

                {/* User Login Link */}
                <Link to="/auth">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 text-sm border-white/20 text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    ไปหน้าเข้าสู่ระบบผู้ใช้ทั่วไป
                  </Button>
                </Link>
              </form>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
              <Lock className="h-3 w-3" />
              <span>การเชื่อมต่อของคุณถูกเข้ารหัสและปลอดภัย</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

