import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/hooks/use-auth';
import { AnimatePresence } from 'framer-motion';

// Layouts
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLayout from '@/components/layout/AdminLayout';
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import { HomePage } from '@/pages/HomePage';
import DetailPage from '@/pages/DetailPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import ReportPage from '@/pages/ReportPage';

// Admin Pages
import { DashboardPage } from '@/pages/DashboardPage';
import ManageBlacklistPage from '@/pages/admin/ManageBlacklistPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import SettingsPage from '@/pages/admin/SettingsPage';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

const PublicLayout = () => (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/report" element={<ReportPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AnimatePresence>
        </main>
        <Footer />
    </div>
);


function App() {
  return (
    <Router>
        <AuthProvider>
            <div className="bg-background text-foreground font-sans">
                <Routes>
                     {/* Admin Login - Full Screen (No Navbar/Footer) */}
                     <Route path="/admin/login" element={<AdminLoginPage />} />
                     
                     {/* Admin Dashboard - Protected (Nested Routes) */}
                     <Route path="/dashboard" element={
                        <PrivateRoute>
                            <AdminLayout />
                        </PrivateRoute>
                     }>
                        <Route index element={<DashboardPage />} />
                        <Route path="blacklist" element={<ManageBlacklistPage />} />
                        <Route path="users" element={<ManageUsersPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                     </Route>
                     
                     {/* Public Routes with Navbar/Footer */}
                     <Route path="/*" element={<PublicLayout />} />
                </Routes>
                <Toaster />
            </div>
        </AuthProvider>
    </Router>
  );
}

export default App;