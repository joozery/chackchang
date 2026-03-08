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
    ShieldCheck,
    ShieldAlert,
    UserCheck,
    Briefcase
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import adminService from '@/services/adminService';

const initialAdmins = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@checkchang.com',
        firstName: 'ผู้ดูแล',
        lastName: 'ระบบ',
        role: 'admin',
        status: 'active',
        createdAt: '2025-01-15',
        lastLogin: '2025-11-19 14:30'
    }
];

const AdminForm = ({ onAddAdmin, editAdmin, onEditAdmin, open, setOpen }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'moderator',
    });

    // Reset or fill form when dialog opens
    useEffect(() => {
        if (open) {
            if (editAdmin) {
                setFormData({
                    username: editAdmin.username,
                    email: editAdmin.email,
                    password: '',
                    firstName: editAdmin.firstName,
                    lastName: editAdmin.lastName,
                    role: editAdmin.role,
                });
            } else {
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: 'moderator',
                });
            }
        }
    }, [open, editAdmin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.firstName || !formData.lastName) {
            toast({ title: "ข้อมูลไม่ครบถ้วน", variant: "destructive" });
            return;
        }

        if (!editAdmin && !formData.password) {
            toast({ title: "กรุณาระบุรหัสผ่าน", variant: "destructive" });
            return;
        }

        if (editAdmin) {
            onEditAdmin(editAdmin.id, formData);
            toast({ title: "อัปเดตข้อมูลแอดมินเรียบร้อย" });
        } else {
            onAddAdmin(formData);
            toast({ title: "เพิ่มแอดมินใหม่เรียบร้อย" });
        }
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl overflow-hidden p-0">
                <div className="bg-gray-900 p-6 text-white text-center">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{editAdmin ? 'แก้ไขสิทธิ์ผู้ดูแล' : 'แต่งตั้งผู้ดูแลระบบใหม่'}</DialogTitle>
                        <DialogDescription className="text-gray-400 mt-1 text-xs">กำหนดบทบาทและสิทธิ์การเข้าถึงส่วนหลังบ้าน</DialogDescription>
                    </DialogHeader>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-700">ชื่อจริง</Label>
                            <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-gray-900 text-sm" placeholder="ระบุชื่อ" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-gray-700">นามสกุล</Label>
                            <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-gray-900 text-sm" placeholder="ระบุนามสกุล" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Username</Label>
                        <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-gray-900 text-sm" placeholder="เช่น admin_01" disabled={!!editAdmin} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">Email</Label>
                        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-gray-900 text-sm" placeholder="admin@email.com" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">รหัสผ่าน {editAdmin && '(เว้นว่างหากไม่เปลี่ยน)'}</Label>
                        <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="rounded-lg bg-gray-50 border-none py-5 focus-visible:ring-gray-900 text-sm" placeholder="••••••••" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-gray-700">ระดับสิทธิ์ (Role)</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                            <SelectTrigger className="rounded-lg bg-gray-50 border-none py-5 focus:ring-gray-900 text-sm">
                                <SelectValue placeholder="เลือกสิทธิ์" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="moderator">ผู้ดูแล (Moderator)</SelectItem>
                                <SelectItem value="admin">ผู้ดูแลระบบสูงสุด (Admin)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" className="rounded-lg px-6 h-10 text-xs font-bold" onClick={() => setOpen(false)}>ยกเลิก</Button>
                        <Button type="submit" className="bg-gray-900 hover:bg-black text-white rounded-lg px-8 h-10 shadow-lg text-xs font-bold">
                            {editAdmin ? 'บันทึกการแก้ไข' : 'แต่งตั้งผู้ดูแล'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const ManageAdminsPage = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editAdmin, setEditAdmin] = useState(null);

    // Fetch from Backend
    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error('Fetch admins error:', error);
            toast({ title: "ดึงข้อมูลล้มเหลว", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const filteredAdmins = useMemo(() =>
        admins.filter(a =>
            a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ), [admins, searchTerm]
    );

    const handleOpenAdd = () => {
        setEditAdmin(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (admin) => {
        setEditAdmin(admin);
        setDialogOpen(true);
    };

    const handleAddAdmin = async (data) => {
        try {
            await adminService.createAdmin(data);
            fetchAdmins(); // Refresh
        } catch (error) {
            console.error('Add admin error:', error);
            toast({ title: "เพิ่มแอดมินล้มเหลว", description: error.message, variant: "destructive" });
        }
    };

    const handleUpdateAdmin = async (id, data) => {
        try {
            await adminService.updateAdmin(id, data);
            fetchAdmins(); // Refresh
        } catch (error) {
            console.error('Update admin error:', error);
            toast({ title: "อัปเดตข้อมูลล้มเหลว", description: error.message, variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('ยืนยันการลบผู้ดูแลท่านนี้?')) {
            try {
                await adminService.deleteAdmin(id);
                setAdmins(admins.filter(a => a.id !== id));
                toast({ title: "ลบรายการเรียบร้อย" });
            } catch (error) {
                console.error('Delete admin error:', error);
                toast({ title: "ลบล้มเหลว", description: error.message, variant: "destructive" });
            }
        }
    };

    const getRoleBadge = (role) => {
        return role === 'admin'
            ? <Badge className="bg-red-50 text-red-600 border-none text-[10px] font-bold">แอดมินสูงสุด</Badge>
            : <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold">ผู้ดูแล</Badge>;
    };

    return (
        <div className="space-y-6 pb-6">
            <Helmet>
                <title>จัดการทีมผู้ดูแล | CheckChang Admin</title>
            </Helmet>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">จัดการทีมผู้ดูแล</h1>
                    <p className="text-gray-500 mt-0.5 text-xs font-medium">แต่งตั้งและจัดการสิทธิ์ของทีมงานหลังบ้าน</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleOpenAdd}
                        className="bg-gray-900 hover:bg-black text-white rounded-xl px-5 h-11 shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        <UserPlus className="mr-2 h-4 w-4" /> เพิ่มผู้ดูแลใหม่
                    </Button>
                    <AdminForm
                        onAddAdmin={handleAddAdmin}
                        editAdmin={editAdmin}
                        onEditAdmin={handleUpdateAdmin}
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">แอดมินทั้งหมด</p>
                            <h2 className="text-2xl font-black text-gray-900">{admins.length} ท่าน</h2>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-bold">รายชื่อทีมงาน</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="ค้นหาทีมงาน..."
                                className="pl-9 rounded-xl bg-gray-50 border-none h-10 text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">คนดูแล</TableHead>
                                <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">การติดต่อ</TableHead>
                                <TableHead className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">บทบาท</TableHead>
                                <TableHead className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAdmins.map((admin) => (
                                <TableRow key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                {admin.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 leading-tight">{admin.username}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{admin.firstName} {admin.lastName}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <p className="text-xs text-gray-600 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {admin.email}</p>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">{getRoleBadge(admin.role)}</TableCell>
                                    <TableCell className="py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleOpenEdit(admin)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-600 hover:text-red-700" onClick={() => handleDelete(admin.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageAdminsPage;
