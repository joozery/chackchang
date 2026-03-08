import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

// Get all users
export const getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, first_name as firstName, last_name as lastName, role, is_active as isActive, created_at as createdAt FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
    }
};

// Create user
export const createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;

        if (!username || !email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const [existing] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, first_name, last_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, email, hashedPassword, firstName, lastName, role, 1]
        );

        res.status(201).json({
            success: true,
            message: 'สร้างผู้ใช้สำเร็จ',
            data: { id: result.insertId, username, email, firstName, lastName, role }
        });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, firstName, lastName, role, password, isActive } = req.body;

        let query = 'UPDATE users SET email = ?, first_name = ?, last_name = ?, role = ?, is_active = ?';
        let params = [email, firstName, lastName, role, isActive !== undefined ? isActive : 1];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
        }

        res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
        }

        res.json({ success: true, message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
};

// Toggle user status
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await pool.query('SELECT is_active FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' });
        }

        const newStatus = user[0].is_active === 1 ? 0 : 1;
        await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);

        res.json({ success: true, message: 'อัปเดตสถานะสำเร็จ', isActive: newStatus });
    } catch (error) {
        console.error('Toggle Status Error:', error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
    }
};
