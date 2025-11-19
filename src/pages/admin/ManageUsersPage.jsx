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
  CheckCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const initialUsers = [
  { 
    id: 1, 
    username: 'admin', 
    email: 'admin@ตรวจสอบช่าง.com', 
    firstName: 'ผู้ดูแล',
    lastName: 'ระบบ',
    role: 'admin', 
    status: 'active', 
    createdAt: '2025-01-15',
    lastLogin: '2025-11-19 14:30'
  },
  { 
    id: 2, 
    username: 'user1', 
    email: 'user1@email.com', 
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    role: 'user', 
    status: 'active', 
    createdAt: '2025-02-20',
    lastLogin: '2025-11-18 10:15'
  },
  { 
    id: 3, 
    username: 'moderator1', 
    email: 'mod@ตรวจสอบช่าง.com', 
    firstName: 'สมหญิง',
    lastName: 'รักษาการ',
    role: 'moderator', 
    status: 'active', 
    createdAt: '2025-03-10',
    lastLogin: '2025-11-19 09:00'
  },
  { 
    id: 4, 
    username: 'user2', 
    email: 'user2@email.com', 
    firstName: 'ประวิทย์',
    lastName: 'สุขใจ',
    role: 'user', 
    status: 'inactive', 
    createdAt: '2025-04-05',
    lastLogin: '2025-10-28 16:45'
  },
];

const UserForm = ({ onAddUser, editUser, onEditUser, open, setOpen }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user',
  });

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

  const handleSubmit = (e) => {
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
      toast({
        title: "กรุณากรอกรหัสผ่าน",
        description: "รหัสผ่านจำเป็นสำหรับผู้ใช้ใหม่",
        variant: "destructive",
      });
      return;
    }

    if (editUser) {
      onEditUser(editUser.id, formData);
      toast({
        title: "✅ แก้ไขข้อมูลสำเร็จ",
        description: `อัปเดตข้อมูลผู้ใช้ ${formData.username} แล้ว`,
      });
    } else {
      onAddUser(formData);
      toast({
        title: "✅ เพิ่มผู้ใช้สำเร็จ",
        description: `เพิ่มผู้ใช้ ${formData.username} เข้าระบบแล้ว`,
      });
    }
    
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          เพิ่มผู้ใช้ใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editUser ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลผู้ใช้เพื่อเพิ่มเข้าระบบ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อจริง</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  placeholder="ชื่อจริง" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  placeholder="นามสกุล" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input 
                id="username" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                placeholder="username" 
                disabled={!!editUser}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="email@example.com" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน {editUser && '(เว้นว่างหากไม่เปลี่ยน)'}</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder={editUser ? "••••••••" : "รหัสผ่าน"} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">บทบาท</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกบทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">ผู้ใช้ทั่วไป</SelectItem>
                  <SelectItem value="moderator">ผู้ดูแล</SelectItem>
                  <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
              {editUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedUsers = localStorage.getItem('system-users');
    if (storedUsers && JSON.parse(storedUsers).length > 0) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('system-users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '-',
    };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (userId, userData) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
    setEditUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "✅ ลบผู้ใช้สำเร็จ",
        description: "ลบผู้ใช้ออกจากระบบแล้ว",
      });
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    toast({
      title: "✅ เปลี่ยนสถานะสำเร็จ",
      description: "อัปเดตสถานะผู้ใช้แล้ว",
    });
  };

  const filteredUsers = useMemo(() =>
    users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    }), [users, searchTerm, roleFilter, statusFilter]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  // Export to CSV
  const handleExport = () => {
    const headers = ['ชื่อผู้ใช้', 'อีเมล', 'ชื่อ-นามสกุล', 'เบอร์โทร', 'บทบาท', 'สถานะ'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.username,
        user.email,
        `${user.firstName} ${user.lastName}`,
        user.phone,
        user.role,
        user.status
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "✅ ส่งออกข้อมูลสำเร็จ",
      description: `ส่งออกข้อมูล ${filteredUsers.length} รายการ`,
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-600 text-white">ผู้ดูแลระบบ</Badge>;
      case 'moderator': return <Badge className="bg-blue-600 text-white">ผู้ดูแล</Badge>;
      case 'user': return <Badge variant="secondary" className="bg-gray-200 text-gray-800">ผู้ใช้ทั่วไป</Badge>;
      default: return <Badge variant="outline">ไม่ระบุ</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">ใช้งานอยู่</Badge>
      : <Badge className="bg-gray-200 text-gray-600">ระงับการใช้งาน</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>จัดการผู้ใช้งาน - แดชบอร์ดแอดมิน</title>
      </Helmet>
      <motion.div
        key="manage-users"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-gray-900">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  จัดการผู้ใช้งาน
                </CardTitle>
                <CardDescription>
                  จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ
                </CardDescription>
              </div>
              <UserForm 
                onAddUser={addUser} 
                editUser={editUser}
                onEditUser={handleEditUser}
                open={dialogOpen}
                setOpen={setDialogOpen}
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="flex-grow relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ใช้, อีเมล, ชื่อ-นามสกุล..."
                  className="pl-10 w-full border-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] border-gray-300">
                    <SelectValue placeholder="บทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] border-gray-300">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  className="w-full sm:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">ส่งออก</span>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <p className="text-xs text-gray-600">ผู้ใช้ทั้งหมด</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <p className="text-xs text-gray-600">ใช้งานอยู่</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                  <p className="text-xs text-gray-600">ผู้ดูแลระบบ</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'moderator').length}
                  </div>
                  <p className="text-xs text-gray-600">ผู้ดูแล</p>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <div className="border-2 border-gray-900 rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">ผู้ใช้</TableHead>
                    <TableHead className="hidden md:table-cell font-bold">อีเมล</TableHead>
                    <TableHead className="text-center font-bold">บทบาท</TableHead>
                    <TableHead className="text-center font-bold">สถานะ</TableHead>
                    <TableHead className="hidden lg:table-cell text-center font-bold">เข้าสู่ระบบล่าสุด</TableHead>
                    <TableHead className="text-right font-bold">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-semibold">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.username}</p>
                            <p className="text-sm text-gray-600">{user.firstName} {user.lastName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-700">{user.email}</TableCell>
                      <TableCell className="text-center">{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>จัดการผู้ใช้</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditUser(user);
                                setDialogOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              แก้ไขข้อมูล
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(user.id)}
                              className="cursor-pointer"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              {user.status === 'active' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบผู้ใช้
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        ไม่พบผู้ใช้ที่ตรงกับการค้นหา
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="text-sm text-gray-600">
                  แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredUsers.length)} จากทั้งหมด {filteredUsers.length} รายการ
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">ก่อนหน้า</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum ? "bg-gray-900 hover:bg-gray-800" : ""}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline mr-1">ถัดไป</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ManageUsersPage;
