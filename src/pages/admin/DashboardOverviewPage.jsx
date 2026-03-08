import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    Users,
    ShieldAlert,
    Star,
    FileText,
    TrendingUp,
    TrendingDown,
    Clock,
    ArrowUpRight,
    MoreHorizontal,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const data = [
    { name: 'ม.ค.', reports: 65, verified: 40 },
    { name: 'ก.พ.', reports: 59, verified: 48 },
    { name: 'มี.ค.', reports: 80, verified: 62 },
    { name: 'เม.ย.', reports: 81, verified: 75 },
    { name: 'พ.ค.', reports: 56, verified: 82 },
    { name: 'มิ.ย.', reports: 45, verified: 90 },
];

const categoryData = [
    { name: 'ช่างไฟฟ้า', value: 400 },
    { name: 'ช่างประปา', value: 300 },
    { name: 'ช่างแอร์', value: 500 },
    { name: 'ช่างก่อสร้าง', value: 200 },
];

const DashboardOverviewPage = () => {
    return (
        <div className="space-y-6 pb-10">
            <Helmet>
                <title>แผงควบคุม | CheckChang Admin</title>
            </Helmet>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">สวัสดีครับ แอดมิน 👋</h1>
                    <p className="text-gray-500 mt-0.5 text-xs font-medium">นี่คือภาพรวมข้อมูลทั้งหมดในระบบ CheckChang ของวันนี้</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl px-4 h-10 border-gray-200 text-xs font-bold gap-2">
                        <Calendar className="h-4 w-4" /> เลือกช่วงเวลา
                    </Button>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-5 h-10 shadow-lg transition-all hover:-translate-y-0.5 text-xs font-bold">
                        <Plus className="mr-2 h-4 w-4" /> สร้างรายงานสรุป
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'ผู้ใช้งานทั้งหมด', value: '2,845', icon: Users, color: 'blue', trend: '+12.5%', isUp: true },
                    { label: 'ช่างโดนแบล็คลิสต์', value: '142', icon: ShieldAlert, color: 'red', trend: '+3.2%', isUp: true },
                    { label: 'ช่างรับงานดี', value: '528', icon: Star, color: 'orange', trend: '+8.4%', isUp: true },
                    { label: 'รายงานรอดำเนินการ', value: '24', icon: FileText, color: 'green', trend: '-2.1%', isUp: false },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden group hover:scale-[1.02] transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">สถิติการรายงาน & ช่างแนะนำ</CardTitle>
                            <CardDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">เปรียบเทียบข้อมูล 6 เดือนล่าสุด</CardDescription>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#FF6B35]"></div>
                                <span className="text-[10px] font-bold text-gray-500">รายงาน</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-[10px] font-bold text-gray-500">ช่างผ่านการยืนยัน</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-6">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: '700' }}
                                    />
                                    <Area type="monotone" dataKey="reports" stroke="#FF6B35" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                                    <Area type="monotone" dataKey="verified" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVerified)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories / Top Performers */}
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-2">
                        <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">ช่างตามหมวดหมู่</CardTitle>
                        <CardDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ช่างที่ลงทะเบียนในระบบ</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: 'ช่างแอร์', value: 85, color: '#3b82f6', count: '524' },
                            { label: 'ช่างไฟฟ้า', value: 65, color: '#f59e0b', count: '412' },
                            { label: 'ช่างประปา', value: 45, color: '#10b981', count: '286' },
                            { label: 'ช่างก่อสร้าง', value: 30, color: '#ef4444', count: '145' },
                        ].map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-bold">
                                    <span className="text-gray-900 tracking-tight">{cat.label}</span>
                                    <span className="text-gray-400 uppercase tracking-widest">{cat.count} คน</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${cat.value}%`, backgroundColor: cat.color }}></div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 mt-6 border-t border-gray-50">
                            <Button variant="ghost" className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 gap-2">
                                ดูสถิติแยกตามพื้นที่ <ArrowUpRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">ความเคลื่อนไหวล่าสุด</CardTitle>
                            <CardDescription className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">รายงานและกิจกรรม 24 ชม. ที่ผ่านมา</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full text-gray-400">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 space-y-5">
                        {[
                            { user: 'คุณวิทย์', action: 'รายงานช่างทิ้งงาน', time: '5 นาทีที่แล้ว', type: 'report', status: 'danger' },
                            { user: 'แอดมินเอก', action: 'อนุมัติช่างแนะนำใหม่', time: '1 ชม. ที่แล้ว', type: 'verify', status: 'success' },
                            { user: 'สมพงษ์ การช่าง', action: 'ส่งเอกสารยืนยันตัวตน', time: '3 ชม. ที่แล้ว', type: 'document', status: 'warning' },
                            { user: 'แอดมินนุช', action: 'ระงับการใช้งาน user041', time: '5 ชม. ที่แล้ว', type: 'admin', status: 'danger' },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${act.status === 'danger' ? 'bg-red-500' :
                                    act.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                <div className="flex-grow">
                                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">{act.user} <span className="font-medium text-gray-500">{act.action}</span></p>
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-1">
                                        <Clock className="h-3 w-3" /> {act.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none bg-gray-900 rounded-[1.5rem] overflow-hidden text-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B35]/20 to-transparent blur-3xl rounded-full -mr-20 -mt-20"></div>
                    <CardHeader className="p-8 pb-2 relative z-10">
                        <CardTitle className="text-lg font-bold text-white tracking-tight">จัดการเร่งด่วน</CardTitle>
                        <CardDescription className="text-[10px] text-white/50 font-bold uppercase tracking-wider">เมนูที่ต้องดำเนินการทันที</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-6 space-y-4 relative z-10">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 btn-glass flex items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">ตรวจสอบการแจ้งเหตุ (21)</p>
                                    <p className="text-[10px] text-white/40 font-medium tracking-tight">มีข้อมูลใหม่ที่รอการอนุมัติแบล็คลิสต์</p>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-gray-900 transition-all">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 btn-glass flex items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">ยืนยันตัวตนช่าง (8)</p>
                                    <p className="text-[10px] text-white/40 font-medium tracking-tight">ช่างส่งเอกสารเพื่อรับเหรียญช่างแนะนำ</p>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-gray-900 transition-all">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button className="flex-1 bg-white text-gray-900 hover:bg-gray-100 rounded-xl h-12 text-xs font-black shadow-lg">
                                รายงานประจำสัปดาห์
                            </Button>
                            <Button variant="outline" className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5 rounded-xl h-12 text-xs font-black">
                                ตั้งค่าการแจ้งเตือน
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardOverviewPage;
