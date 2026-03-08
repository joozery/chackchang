import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <Helmet>
                <title>สถิติรายงาน | CheckChang Admin</title>
            </Helmet>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">สถิติรายงาน</h1>
                <p className="text-gray-500 text-xs font-medium">ส่วนนี้กำลังอยู่ระหว่างการพัฒนาข้อมูลเชิงลึก</p>
            </div>

            <Card className="border-none bg-white shadow-xl shadow-gray-200/40 rounded-[1.5rem] p-12 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                    <BarChart3 className="h-10 w-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">ระบบสถิติกำลังจัดเตรียมข้อมูล</h2>
                <p className="text-gray-400 max-w-xs text-sm">เรากำลังพัฒนาระบบวิเคราะห์ข้อมูลเพื่อให้คุณสามารถติดตามสถิติการรายงานได้อย่างแม่นยำ</p>
            </Card>
        </div>
    );
};

export default ReportsPage;
