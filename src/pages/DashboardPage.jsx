import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  DollarSign,
  Eye,
  ArrowRight,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
  UserPlus,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const initialBlacklist = [
  { id: 1, name: 'สมชาย ทิ้งงาน', offense: 'รับเงินมัดจำแล้วหาย', reportedBy: 'สมหญิง', date: '2025-10-28', status: 'approved' },
  { id: 2, name: 'ประวิทย์ ไม่มา', offense: 'งานไม่เรียบร้อย ของไม่ตรงสเปค', reportedBy: 'สมศักดิ์', date: '2025-10-20', status: 'pending' },
  { id: 3, name: 'มานะ โกงเงิน', offense: 'เบิกเงินเกินจริง', reportedBy: 'สมศรี', date: '2025-09-15', status: 'rejected' },
  { id: 4, name: 'ชาติชาย วัสดุปลอม', offense: 'ใช้วัสดุปลอม', reportedBy: 'สมปอง', date: '2025-11-01', status: 'pending' },
  { id: 5, name: 'ใจดี ไม่รับผิดชอบ', offense: 'ทำงานเสียหายแล้วไม่รับผิดชอบ', reportedBy: 'สมหวัง', date: '2025-11-04', status: 'pending' },
];

export function DashboardPage() {
  const { user } = useAuth();
  
  // In a real app, this would be fetched from an API
  const blacklist = initialBlacklist;

  const stats = useMemo(() => ({
      total: blacklist.length,
      pending: blacklist.filter(e => e.status === 'pending').length,
      approved: blacklist.filter(e => e.status === 'approved').length,
      rejected: blacklist.filter(e => e.status === 'rejected').length,
  }), [blacklist]);

  // Mock data for activity
  const recentActivities = [
    { id: 1, action: 'อนุมัติรายงาน', target: 'สมชาย ทิ้งงาน', time: '5 นาทีที่แล้ว', type: 'approved' },
    { id: 2, action: 'เพิ่มรายงานใหม่', target: 'ใจดี ไม่รับผิดชอบ', time: '15 นาทีที่แล้ว', type: 'new' },
    { id: 3, action: 'ปฏิเสธรายงาน', target: 'มานะ โกงเงิน', time: '1 ชั่วโมงที่แล้ว', type: 'rejected' },
    { id: 4, action: 'แก้ไขรายงาน', target: 'ชาติชาย วัสดุปลอม', time: '2 ชั่วโมงที่แล้ว', type: 'edit' },
  ];

  // Pending reports
  const pendingReports = blacklist.filter(e => e.status === 'pending');

  return (
    <>
      <Helmet>
        <title>ภาพรวม - แดชบอร์ดแอดมิน</title>
        <meta name="description" content="ภาพรวมและสถิติของระบบบัญชีดำช่าง" />
      </Helmet>
      <motion.div
        key="dashboard-overview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">ภาพรวมระบบ</h1>
            <p className="text-gray-600 mt-1">สรุปข้อมูลคำร้องและสถิติที่สำคัญ</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-gray-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">รายงานทั้งหมด</CardTitle>
                <Activity className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <p className="text-xs text-gray-600 mt-1">จำนวนรายงานในระบบ</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% จากเดือนที่แล้ว</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-500 bg-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">รอตรวจสอบ</CardTitle>
                <Clock className="h-4 w-4 text-yellow-700" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
                <p className="text-xs text-yellow-700 mt-1">ต้องดำเนินการ</p>
                {stats.pending > 0 && (
                  <Link to="/dashboard/blacklist">
                    <Button size="sm" variant="outline" className="mt-2 text-xs h-7 border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                      ตรวจสอบเลย <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">อนุมัติแล้ว</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-700" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
                <p className="text-xs text-green-700 mt-1">แสดงในหน้าสาธารณะ</p>
                <div className="mt-2 text-xs text-green-700">
                  {Math.round((stats.approved / stats.total) * 100)}% ของทั้งหมด
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">ปฏิเสธ</CardTitle>
                <XCircle className="h-4 w-4 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
                <p className="text-xs text-red-700 mt-1">ไม่ผ่านการตรวจสอบ</p>
                <div className="mt-2 text-xs text-red-700">
                  {Math.round((stats.rejected / stats.total) * 100)}% ของทั้งหมด
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activities */}
            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  กิจกรรมล่าสุด
                </CardTitle>
                <CardDescription>กิจกรรมที่เกิดขึ้นในระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        activity.type === 'approved' ? 'bg-green-500' :
                        activity.type === 'rejected' ? 'bg-red-500' :
                        activity.type === 'new' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">{activity.target}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard/blacklist">
                  <Button variant="outline" className="w-full mt-4 border-gray-900">
                    ดูทั้งหมด <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pending Reports */}
            <Card className="border-2 border-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  รายงานที่รอดำเนินการ
                </CardTitle>
                <CardDescription>รายงานที่ต้องตรวจสอบด่วน</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingReports.length > 0 ? (
                  <div className="space-y-3">
                    {pendingReports.slice(0, 4).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                          <p className="text-xs text-gray-600 truncate">{report.offense}</p>
                          <p className="text-xs text-gray-500 mt-1">โดย: {report.reportedBy}</p>
                        </div>
                        <Link to="/dashboard/blacklist">
                          <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <Link to="/dashboard/blacklist">
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        ตรวจสอบทั้งหมด ({pendingReports.length}) <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="font-medium">ไม่มีรายงานที่รอดำเนินการ</p>
                    <p className="text-sm">คุณได้ตรวจสอบรายงานทั้งหมดแล้ว</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="border-2 border-gray-900">
            <CardHeader>
              <CardTitle>สถิติเบื้องต้น</CardTitle>
              <CardDescription>ข้อมูลสรุปประจำเดือน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Eye className="h-8 w-8 text-gray-900" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-gray-600">จำนวนผู้เข้าชม</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="h-8 w-8 text-gray-900" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                    <p className="text-xs text-gray-600">ผู้ใช้งานระบบ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">+25%</p>
                    <p className="text-xs text-gray-600">เติบโตจากเดือนที่แล้ว</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
}