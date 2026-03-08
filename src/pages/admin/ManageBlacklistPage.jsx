import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import blacklistService from '@/services/blacklistService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/use-auth';
import {
  PlusCircle,
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'ม.ค.', reports: 40, approved: 24 },
  { name: 'ก.พ.', reports: 30, approved: 13 },
  { name: 'มี.ค.', reports: 20, approved: 98 },
  { name: 'เม.ย.', reports: 27, approved: 39 },
  { name: 'พ.ค.', reports: 18, approved: 48 },
  { name: 'มิ.ย.', reports: 23, approved: 38 },
  { name: 'ก.ค.', reports: 34, approved: 43 },
  { name: 'ส.ค.', reports: 45, approved: 20 },
];

const ReportForm = ({ onAddEntry, editEntry, onEditEntry, open, setOpen }) => {
  const [name, setName] = useState('');
  const [offense, setOffense] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (editEntry) {
      setName(editEntry.name);
      setOffense(editEntry.offense);
    } else {
      setName('');
      setOffense('');
    }
  }, [editEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !offense) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        variant: "destructive",
      });
      return;
    }

    if (editEntry) {
      onEditEntry(editEntry.id, { name, offense });
      toast({ title: "อัปเดตข้อมูลสำเร็จ" });
    } else {
      const newEntry = {
        id: Date.now(),
        name,
        offense,
        reportedBy: user?.username || 'System',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      onAddEntry(newEntry);
      toast({ title: "ส่งรายงานสำเร็จ" });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-xl px-5 h-11 shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5">
          <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มรายงานใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-2xl border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-gray-900 p-6 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editEntry ? 'แก้ไขรายงาน' : 'เพิ่มรายชื่อบัญชีดำ'}</DialogTitle>
            <DialogDescription className="text-gray-400 mt-1 text-xs">
              กรอกรายละเอียดพฤติกรรมของช่างเพื่อรักษาความปลอดภัยของชุมชน
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-gray-700">ชื่อ-นามสกุล ช่าง</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="ชื่อจริง หรือนามแฝง" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="offense" className="text-xs font-bold text-gray-700">รายละเอียดพฤติกรรม</Label>
              <Input id="offense" value={offense} onChange={(e) => setOffense(e.target.value)} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="เช่น รับเงินมัดจำแล้วหาย, ทิ้งงาน" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" className="rounded-lg px-6 h-10 text-xs font-bold" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-lg px-8 h-10 shadow-lg shadow-orange-100 text-xs font-bold">
              {editEntry ? 'บันทึกการแก้ไข' : 'ยืนยันและบันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ManageBlacklistPage = () => {
  const { user } = useAuth();
  const [blacklist, setBlacklist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        setLoading(true);
        const data = await blacklistService.getAll({ status: statusFilter, search: searchTerm });
        setBlacklist(data);
      } catch (error) {
        console.error('Error:', error);
        setBlacklist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlacklist();
  }, [statusFilter, searchTerm]);

  const addEntry = async (newEntry) => {
    try {
      await blacklistService.create(newEntry);
      const data = await blacklistService.getAll({ status: statusFilter });
      setBlacklist(data);
    } catch (error) { console.error(error); }
  };

  const handleEditEntry = async (id, updatedData) => {
    try {
      await blacklistService.update(id, updatedData);
      setBlacklist(blacklist.map(entry => entry.id === id ? { ...entry, ...updatedData } : entry));
      setEditEntry(null);
    } catch (error) { console.error(error); }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      try {
        await blacklistService.delete(id);
        setBlacklist(blacklist.filter(entry => entry.id !== id));
        toast({ title: "ลบข้อมูลเรียบร้อยแล้ว" });
      } catch (error) { console.error(error); }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await blacklistService.updateStatus(id, newStatus);
      setBlacklist(blacklist.map(entry => entry.id === id ? { ...entry, status: newStatus } : entry));
      toast({ title: "อัปเดตสถานะสำเร็จ" });
    } catch (error) { console.error(error); }
  };

  const paginatedBlacklist = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return blacklist.slice(startIndex, startIndex + itemsPerPage);
  }, [blacklist, currentPage]);

  const stats = useMemo(() => ({
    total: blacklist.length,
    pending: blacklist.filter(e => e.status === 'pending').length,
    approved: blacklist.filter(e => e.status === 'approved').length,
    rejected: blacklist.filter(e => e.status === 'rejected').length,
  }), [blacklist]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return { bg: 'bg-green-50/70', text: 'text-green-600', dot: 'bg-green-500', label: 'อนุมัติแล้ว' };
      case 'pending': return { bg: 'bg-orange-50/70', text: 'text-orange-600', dot: 'bg-orange-500', label: 'รอดำเนินการ' };
      case 'rejected': return { bg: 'bg-red-50/70', text: 'text-red-700', dot: 'bg-red-500', label: 'ติดธง/ปฏิเสธ' };
      default: return { bg: 'bg-gray-50/70', text: 'text-gray-600', dot: 'bg-gray-500', label: 'ไม่ระบุ' };
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <Helmet>
        <title>จัดการบัญชีดำช่าง | CheckChang Admin</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">จัดการบัญชีดำ</h1>
          <p className="text-gray-500 mt-0.5 text-xs font-medium">ตรวจสอบและบริหารจัดการรายชื่อช่างที่มีพฤติกรรมไม่เหมาะสมในระบบ</p>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview Grid - REMOVED to separate from Dashboard */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">รายการทั้งหมด</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{stats.total} รายการ</p>
          </div>
          <div className="h-8 w-px bg-gray-100"></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">รอดำเนินการ</p>
            <p className="text-xl font-black text-orange-500 mt-0.5">{stats.pending} รายการ</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-10 text-xs font-bold border-gray-100">
            <Download className="mr-2 h-3.5 w-3.5" /> ส่งออก Excel
          </Button>
        </div>
      </div>

      {/* Main Table Section */}
      <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">สารบบบัญชีดำช่าง</CardTitle>
              <CardDescription className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">จัดการฐานข้อมูลกลาง</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาชื่อช่าง..."
                  className="pl-9 rounded-xl bg-gray-50 border-none py-4 text-xs h-10 focus-visible:ring-1 focus-visible:ring-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ReportForm
                onAddEntry={addEntry}
                editEntry={editEntry}
                onEditEntry={handleEditEntry}
                open={dialogOpen}
                setOpen={setDialogOpen}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">ข้อมูลช่าง</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">กรณีที่แจ้ง</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 text-center">สถานะ</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 text-center">วันที่รายงาน</TableHead>
                  <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 text-right">ดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBlacklist.length > 0 ? paginatedBlacklist.map((entry) => {
                  const status = getStatusStyle(entry.status);
                  return (
                    <TableRow key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-[#FF6B35] font-bold text-sm group-hover:scale-105 transition-all cursor-default">
                            {entry.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">{entry.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <User className="h-2.5 w-2.5 text-gray-400" />
                              <p className="text-[9px] text-gray-400 font-bold uppercase">รหัส: #{entry.id.toString().slice(-4)}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="max-w-[200px]">
                          <p className="text-xs font-medium text-gray-600 truncate">{entry.offense}</p>
                          <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase italic">โดย: {entry.reportedBy}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg ${status.bg} border-none`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${status.dot} mr-2 shadow-sm`}></div>
                          <span className={`text-[10px] font-bold ${status.text}`}>{status.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center text-xs font-bold text-gray-500">
                        {new Date(entry.date).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                            onClick={() => handleStatusChange(entry.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all"
                            onClick={() => handleStatusChange(entry.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-gray-100 shadow-2xl">
                              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-xs font-semibold" onClick={() => { setEditEntry(entry); setDialogOpen(true); }}>
                                <Edit className="mr-2 h-3.5 w-3.5" /> แก้ไขข้อมูล
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-xs font-bold text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDeleteEntry(entry.id)}>
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> ลบถาวร
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">ไม่พบข้อมูลที่ค้นหา</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Area */}
          {blacklist.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                แสดง <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, blacklist.length)}</span> จาก <span className="text-gray-900">{blacklist.length}</span>
              </p>
              <div className="flex items-center gap-1.5 font-bold">
                <Button
                  variant="ghost"
                  className="rounded-lg h-9 w-9 p-0 border border-gray-100 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(blacklist.length / itemsPerPage) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'ghost'}
                      className={`h-9 w-9 rounded-lg font-bold text-xs ${currentPage === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 border border-transparent'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="rounded-lg h-9 w-9 p-0 border border-gray-100 hover:bg-gray-50"
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(blacklist.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(blacklist.length / itemsPerPage)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBlacklistPage;