import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    Search,
    Plus,
    MoreVertical,
    Star,
    CheckCircle,
    Award,
    TrendingUp,
    UserCheck,
    Download,
    Filter,
    ExternalLink,
    Edit,
    Trash2,
    ThumbsUp,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import technicianService from '@/services/technicianService';
import { Loader2 } from 'lucide-react';

const initialTechnicians = [
    {
        id: 1,
        name: "สมชาย งานไว",
        phone: "081-234-5678",
        category: "ช่างไฟฟ้า",
        location: "นนทบุรี",
        rating: 4.9,
        reviews: 128,
        status: "verified",
        joinedDate: "2024-01-15"
    },
    {
        id: 2,
        name: "วิชัย ประปาดี",
        phone: "089-876-5432",
        category: "ช่างประปา",
        location: "กรุงเทพฯ",
        rating: 4.8,
        reviews: 85,
        status: "verified",
        joinedDate: "2024-02-20"
    },
    {
        id: 3,
        name: "เกษม แอร์เย็น",
        phone: "085-555-4444",
        category: "ช่างแอร์",
        location: "สมุทรปราการ",
        rating: 4.7,
        reviews: 210,
        status: "featured",
        joinedDate: "2023-11-10"
    },
    {
        id: 4,
        name: "มานะ รับซ่อม",
        phone: "086-111-2222",
        category: "ช่างทั่วไป",
        location: "ปทุมธานี",
        rating: 4.6,
        reviews: 42,
        status: "verified",
        joinedDate: "2024-03-05"
    }
];

const ManageGoodTechniciansPage = () => {
    const navigate = useNavigate();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTech, setEditingTech] = useState(null);
    const [editForm, setEditForm] = useState({
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        totalJobs: 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    const fetchTechnicians = useCallback(async () => {
        try {
            setLoading(true);
            const response = await technicianService.getAll({
                search: searchTerm,
                page: currentPage,
                limit: itemsPerPage
            });

            if (response.success) {
                setTechnicians(response.data);
                setTotalPages(response.pagination.totalPages);
                setTotalItems(response.pagination.total);
                setError(null);
            } else {
                setError('Failed to fetch technicians');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage]);

    useEffect(() => {
        fetchTechnicians();
    }, [fetchTechnicians]);

    const handleEditClick = (tech) => {
        setEditingTech(tech);
        setEditForm({
            isVerified: !!tech.isVerified,
            rating: tech.rating || 0,
            totalReviews: tech.totalReviews || 0,
            totalJobs: tech.totalJobs || 0
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingTech) return;

        try {
            setIsSaving(true);
            const response = await technicianService.update(editingTech.id, editForm);

            if (response.success) {
                toast({
                    title: "สำเร็จ",
                    description: "อัปเดตข้อมูลช่างเรียบร้อยแล้ว",
                });
                setIsEditDialogOpen(false);
                fetchTechnicians();
            } else {
                toast({
                    title: "ผิดพลาด",
                    description: response.message || "ไม่สามารถอัปเดตข้อมูลได้",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Edit Error:', error);
            toast({
                title: "ผิดพลาด",
                description: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickVerify = async (tech) => {
        try {
            const response = await technicianService.update(tech.id, {
                isVerified: !tech.isVerified,
                rating: tech.rating,
                totalReviews: tech.totalReviews,
                totalJobs: tech.totalJobs
            });

            if (response.success) {
                toast({
                    title: "สำเร็จ",
                    description: `อัปเดตสถานะการยืนยันของ ${tech.fullName} เรียบร้อยแล้ว`,
                });
                fetchTechnicians();
            }
        } catch (error) {
            console.error('Quick Verify Error:', error);
            toast({
                title: "ผิดพลาด",
                description: "ไม่สามารถอัปเดตสถานะได้",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบรายชื่อ ${name} ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
            try {
                const response = await technicianService.delete(id);
                if (response.success) {
                    toast({
                        title: "ลบสำเร็จ",
                        description: `ลบข้อมูล ${name} ออกจากระบบเรียบร้อยแล้ว`,
                    });
                    fetchTechnicians();
                } else {
                    toast({
                        title: "ผิดพลาด",
                        description: response.message || "ไม่สามารถลบข้อมูลได้",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error('Delete Error:', error);
                toast({
                    title: "ผิดพลาด",
                    description: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
                    variant: "destructive"
                });
            }
        }
    };

    const getStatusBadge = (isVerified) => {
        if (isVerified) {
            return <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-bold px-2.5 py-1 flex items-center gap-1 w-fit mx-auto">
                <ShieldCheck className="h-3 w-3" /> ยืนยันแล้ว
            </Badge>;
        }
        return <Badge className="bg-gray-50 text-gray-500 border-none text-[10px] font-bold px-2.5 py-1 w-fit mx-auto">ทั่วไป</Badge>;
    };

    return (
        <div className="space-y-6 pb-6">
            <Helmet>
                <title>จัดการช่างรับงานดี | CheckChang Admin</title>
            </Helmet>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ช่างรับงานดี</h1>
                    <p className="text-gray-500 mt-0.5 text-xs font-medium">คัดกรองและแสดงรายชื่อช่างที่มีประวัติดี เพื่อส่งเสริมช่างที่มีคุณภาพ</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-400">
                        <Download className="h-4 w-4" />
                    </div>
                    <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl px-5 h-11 shadow-lg shadow-green-100 transition-all hover:-translate-y-0.5">
                        <Plus className="mr-2 h-4 w-4" /> เพิ่มช่างแนะนำ
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ช่างคุณภาพทั้งหมด</p>
                            <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{totalItems}</h2>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#22C55E] group-hover:text-white transition-all">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">คะแนนเฉลี่ย</p>
                            <h2 className="text-3xl font-black text-[#FFB800] mt-2 tracking-tighter">4.8</h2>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center text-[#FFB800] group-hover:bg-[#FFB800] group-hover:text-white transition-all">
                            <Star className="h-5 w-5 fill-current" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-6 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">รีวิวทั้งหมด</p>
                            <h2 className="text-3xl font-black text-blue-600 mt-2 tracking-tighter">465</h2>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none bg-gradient-to-br from-green-500 to-emerald-600 rounded-[1.5rem] p-6 shadow-xl group">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">เพิ่มขึ้นเดือนนี้</p>
                            <h2 className="text-3xl font-black text-white mt-2 tracking-tighter">+12%</h2>
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
                            <CardTitle className="text-lg font-bold text-gray-900 tracking-tight">รายชื่อช่างรับงานดี</CardTitle>
                            <CardDescription className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">ตรวจสอบและจัดการข้อมูลช่างคุณภาพ</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="ค้นหาชื่อช่าง, ประเภทงาน, พื้นที่..."
                                    className="pl-9 rounded-xl bg-gray-50 border-none py-4 text-xs h-10 focus-visible:ring-1 focus-visible:ring-gray-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="h-10 px-3 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors gap-2">
                                <Filter className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase">ตัวกรอง</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">ข้อมูลช่าง</TableHead>
                                    <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">ประเภท/พื้นที่</TableHead>
                                    <TableHead className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">คะแนน/รีวิว</TableHead>
                                    <TableHead className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">สถานะ</TableHead>
                                    <TableHead className="hidden lg:table-cell text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">วันที่เข้าร่วม</TableHead>
                                    <TableHead className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4">จัดการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-20 text-center">
                                            <Loader2 className="h-8 w-8 text-green-500 animate-spin mx-auto mb-2" />
                                            <p className="text-xs text-gray-400 font-bold uppercase">กำลังโหลดข้อมูล...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : technicians.length > 0 ? technicians.map((tech) => (
                                    <TableRow key={tech.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors group">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold shadow-sm group-hover:scale-105 transition-all">
                                                    {tech.fullName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight">{tech.fullName}</p>
                                                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">{tech.phone || tech.username}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-xs text-gray-700 font-semibold">{tech.workTypes?.[0] || 'ไม่ระบุ'}</div>
                                                <div className="text-[10px] text-gray-400">ออนไลน์</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div className="flex items-center gap-1 text-xs font-bold text-[#FFB800]">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    {Number(tech.rating).toFixed(1)}
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-bold">{tech.totalReviews} รีวิว</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">{getStatusBadge(tech.isVerified)}</TableCell>
                                        <TableCell className="hidden lg:py-4 lg:table-cell lg:text-center text-[10px] font-bold text-gray-500">
                                            {tech.createdAt ? new Date(tech.createdAt).toLocaleDateString('th-TH') : '-'}
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg hover:bg-green-50 hover:text-green-600"
                                                    onClick={() => navigate(`/good-workers/${tech.id}`)}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-lg hover:bg-gray-50"
                                                    onClick={() => handleEditClick(tech)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                                                        <DropdownMenuItem
                                                            className="rounded-lg py-2 cursor-pointer text-xs font-semibold"
                                                            onClick={() => handleQuickVerify(tech)}
                                                        >
                                                            {tech.isVerified ? 'ยกเลิกการยืนยัน' : 'ยืนยันตัวตนช่าง'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg py-2 cursor-pointer text-xs font-semibold"
                                                            onClick={() => {
                                                                toast({
                                                                    title: "Coming Soon",
                                                                    description: "ระบบส่งออก PDF กำลังอยู่ในการพัฒนา",
                                                                });
                                                            }}
                                                        >
                                                            ส่งออกข้อมูล PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="rounded-lg py-2 cursor-pointer text-xs font-bold text-red-600 focus:text-red-600 focus:bg-red-50"
                                                            onClick={() => handleDelete(tech.id, tech.fullName)}
                                                        >
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" /> ลบรายชื่อออก
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-16 text-center text-gray-400 text-xs font-bold">
                                            {error || 'ไม่พบข้อมูลช่าง'}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                หน้า <span className="text-gray-900">{currentPage}</span> จาก <span className="text-gray-900">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-1.5 font-bold">
                                <Button
                                    variant="ghost"
                                    className="rounded-lg h-9 w-9 p-0 border border-gray-100"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="rounded-lg h-9 w-9 p-0 border border-gray-100"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Technician Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>แก้ไขข้อมูลช่าง</DialogTitle>
                        <DialogDescription>
                            แก้ไขรายละเอียดของ {editingTech?.fullName} เพื่อแสดงผลในระบบ
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold">สถานะการยืนยันตัวตน</Label>
                                <p className="text-[10px] text-gray-500 font-medium">ยืนยันว่าช่างผ่านการตรวจสอบเอกสารแล้ว</p>
                            </div>
                            <Switch
                                checked={editForm.isVerified}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isVerified: checked })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">คะแนนเรตติ้ง (0-5)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={editForm.rating}
                                    onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
                                    className="rounded-xl border-gray-100 h-10 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">จำนวนรีวิว</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={editForm.totalReviews}
                                    onChange={(e) => setEditForm({ ...editForm, totalReviews: parseInt(e.target.value) })}
                                    className="rounded-xl border-gray-100 h-10 font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">จำนวนงานที่สำเร็จ</Label>
                            <Input
                                type="number"
                                min="0"
                                value={editForm.totalJobs}
                                onChange={(e) => setEditForm({ ...editForm, totalJobs: parseInt(e.target.value) })}
                                className="rounded-xl border-gray-100 h-10 font-bold"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl font-bold text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            ยกเลิก
                        </Button>
                        <Button
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-xs px-8"
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageGoodTechniciansPage;
