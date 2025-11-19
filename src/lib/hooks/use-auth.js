import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('black-list-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // Check for redirect path
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    
    // Admin check
    if (username.toLowerCase() === 'admin') {
      const adminUser = { username: 'admin', role: 'admin' };
      localStorage.setItem('black-list-user', JSON.stringify(adminUser));
      setUser(adminUser);
      toast({
        title: "🎉 ยินดีต้อนรับ Admin!",
        description: `เข้าสู่ระบบแผงควบคุมสำเร็จ`,
      });
      
      // Clear redirect path
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } else {
      const mockUser = { username, email: `${username}@example.com`, role: 'user' };
      localStorage.setItem('black-list-user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({
        title: "🎉 ยินดีต้อนรับ!",
        description: `เข้าสู่ระบบสำเร็จในชื่อ ${username}`,
      });
      
      // Clear redirect path and navigate
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/'); 
      }
    }
  };

  const register = (username, password) => {
    // Check for redirect path
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    
    // For simplicity, registration logs in the user as a regular user.
    const mockUser = { username, email: `${username}@example.com`, role: 'user' };
    localStorage.setItem('black-list-user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast({
        title: "✅ สมัครสมาชิกสำเร็จ!",
        description: `ยินดีต้อนรับ ${username}!`,
    });
    
    // Clear redirect path and navigate
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } else {
      navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('black-list-user');
    setUser(null);
    toast({
      title: '👋 แล้วพบกันใหม่!',
      description: 'ออกจากระบบสำเร็จ',
    });
    navigate('/');
  };

  const value = { user, login, register, logout };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  return useContext(AuthContext);
};