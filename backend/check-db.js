import pool from './config/database.js';

const checkTable = async () => {
    try {
        const [rows] = await pool.query('DESCRIBE users');
        console.log('Columns in "users" table:');
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
        process.exit(0);
    } catch (error) {
        console.error('Error checking table:', error);
        process.exit(1);
    }
};

checkTable();
