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
  FileSpreadsheet,
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

const initialBlacklist = [
  { id: 1, name: 'สมชาย ทิ้งงาน', offense: 'รับเงินมัดจำแล้วหาย', reportedBy: 'สมหญิง', date: '2025-10-28', status: 'approved' },
  { id: 2, name: 'ประวิทย์ ไม่มา', offense: 'งานไม่เรียบร้อย ของไม่ตรงสเปค', reportedBy: 'สมศักดิ์', date: '2025-10-20', status: 'pending' },
  { id: 3, name: 'มานะ โกงเงิน', offense: 'เบิกเงินเกินจริง', reportedBy: 'สมศรี', date: '2025-09-15', status: 'rejected' },
  { id: 4, name: 'ชาติชาย วัสดุปลอม', offense: 'ใช้วัสดุปลอม', reportedBy: 'สมปอง', date: '2025-11-01', status: 'pending' },
  { id: 5, name: 'ใจดี ไม่รับผิดชอบ', offense: 'ทำงานเสียหายแล้วไม่รับผิดชอบ', reportedBy: 'สมหวัง', date: '2025-11-04', status: 'pending' },
];

const ReportForm = ({ onAddEntry, editEntry, onEditEntry, open, setOpen }) => {
  const [name, setName] = useState('');
  const [offense, setOffense] = useState('');
  const { user } = useAuth();

  // Update form when editEntry changes
  React.useEffect(() => {
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
        description: "กรุณากรอกชื่อและรายละเอียดการกระทำผิด",
        variant: "destructive",
      });
      return;
    }

    if (editEntry) {
      onEditEntry(editEntry.id, { name, offense });
      toast({
        title: "✅ แก้ไขข้อมูลสำเร็จ",
        description: `แก้ไขข้อมูล ${name} เรียบร้อยแล้ว`,
      });
    } else {
      const newEntry = {
        id: Date.now(),
        name,
        offense,
        reportedBy: user?.username || 'ไม่ระบุ',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      onAddEntry(newEntry);
      toast({
        title: "✅ แจ้งข้อมูลสำเร็จ",
        description: `ขอบคุณที่แจ้งข้อมูล ${name} เรื่องจะถูกตรวจสอบโดยเร็วที่สุด`,
      });
    }

    setName('');
    setOffense('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 hover:bg-gray-800">
          <PlusCircle className="mr-2 h-4 w-4" /> เพิ่มข้อมูลใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editEntry ? 'แก้ไขข้อมูลรายงาน' : 'เพิ่มข้อมูลช่างในบัญชีดำ'}</DialogTitle>
            <DialogDescription>
              {editEntry ? 'แก้ไขรายละเอียดรายงาน' : 'กรอกรายละเอียดเพื่อเพิ่มข้อมูลใหม่เข้าระบบ'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">ชื่อช่าง</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="ชื่อ-นามสกุล หรือชื่อเล่น" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="offense" className="text-right">รายละเอียด</Label>
              <Input id="offense" value={offense} onChange={(e) => setOffense(e.target.value)} className="col-span-3" placeholder="เช่น ทิ้งงาน, โกงเงิน" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
              {editEntry ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const ManageBlacklistPage = () => {
    const [blacklist, setBlacklist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editEntry, setEditEntry] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const storedBlacklist = localStorage.getItem('technician-blacklist');
        if (storedBlacklist && JSON.parse(storedBlacklist).length > 0) {
        setBlacklist(JSON.parse(storedBlacklist));
        } else {
        setBlacklist(initialBlacklist);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('technician-blacklist', JSON.stringify(blacklist));
    }, [blacklist]);

    const addEntry = (newEntry) => setBlacklist([newEntry, ...blacklist]);
    
    const handleEditEntry = (id, updatedData) => {
        setBlacklist(blacklist.map(entry => 
            entry.id === id ? { ...entry, ...updatedData } : entry
        ));
        setEditEntry(null);
    };

    const handleDeleteEntry = (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?')) {
            setBlacklist(blacklist.filter(entry => entry.id !== id));
            toast({
                title: "✅ ลบรายงานสำเร็จ",
                description: "ลบรายงานออกจากระบบแล้ว",
            });
        }
    };
    
    const handleStatusChange = (id, newStatus) => {
        setBlacklist(blacklist.map(entry => entry.id === id ? { ...entry, status: newStatus } : entry));
        toast({
            title: `✅ อัปเดตสถานะสำเร็จ`,
            description: `คำร้อง #${id.toString().slice(-4)} ถูกเปลี่ยนเป็น ${newStatus}`,
        })
    };
    
    const filteredBlacklist = useMemo(() =>
        blacklist.filter(entry => {
        const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || entry.offense.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'all' || entry.status === statusFilter;
        return matchesSearch && matchesFilter;
        }), [blacklist, searchTerm, statusFilter]
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredBlacklist.length / itemsPerPage);
    const paginatedBlacklist = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBlacklist.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBlacklist, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Export to CSV
    const handleExport = () => {
        const headers = ['ชื่อ-นามสกุล', 'พฤติกรรม', 'ผู้แจ้ง', 'วันที่', 'สถานะ'];
        const csvContent = [
            headers.join(','),
            ...filteredBlacklist.map(entry => [
                entry.name,
                entry.offense,
                entry.reportedBy,
                entry.date,
                entry.status
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `blacklist_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        toast({
            title: "✅ ส่งออกข้อมูลสำเร็จ",
            description: `ส่งออกข้อมูล ${filteredBlacklist.length} รายการ`,
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
        case 'approved': return <Badge variant="secondary" className="bg-green-100 text-green-800">อนุมัติแล้ว</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">รอดำเนินการ</Badge>;
        case 'rejected': return <Badge variant="destructive">ปฏิเสธ</Badge>;
        default: return <Badge variant="outline">ไม่ระบุ</Badge>;
        }
    };

    return (
        <>
        <Helmet>
            <title>จัดการบัญชีดำ - แดชบอร์ดแอดมิน</title>
        </Helmet>
         <motion.div
            key="manage-blacklist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>จัดการบัญชีดำ</CardTitle>
                            <CardDescription>
                                ค้นหา, กรอง และจัดการคำร้องทั้งหมดในระบบ
                            </CardDescription>
                        </div>
                         <ReportForm 
                            onAddEntry={addEntry} 
                            editEntry={editEntry}
                            onEditEntry={handleEditEntry}
                            open={dialogOpen}
                            setOpen={setDialogOpen}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                        <div className="flex-grow relative w-full">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                             type="text"
                             placeholder="ค้นหาชื่อ, พฤติกรรม..."
                             className="pl-10 w-full"
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                           />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-full sm:w-[150px]">
                                  <SelectValue placeholder="สถานะ" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="all">ทั้งหมด</SelectItem>
                                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                                  <SelectItem value="approved">อนุมัติ</SelectItem>
                                  <SelectItem value="rejected">ปฏิเสธ</SelectItem>
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-600">ทั้งหมด</p>
                        <p className="text-xl font-bold text-gray-900">{filteredBlacklist.length}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-xs text-yellow-700">รอดำเนินการ</p>
                        <p className="text-xl font-bold text-yellow-900">{filteredBlacklist.filter(e => e.status === 'pending').length}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-green-700">อนุมัติ</p>
                        <p className="text-xl font-bold text-green-900">{filteredBlacklist.filter(e => e.status === 'approved').length}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <p className="text-xs text-red-700">ปฏิเสธ</p>
                        <p className="text-xl font-bold text-red-900">{filteredBlacklist.filter(e => e.status === 'rejected').length}</p>
                      </div>
                    </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ชื่อ-นามสกุล</TableHead>
                          <TableHead className="hidden md:table-cell">พฤติกรรม</TableHead>
                          <TableHead className="hidden sm:table-cell">ผู้แจ้ง</TableHead>
                          <TableHead className="hidden md:table-cell text-center">วันที่</TableHead>
                          <TableHead className="text-center">สถานะ</TableHead>
                          <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBlacklist.length > 0 ? paginatedBlacklist.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.name}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-xs truncate">{entry.offense}</TableCell>
                            <TableCell className="hidden sm:table-cell text-muted-foreground">{entry.reportedBy}</TableCell>
                            <TableCell className="hidden md:table-cell text-center">{entry.date}</TableCell>
                            <TableCell className="text-center">{getStatusBadge(entry.status)}</TableCell>
                            <TableCell className="text-right">
                               <div className="flex items-center justify-end gap-1">
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   onClick={() => handleStatusChange(entry.id, 'approved')} 
                                   title="อนุมัติ"
                                   className="hover:bg-green-50"
                                 >
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                 </Button>
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   onClick={() => handleStatusChange(entry.id, 'rejected')} 
                                   title="ปฏิเสธ"
                                   className="hover:bg-red-50"
                                 >
                                      <XCircle className="h-4 w-4 text-red-600" />
                                 </Button>
                                 <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                     <Button variant="ghost" size="sm" title="ตัวเลือกเพิ่มเติม">
                                       <MoreVertical className="h-4 w-4" />
                                     </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end">
                                     <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem 
                                       onClick={() => {
                                         setEditEntry(entry);
                                         setDialogOpen(true);
                                       }}
                                       className="cursor-pointer"
                                     >
                                       <Edit className="mr-2 h-4 w-4" />
                                       แก้ไขข้อมูล
                                     </DropdownMenuItem>
                                     <DropdownMenuSeparator />
                                     <DropdownMenuItem 
                                       onClick={() => handleDeleteEntry(entry.id)}
                                       className="text-red-600 focus:text-red-600 cursor-pointer"
                                     >
                                       <Trash2 className="mr-2 h-4 w-4" />
                                       ลบรายงาน
                                     </DropdownMenuItem>
                                   </DropdownMenuContent>
                                 </DropdownMenu>
                               </div>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              ไม่พบข้อมูลที่ตรงกับการค้นหา
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {filteredBlacklist.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                      <div className="text-sm text-gray-600">
                        แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredBlacklist.length)} จากทั้งหมด {filteredBlacklist.length} รายการ
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

export default ManageBlacklistPage;