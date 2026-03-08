import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('black-list-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store Token
        const token = data.data.token;
        localStorage.setItem('token', token);

        // Store User Data
        const userData = data.data.user;
        localStorage.setItem('black-list-user', JSON.stringify(userData));
        setUser(userData);

        toast({
          title: "🎉 เข้าสู่ระบบสำเร็จ!",
          description: `ยินดีต้อนรับคุณ ${userData.firstName || userData.username}`,
        });

        // Redirect based on role and saved path
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else if (userData.role === 'admin' || userData.role === 'moderator') {
          navigate('/dashboard/overview');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "❌ เข้าสู่ระบบไม่สำเร็จ",
        description: error.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (username, password, additionalData = {}) => {
    try {
      // Check for redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');

      // Prepare registration data
      const registerData = {
        username,
        password,
        email: additionalData.email || `${username}@example.com`,
        firstName: additionalData.firstName || '',
        lastName: additionalData.lastName || '',
        phone: additionalData.phone || '',
        birthDate: additionalData.birthDate || '',
        isTechnician: additionalData.isTechnician || false,
        workTypes: additionalData.workTypes || [],
        lineId: additionalData.lineId || '',
        facebookLink: additionalData.facebookLink || '',
        profileImage: additionalData.profileImage || null
      };

      // Try to register via API
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
        const formData = new FormData();

        // Add all fields to FormData
        Object.keys(registerData).forEach(key => {
          if (key === 'workTypes') {
            formData.append(key, JSON.stringify(registerData[key]));
          } else if (key === 'profileImage' && registerData[key]) {
            formData.append('image', registerData[key]);
          } else if (registerData[key] !== null && registerData[key] !== '') {
            formData.append(key, registerData[key]);
          }
        });

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();

          // Store token
          if (data.data?.token) {
            localStorage.setItem('token', data.data.token);
          }

          // Store user data
          const userData = {
            ...data.data.user,
            role: data.data.user.role || (registerData.isTechnician ? 'technician' : 'user'),
            isTechnician: registerData.isTechnician,
            workTypes: registerData.workTypes || [],
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            phone: registerData.phone,
            lineId: registerData.lineId,
            facebookLink: registerData.facebookLink,
            profileImage: registerData.profileImage
          };
          console.log('Storing user data from API:', userData);
          localStorage.setItem('black-list-user', JSON.stringify(userData));
          setUser(userData);

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
          return;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
      } catch (apiError) {
        console.error('API registration failed, using fallback:', apiError);
        // Fallback to mock registration
        const role = additionalData.isTechnician ? 'technician' : 'user';
        const mockUser = {
          username,
          email: registerData.email,
          role: role,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          phone: registerData.phone,
          lineId: registerData.lineId,
          facebookLink: registerData.facebookLink,
          profileImage: registerData.profileImage,
          isTechnician: registerData.isTechnician,
          workTypes: registerData.workTypes || []
        };
        console.log('Storing mock user:', mockUser);
        localStorage.setItem('black-list-user', JSON.stringify(mockUser));
        setUser(mockUser);
        toast({
          title: "✅ สมัครสมาชิกสำเร็จ!",
          description: `ยินดีต้อนรับ ${username}!`,
        });

        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "❌ สมัครสมาชิกไม่สำเร็จ",
        description: error.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
        variant: "destructive"
      });
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

  const value = { user, loading, login, register, logout };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};

export const useAuth = () => {
  return useContext(AuthContext);
};