import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// Get all staff members (admins and moderators)
export const getAdmins = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, first_name as firstName, last_name as lastName, role, is_active as isActive, created_at as createdAt FROM users WHERE role IN (\'admin\', \'moderator\') ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get Admins Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแอดมิน' });
    }
};

// Create new admin/moderator
export const createAdmin = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;

        // Validation
        if (!username || !email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check if exists
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีดีอยู่ในระบบแล้ว' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, first_name, last_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, firstName, lastName, role, 1]
        );

        res.status(201).json({
            success: true,
            message: 'สร้างบัญชีแอดมินสำเร็จ',
            data: { id: result.insertId, username, email, firstName, lastName, role }
        });
    } catch (error) {
        console.error('Create Admin Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างบัญชี' });
    }
};

// Update admin
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, firstName, lastName, role, password } = req.body;

        let query = 'UPDATE users SET email = ?, first_name = ?, last_name = ?, role = ?';
        let params = [email, firstName, lastName, role];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ? AND role IN (\'admin\', \'moderator\')';
        params.push(id);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลแอดมิน' });
        }

        res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Update Admin Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting itself placeholder - should be handled via req.user.id from auth middleware
        const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role IN (\'admin\', \'moderator\')', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลแอดมิน' });
        }

        res.json({ success: true, message: 'ลบแอดมินเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Delete Admin Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};
