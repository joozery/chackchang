import pool from './config/database.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        console.log('Seeding admin user...');
        const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', ['admin']);

        if (rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);

            await pool.query(
                'INSERT INTO users (username, email, password, first_name, last_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
                ['admin', 'admin@checkchang.com', hashedPassword, 'Admin', 'System', 'admin', 1]
            );
            console.log('✅ Admin user "admin" created with password "admin"');
        } else {
            console.log('ℹ️ Admin user already exists');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedAdmin();
