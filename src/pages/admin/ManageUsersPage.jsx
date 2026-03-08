import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  Search,
  MoreVertical,
  Shield,
  User,
  Mail,
  Calendar,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ArrowUpRight,
  UserCheck,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import userService from '@/services/userService';

const UserForm = ({ onAddUser, editUser, onEditUser, open, setOpen }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editUser) {
      setFormData({
        username: editUser.username,
        email: editUser.email,
        password: '',
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        role: editUser.role,
      });
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'user',
      });
    }
  }, [editUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.firstName || !formData.lastName) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        variant: "destructive",
      });
      return;
    }
    if (!editUser && !formData.password) {
      toast({ title: "กรุณากรอกรหัสผ่าน", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (editUser) {
        await onEditUser(editUser.id, formData);
        toast({ title: "แก้ไขข้อมูลสำเร็จ" });
      } else {
        await onAddUser(formData);
        toast({ title: "เพิ่มผู้ใช้สำเร็จ" });
      }
      setOpen(false);
    } catch (error) {
      console.error('Form handle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-xl px-5 h-11 shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5">
          <UserPlus className="mr-2 h-4 w-4" /> เพิ่มผู้ใช้ใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-gray-900 p-6 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editUser ? 'แก้ไขข้อมูลผู้ใช้' : 'สร้างบัญชีผู้ใช้ใหม่'}</DialogTitle>
            <DialogDescription className="text-gray-400 mt-1 text-xs">
              กำหนดสิทธิ์และข้อมูลเบื้องต้นสำหรับเข้าใช้งานระบบ CheckChang
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">ชื่อจริง</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="ภาษาไทย/อังกฤษ" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">นามสกุล</Label>
              <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="ภาษาไทย/อังกฤษ" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">ชื่อผู้ใช้ (Username)</Label>
            <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="เช่น user_name" disabled={!!editUser} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">อีเมล (Email)</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="example@checkchang.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">รหัสผ่าน {editUser && '(เว้นว่างหากไม่ต้องการเปลี่ยน)'}</Label>
            <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-[#FF6B35] text-sm" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700">บทบาทในระบบ</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="rounded-lg bg-gray-50 border-none py-5 focus:ring-[#FF6B35] text-sm">
                <SelectValue placeholder="เลือกบทบาท" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="user" className="text-xs">ผู้ใช้ทั่วไป</SelectItem>
                <SelectItem value="moderator" className="text-xs">ผู้ดูแล</SelectItem>
                <SelectItem value="admin" className="text-xs">ผู้ดูแลระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" className="rounded-lg px-6 h-10 text-xs font-bold" onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85D2A] text-white rounded-lg px-8 h-10 shadow-lg shadow-orange-100 text-xs font-bold">
              {editUser ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลสมาชิกได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (userData) => {
    try {
      const response = await userService.create(userData);
      if (response.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  };

  const handleEditUser = async (userId, userData) => {
    try {
      const response = await userService.update(userId, userData);
      if (response.success) {
        fetchUsers();
        setEditUser(null);
      }
    } catch (error) {
      console.error('Edit user error:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      try {
        const response = await userService.delete(userId);
        if (response.success) {
          fetchUsers();
          toast({ title: "ลบผู้ใช้เรียบร้อยแล้ว" });
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await userService.toggleStatus(userId);
      if (response.success) {
        fetchUsers();
        toast({ title: "อัปเดตสถานะผู้ใช้เรียบร้อยแล้ว" });
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
  };

  const filteredUsers = useMemo(() =>
    users.filter(user => {
      const matchesSearch = (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (`${user.firstName || ''} ${user.lastName || ''}`).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.isActive === 1 : user.isActive === 0);
      return matchesSearch && matchesRole && matchesStatus;
    }), [users, searchTerm, roleFilter, statusFilter]
  );

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.isActive === 1).length,
    admin: users.filter(u => u.role === 'admin').length,
    newUsers: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
  }), [users]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-50 text-red-600 border-none text-[10px] font-bold px-2.5 py-1">ผู้ดูแลระบบ</Badge>;
      case 'moderator': return <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold px-2.5 py-1">ผู้ดูแล</Badge>;
      case 'user': return <Badge className="bg-gray-100 text-gray-600 border-none text-[10px] font-bold px-2.5 py-1">ผู้ใช้ทั่วไป</Badge>;
      case 'technician': return <Badge className="bg-green-50 text-green-600 border-none text-[10px] font-bold px-2.5 py-1">ช่าง</Badge>;
      default: return <Badge className="border-none text-[10px] font-bold px-2.5 py-1 text-gray-400">ไม่ระบุ</Badge>;
    }
  };

  const getStatusBadge = (isActive) => {
    return isActive === 1
      ? <div className="inline-flex items-center gap-1.5 text-green-600 font-bold text-[10px] bg-green-50 px-2.5 py-1 rounded-lg"><div className="h-1 w-1 bg-green-500 rounded-full"></div> ใช้งานอยู่</div>
      : <div className="inline-flex items-center gap-1.5 text-gray-400 font-bold text-[10px] bg-gray-50 px-2.5 py-1 rounded-lg"><div className="h-1 w-1 bg-gray-300 rounded-full"></div> ระงับใช้งาน</div>;
  };

  return (
    <div className="space-y-6 pb-6">
      <Helmet>
        <title>สมาชิกในระบบ | CheckChang Admin</title>
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">สมาชิกในระบบ</h1>
          <p className="text-gray-500 mt-0.5 text-xs font-medium">จัดการบทบาท สิทธิ์การใช้งาน และตรวจสอบความเคลื่อนไหวของผู้ใช้</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 text-gray-500" />
          </div>
          <UserForm
            onAddUser={addUser}
            editUser={editUser}
            onEditUser={handleEditUser}
            open={dialogOpen}
            setOpen={setDialogOpen}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ผู้ใช้ทั้งหมด</p>
              <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{stats.total}</h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
              <User className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">กำลังใช้งาน</p>
              <h2 className="text-3xl font-black text-green-600 mt-2 tracking-tighter">{stats.active}</h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">แอดมิน</p>
              <h2 className="text-3xl font-black text-red-600 mt-2 tracking-tighter">{stats.admin}</h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="border-none stat-card-orange rounded-[1.5rem] p-6 shadow-xl group">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">ผู้มาใหม่ (7 วัน)</p>
              <h2 className="text-3xl font-black text-white mt-2 tracking-tighter">+{stats.newUsers}</h2>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">รายชื่อสมาชิก</CardTitle>
              <CardDescription className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">จัดการสิทธิ์และความปลอดภัย</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาชื่อ, อีเมล หรือชื่อสมาชิก..."
                  className="pl-9 rounded-xl bg-gray-50 border-none py-4 text-xs h-10 focus-visible:ring-1 focus-visible:ring-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[100px] border-none bg-gray-50 rounded-lg text-[10px] font-bold h-10">
                  <SelectValue placeholder="บทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="admin">แอดมิน</SelectItem>
                  <SelectItem value="moderator">ผู้ดูแล</SelectItem>
                  <SelectItem value="user">สมาชิก</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-[#FF6B35] animate-spin mb-4" />
              <p className="text-sm text-gray-500 font-medium">กำลังโหลดข้อมูลสมาชิก...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">ผู้ใช้งาน</TableHead>
                    <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">การติดต่อ</TableHead>
                    <TableHead className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">บทบาท</TableHead>
                    <TableHead className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">สถานะ</TableHead>
                    <TableHead className="hidden lg:table-cell text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">เข้าสู่ระบบล่าสุด</TableHead>
                    <TableHead className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-all cursor-default">
                            {user.firstName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">{user.username}</p>
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{user.firstName} {user.lastName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">เข้าร่วม: {user.createdAt}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="py-4 text-center">{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell className="hidden lg:py-4 lg:table-cell lg:text-center">
                        <div className="flex flex-col items-center">
                          <p className="text-[10px] font-bold text-gray-600 leading-tight">{user.lastLogin?.split(' ')[0]}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{user.lastLogin?.split(' ')[1] || '-'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all"
                            onClick={() => { setEditUser(user); setDialogOpen(true); }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 border-gray-100 shadow-2xl">
                              <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase px-3 py-2">ความปลอดภัย</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-xs font-semibold" onClick={() => handleToggleStatus(user.id)}>
                                <Lock className="mr-2 h-3.5 w-3.5" />
                                {user.isActive === 1 ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-50" />
                              <DropdownMenuItem className="rounded-lg py-2 cursor-pointer text-xs font-bold text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> ลบผู้ใช้ถาวร
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-gray-200" />
                          </div>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">ไม่พบสมาชิกที่ค้นหา</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                แสดง <span className="text-gray-900">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> จาก <span className="text-gray-900">{filteredUsers.length}</span>
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
                  {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }).map((_, i) => (
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
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredUsers.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
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

export default ManageUsersPage;
