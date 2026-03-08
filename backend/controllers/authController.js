import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import path from 'path';
import fs from 'fs/promises';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Register new user
export const register = async (req, res) => {
  try {
    // Handle both JSON and FormData
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      birthDate,
      isTechnician,
      workTypes,
      lineId,
      facebookLink
    } = req.body;

    // Get uploaded file from multer
    const profileImageFile = req.file;

    // Parse isTechnician (can be string 'true' or boolean)
    const isTechnicianBool = isTechnician === 'true' || isTechnician === true;

    // Parse workTypes if it's a string (from FormData)
    let parsedWorkTypes = workTypes;
    if (typeof workTypes === 'string') {
      try {
        parsedWorkTypes = JSON.parse(workTypes);
      } catch (e) {
        parsedWorkTypes = workTypes.split(',').filter(Boolean);
      }
    }

    // Validation
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // Validate technician requirements
    if (isTechnicianBool) {
      if (!profileImageFile) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาอัปโหลดรูปภาพโปรไฟล์สำหรับช่าง'
        });
      }
      if (!parsedWorkTypes || parsedWorkTypes.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาเลือกประเภทงานอย่างน้อย 1 ประเภท'
        });
      }
    }

    // Check if username or email already exists
    const [existingUsers] = await pool.query(
      'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      const field = existing.username === username ? 'username' : 'email';
      return res.status(409).json({
        success: false,
        message: `${field === 'username' ? 'ชื่อผู้ใช้' : 'อีเมล'}นี้ถูกใช้งานแล้ว`,
        conflictField: field
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine role
    const role = isTechnicianBool ? 'technician' : 'user';

    // Handle profile image upload (Cloudinary)
    let profileImagePath = null;
    if (profileImageFile) {
      profileImagePath = profileImageFile.path; // Cloudinary full URL
    }

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (username, password, email, first_name, last_name, phone, birth_date, role, profile_image, line_id, facebook_link) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, firstName, lastName, phone || null, birthDate || null, role, profileImagePath, lineId || null, facebookLink || null]
    );

    const userId = result.insertId;

    // If technician, create technician record
    if (isTechnicianBool && parsedWorkTypes && parsedWorkTypes.length > 0) {
      await pool.query(
        'INSERT INTO technicians (user_id, work_types) VALUES (?, ?)',
        [userId, JSON.stringify(parsedWorkTypes)]
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, username, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      data: {
        token,
        user: {
          id: userId,
          username,
          email,
          firstName,
          lastName,
          phone,
          role,
          profileImage: profileImagePath,
          lineId: lineId || null,
          facebookLink: facebookLink || null,
          isTechnician: isTechnicianBool
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'
      });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT id, username, password, email, first_name, last_name, role, is_active FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'บัญชีของคุณถูกระงับการใช้งาน'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const [users] = await pool.query(
      'SELECT id, username, email, first_name, last_name, phone, role, profile_image, line_id, facebook_link FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const user = users[0];

    // If technician, get technician data
    let technicianData = null;
    if (user.role === 'technician') {
      const [technicians] = await pool.query(
        'SELECT work_types, rating, total_reviews, total_jobs, is_verified, bio FROM technicians WHERE user_id = ?',
        [userId]
      );
      if (technicians.length > 0) {
        let workTypes = [];
        const rawWorkTypes = technicians[0].work_types;

        if (typeof rawWorkTypes === 'string') {
          try {
            workTypes = JSON.parse(rawWorkTypes || '[]');
          } catch (e) {
            workTypes = [];
          }
        } else if (Array.isArray(rawWorkTypes)) {
          workTypes = rawWorkTypes;
        }

        technicianData = {
          workTypes,
          rating: technicians[0].rating,
          totalReviews: technicians[0].total_reviews,
          totalJobs: technicians[0].total_jobs,
          isVerified: technicians[0].is_verified,
          bio: technicians[0].bio || ''
        };
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          profileImage: user.profile_image,
          lineId: user.line_id,
          facebookLink: user.facebook_link
        },
        technician: technicianData
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
};
// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const {
      email,
      username,
      firstName,
      lastName,
      phone,
      lineId,
      facebookLink,
      workTypes,
      bio,
      currentPassword,
      newPassword
    } = req.body;
    const profileImageFile = req.file;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาระบุรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสผ่านใหม่'
        });
      }

      const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้ใช้'
        });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
        });
      }
    }

    // Build update query for users table
    let userUpdateFields = [];
    let userUpdateParams = [];

    if (email) { userUpdateFields.push('email = ?'); userUpdateParams.push(email); }
    if (username) { userUpdateFields.push('username = ?'); userUpdateParams.push(username); }
    if (firstName) { userUpdateFields.push('first_name = ?'); userUpdateParams.push(firstName); }
    if (lastName) { userUpdateFields.push('last_name = ?'); userUpdateParams.push(lastName); }
    if (phone) { userUpdateFields.push('phone = ?'); userUpdateParams.push(phone); }
    if (lineId) { userUpdateFields.push('line_id = ?'); userUpdateParams.push(lineId); }
    if (facebookLink) { userUpdateFields.push('facebook_link = ?'); userUpdateParams.push(facebookLink); }

    if (profileImageFile) {
      userUpdateFields.push('profile_image = ?');
      userUpdateParams.push(profileImageFile.path); // Cloudinary URL
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      userUpdateFields.push('password = ?');
      userUpdateParams.push(hashedPassword);
    }

    if (userUpdateFields.length > 0) {
      const userQuery = `UPDATE users SET ${userUpdateFields.join(', ')} WHERE id = ?`;
      userUpdateParams.push(userId);
      await pool.query(userQuery, userUpdateParams);
    }

    // Update technician table if workTypes or bio provided and user is technician
    if (workTypes || bio !== undefined) {
      const [users] = await pool.query('SELECT id, role FROM users WHERE id = ?', [userId]);
      if (users.length > 0 && users[0].role === 'technician') {
        const updateTechFields = [];
        const updateTechParams = [];

        if (workTypes) {
          let parsedWorkTypes = workTypes;
          if (typeof workTypes === 'string') {
            try {
              parsedWorkTypes = JSON.parse(workTypes);
            } catch (e) {
              parsedWorkTypes = workTypes.split(',').filter(Boolean);
            }
          }
          updateTechFields.push('work_types = ?');
          updateTechParams.push(JSON.stringify(parsedWorkTypes));
        }

        if (bio !== undefined) {
          updateTechFields.push('bio = ?');
          updateTechParams.push(bio);
        }

        if (updateTechFields.length > 0) {
          updateTechParams.push(userId);
          await pool.query(
            `UPDATE technicians SET ${updateTechFields.join(', ')} WHERE user_id = ?`,
            updateTechParams
          );
        }
      }
    }

    // Get updated user and technician data
    const [updatedUsers] = await pool.query(
      'SELECT id, username, email, first_name, last_name, phone, role, profile_image, line_id, facebook_link FROM users WHERE id = ?',
      [userId]
    );

    let updatedTechnicianData = null;
    if (updatedUsers[0].role === 'technician') {
      const [technicians] = await pool.query(
        'SELECT work_types, rating, total_reviews, total_jobs, is_verified, bio FROM technicians WHERE user_id = ?',
        [userId]
      );
      if (technicians.length > 0) {
        let workTypes = [];
        const rawWorkTypes = technicians[0].work_types;

        if (typeof rawWorkTypes === 'string') {
          try {
            workTypes = JSON.parse(rawWorkTypes || '[]');
          } catch (e) {
            workTypes = [];
          }
        } else if (Array.isArray(rawWorkTypes)) {
          workTypes = rawWorkTypes;
        }

        updatedTechnicianData = {
          workTypes,
          rating: technicians[0].rating,
          totalReviews: technicians[0].total_reviews,
          totalJobs: technicians[0].total_jobs,
          isVerified: technicians[0].is_verified,
          bio: technicians[0].bio || ''
        };
      }
    }

    res.json({
      success: true,
      message: 'อัปเดตโปรไฟล์สำเร็จ',
      data: {
        user: {
          id: updatedUsers[0].id,
          username: updatedUsers[0].username,
          email: updatedUsers[0].email,
          firstName: updatedUsers[0].first_name,
          lastName: updatedUsers[0].last_name,
          phone: updatedUsers[0].phone,
          role: updatedUsers[0].role,
          profileImage: updatedUsers[0].profile_image,
          lineId: updatedUsers[0].line_id,
          facebookLink: updatedUsers[0].facebook_link
        },
        technician: updatedTechnicianData
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์'
    });
  }
};
