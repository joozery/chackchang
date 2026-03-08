import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/hooks/use-auth';
import { AnimatePresence, motion } from 'framer-motion';

// Layouts
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLayout from '@/components/layout/AdminLayout';
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { HomePage } from '@/pages/HomePage';
import { GoodWorkersPage } from '@/pages/GoodWorkersPage';
import { TechnicianDetailPage } from '@/pages/TechnicianDetailPage';
import DetailPage from '@/pages/DetailPage';
import { AuthPage } from '@/pages/AuthPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import ReportPage from '@/pages/ReportPage';
import UserAccountPage from '@/pages/UserAccountPage';

// Admin Pages
import DashboardOverviewPage from '@/pages/admin/DashboardOverviewPage';
import ManageBlacklistPage from '@/pages/admin/ManageBlacklistPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import ManageAdminsPage from '@/pages/admin/ManageAdminsPage';
import ManageGoodTechniciansPage from '@/pages/admin/ManageGoodTechniciansPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import SettingsPage from '@/pages/admin/SettingsPage';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // Or a loading spinner

    if (!user) {
        // Redirect to appropriate login page based on path
        const isAdminPath = location.pathname.startsWith('/dashboard');
        return <Navigate to={isAdminPath ? "/admin/login" : "/auth"} state={{ from: location }} replace />;
    }

    return children;
};

import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};


function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="bg-background text-foreground font-sans">
                    <Routes>
                        {/* Landing Page - Full Screen (No Navbar/Footer) */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Admin Login - Full Screen (No Navbar/Footer) */}
                        <Route path="/admin/login" element={<AdminLoginPage />} />

                        {/* Admin Dashboard - Protected (Nested Routes) */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <AdminLayout />
                            </PrivateRoute>
                        }>
                            <Route index element={<Navigate to="/dashboard/overview" replace />} />
                            <Route path="overview" element={<DashboardOverviewPage />} />
                            <Route path="blacklist" element={<ManageBlacklistPage />} />
                            <Route path="good-technicians" element={<ManageGoodTechniciansPage />} />
                            <Route path="users" element={<ManageUsersPage />} />
                            <Route path="admins" element={<ManageAdminsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>

                        {/* Public Routes with Navbar/Footer */}
                        <Route element={<PublicLayout />}>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/good-workers" element={<GoodWorkersPage />} />
                            <Route path="/good-workers/:id" element={<TechnicianDetailPage />} />
                            <Route path="/detail/:id" element={<DetailPage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/report" element={<ReportPage />} />
                            <Route path="/account" element={<UserAccountPage />} />
                        </Route>

                        {/* Catch all - Redirect to landing page */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Toaster />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;