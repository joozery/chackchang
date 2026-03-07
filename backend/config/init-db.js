import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
  try {
    // Connect without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create blacklist table
    const createBlacklistTable = `
      CREATE TABLE IF NOT EXISTS blacklist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        id_card VARCHAR(20),
        offense TEXT NOT NULL,
        work_type VARCHAR(255),
        reported_by VARCHAR(255) NOT NULL,
        bank_account VARCHAR(50),
        bank_name VARCHAR(100),
        transfer_date DATE,
        posted_date DATETIME,
        amount DECIMAL(10, 2) DEFAULT 0,
        report_count INT DEFAULT 1,
        total_amount DECIMAL(10, 2) DEFAULT 0,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_report_id (report_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createBlacklistTable);
    console.log('✅ Blacklist table created or already exists');

    // Create images table
    const createImagesTable = `
      CREATE TABLE IF NOT EXISTS blacklist_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        blacklist_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blacklist_id) REFERENCES blacklist(id) ON DELETE CASCADE,
        INDEX idx_blacklist_id (blacklist_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createImagesTable);
    console.log('✅ Images table created or already exists');

    // Create users table (updated for general users and technicians)
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        birth_date DATE,
        role ENUM('admin', 'moderator', 'user', 'technician') DEFAULT 'user',
        profile_image VARCHAR(500),
        line_id VARCHAR(100),
        facebook_link VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createUsersTable);
    console.log('✅ Users table created or already exists');

    // Add new columns to existing users table if they don't exist
    const columnsToAdd = [
      { name: 'email', type: 'VARCHAR(255)', after: 'password', unique: true },
      { name: 'first_name', type: 'VARCHAR(100)', after: 'email' },
      { name: 'last_name', type: 'VARCHAR(100)', after: 'first_name' },
      { name: 'phone', type: 'VARCHAR(20)', after: 'last_name' },
      { name: 'birth_date', type: 'DATE', after: 'phone' },
      { name: 'profile_image', type: 'VARCHAR(500)', after: 'role' },
      { name: 'line_id', type: 'VARCHAR(100)', after: 'profile_image' },
      { name: 'facebook_link', type: 'VARCHAR(500)', after: 'line_id' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE', after: 'facebook_link' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', after: 'created_at' },
    ];

    for (const col of columnsToAdd) {
      try {
        const uniqueClause = col.unique ? 'UNIQUE' : '';
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN ${col.name} ${col.type} ${uniqueClause} AFTER ${col.after}
        `);
        console.log(`✅ Added column: ${col.name}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          // Column already exists, skip
        } else {
          console.log(`⚠️  Error adding column ${col.name}: ${error.message}`);
        }
      }
    }

    // Update role enum
    try {
      await connection.query(`
        ALTER TABLE users 
        MODIFY COLUMN role ENUM('admin', 'moderator', 'user', 'technician') DEFAULT 'user'
      `);
      console.log('✅ Updated role enum');
    } catch (error) {
      console.log(`⚠️  Error updating role enum: ${error.message}`);
    }

    // Create technicians table for work types
    const createTechniciansTable = `
      CREATE TABLE IF NOT EXISTS technicians (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        work_types JSON,
        rating DECIMAL(3,2) DEFAULT 0.00,
        total_reviews INT DEFAULT 0,
        total_jobs INT DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_rating (rating),
        INDEX idx_is_verified (is_verified)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTechniciansTable);
    console.log('✅ Technicians table created or already exists');

    // Insert sample data if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM blacklist');
    if (rows[0].count === 0) {
      const insertSampleData = `
        INSERT INTO blacklist (report_id, name, id_card, offense, work_type, reported_by, bank_account, bank_name, transfer_date, posted_date, amount, report_count, total_amount, status) VALUES
        ('497050', 'สมชาย ทิ้งงาน', '1234567890123', 'รับเงินมัดจำแล้วหาย ไม่สามารถติดต่อได้', 'รับซ่อมบ้าน งานทาสี', 'สมหญิง ใจดี', '123-4-56789-0', 'ธนาคารกสิกรไทย', '2025-10-15', '2025-10-28 14:30:00', 15000.00, 1, 15000.00, 'approved'),
        ('497051', 'ประวิทย์ ไม่มา', '2110201076xxx', 'งานไม่เรียบร้อย ของไม่ตรงสเปคที่ตกลงกันไว้', 'งานติดตั้งแอร์', 'สมศักดิ์ แข็งแรง', '987-6-54321-0', 'ธนาคารกรุงเทพ', '2025-10-10', '2025-10-20 10:15:00', 8500.00, 2, 17000.00, 'approved'),
        ('497052', 'มานะ โกงเงิน', '3567890123456', 'เบิกเงินค่าของเกินจริง และไม่แสดงใบเสร็จ', 'งานไฟฟ้า ติดตั้งระบบไฟ', 'สมศรี มีสุข', '456-7-89012-3', 'ธนาคารไทยพาณิชย์', '2025-09-01', '2025-09-15 16:45:00', 12000.00, 3, 36000.00, 'approved'),
        ('497053', 'ชาติชาย ใช้วัสดุปลอม', '4890123456789', 'ใช้วัสดุราคาถูกกว่าที่ตกลงไว้ในสัญญา', 'งานปูกระเบื้อง', 'สมปอง อดทน', '789-0-12345-6', 'ธนาคารกรุงไทย', '2025-08-25', '2025-09-10 09:20:00', 5500.00, 1, 5500.00, 'approved');
      `;
      await connection.query(insertSampleData);
      console.log('✅ Sample data inserted');
    }

    await connection.end();
    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initDatabase;

