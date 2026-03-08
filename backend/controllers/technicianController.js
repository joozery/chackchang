import pool from '../config/database.js';

// Get all technicians (public endpoint)
export const getAllTechnicians = async (req, res) => {
  try {
    const { search, workType, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.profile_image,
        u.line_id,
        u.facebook_link,
        t.work_types,
        t.rating,
        t.total_reviews,
        t.total_jobs,
        t.is_verified,
        t.bio,
        t.province,
        t.created_at,
        t.updated_at
      FROM users u
      INNER JOIN technicians t ON u.id = t.user_id
      WHERE u.role = 'technician'
    `;

    const queryParams = [];

    // Add search filter
    if (search) {
      query += ` AND (
        u.username LIKE ? OR 
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR
        CONCAT(u.first_name, ' ', u.last_name) LIKE ? OR
        t.work_types LIKE ? OR
        t.bio LIKE ? OR
        t.province LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Add work type filter
    if (workType) {
      query += ` AND JSON_CONTAINS(t.work_types, ?)`;
      queryParams.push(JSON.stringify(workType));
    }

    // Order by rating and total reviews
    query += ` ORDER BY t.rating DESC, t.total_reviews DESC, t.total_jobs DESC`;

    // Add pagination
    query += ` LIMIT ? OFFSET ? `;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [technicians] = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      INNER JOIN technicians t ON u.id = t.user_id
      WHERE u.role = 'technician'
  `;
    const countParams = [];

    if (search) {
      countQuery += ` AND (
        u.username LIKE ? OR 
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR
        CONCAT(u.first_name, ' ', u.last_name) LIKE ? OR
        t.work_types LIKE ? OR
        t.bio LIKE ? OR
        t.province LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (workType) {
      countQuery += ` AND JSON_CONTAINS(t.work_types, ?)`;
      countParams.push(JSON.stringify(workType));
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    // Parse work_types JSON
    const formattedTechnicians = technicians.map(tech => {
      let workTypes = [];
      try {
        if (typeof tech.work_types === 'string') {
          workTypes = JSON.parse(tech.work_types);
        } else if (Array.isArray(tech.work_types)) {
          workTypes = tech.work_types;
        }
      } catch (e) {
        console.error('Error parsing work_types:', e);
      }

      return {
        id: tech.id,
        username: tech.username,
        firstName: tech.first_name,
        lastName: tech.last_name,
        fullName: `${tech.first_name || ''} ${tech.last_name || ''}`.trim() || tech.username,
        email: tech.email,
        phone: tech.phone,
        profileImage: tech.profile_image,
        lineId: tech.line_id,
        facebookLink: tech.facebook_link,
        workTypes: workTypes,
        rating: tech.rating || 0,
        totalReviews: tech.total_reviews || 0,
        totalJobs: tech.total_jobs || 0,
        isVerified: tech.is_verified || false,
        createdAt: tech.created_at,
        updatedAt: tech.updated_at,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedTechnicians,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get technicians error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่าง',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get technician by ID (public endpoint)
export const getTechnicianById = async (req, res) => {
  try {
    const { id } = req.params;

    const [technicians] = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.profile_image,
        u.line_id,
        u.facebook_link,
        t.work_types,
        t.rating,
        t.total_reviews,
        t.total_jobs,
        t.is_verified,
        t.bio,
        t.created_at,
        t.updated_at
      FROM users u
      INNER JOIN technicians t ON u.id = t.user_id
      WHERE u.id = ? AND u.role = 'technician'`,
      [id]
    );

    if (technicians.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลช่าง',
      });
    }

    const tech = technicians[0];
    let workTypes = [];
    try {
      if (typeof tech.work_types === 'string') {
        workTypes = JSON.parse(tech.work_types);
      } else if (Array.isArray(tech.work_types)) {
        workTypes = tech.work_types;
      }
    } catch (e) {
      console.error('Error parsing work_types:', e);
    }

    const formattedTechnician = {
      id: tech.id,
      username: tech.username,
      firstName: tech.first_name,
      lastName: tech.last_name,
      fullName: `${tech.first_name || ''} ${tech.last_name || ''}`.trim() || tech.username,
      email: tech.email,
      phone: tech.phone,
      profileImage: tech.profile_image,
      lineId: tech.line_id,
      facebookLink: tech.facebook_link,
      workTypes: workTypes,
      rating: tech.rating || 0,
      totalReviews: tech.total_reviews || 0,
      totalJobs: tech.total_jobs || 0,
      isVerified: tech.is_verified || false,
      bio: tech.bio || '',
      createdAt: tech.created_at,
      updatedAt: tech.updated_at,
    };

    res.status(200).json({
      success: true,
      data: formattedTechnician,
    });
  } catch (error) {
    console.error('Get technician by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่าง',
    });
  }
};
// Update technician (admin only)
export const updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, workTypes, rating, totalReviews, totalJobs } = req.body;

    const [result] = await pool.query(
      `UPDATE technicians 
       SET is_verified = ?, 
           work_types = ?, 
           rating = ?, 
           total_reviews = ?, 
           total_jobs = ? 
       WHERE user_id = ?`,
      [
        isVerified ? 1 : 0,
        JSON.stringify(workTypes || []),
        rating || 0,
        totalReviews || 0,
        totalJobs || 0,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลช่างที่ต้องการแก้ไข',
      });
    }

    res.status(200).json({
      success: true,
      message: 'อัปเดตข้อมูลช่างเรียบร้อยแล้ว',
    });
  } catch (error) {
    console.error('Update technician error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลช่าง',
    });
  }
};

// Delete technician (admin only)
export const deleteTechnician = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if technician exists
    const [tech] = await pool.query('SELECT * FROM technicians WHERE user_id = ?', [id]);
    if (tech.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลช่าง',
      });
    }

    // Delete user (this usually cascades to technicians if DB is set up correctly)
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลสมาชิกในระบบ',
      });
    }

    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลสมาชิกระบบเรียบร้อยแล้ว',
    });
  } catch (error) {
    console.error('Delete technician error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
      error: error.message
    });
  }
};

// Get portfolio items for a technician
export const getPortfolioItems = async (req, res) => {
  try {
    const { id } = req.params; // id can be user_id or technician_id context

    // First, find the technician record ID for this user ID
    const [technicians] = await pool.query('SELECT id FROM technicians WHERE user_id = ?', [id]);

    if (technicians.length === 0) {
      // If we didn't find them by user_id, they might have passed technician_id directly
      const [techsById] = await pool.query('SELECT id FROM technicians WHERE id = ?', [id]);
      if (techsById.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลช่าง'
        });
      }
      var technicianId = techsById[0].id;
    } else {
      var technicianId = technicians[0].id;
    }

    const [portfolios] = await pool.query(
      'SELECT id, title, description, image_url, created_at FROM technician_portfolios WHERE technician_id = ? ORDER BY created_at DESC',
      [technicianId]
    );

    res.json({
      success: true,
      data: portfolios
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผลงาน'
    });
  }
};

// Add portfolio item
export const addPortfolioItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาอัปโหลดรูปภาพผลงาน'
      });
    }

    // Find technician ID
    const [technicians] = await pool.query('SELECT id FROM technicians WHERE user_id = ?', [userId]);
    if (technicians.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่สามารถเพิ่มผลงานได้เนื่องจากคุณยังไม่ได้รับการลงทะเบียนเป็นช่าง'
      });
    }

    const technicianId = technicians[0].id;

    await pool.query(
      'INSERT INTO technician_portfolios (technician_id, title, description, image_url) VALUES (?, ?, ?, ?)',
      [technicianId, title || null, description || null, image.path]
    );

    res.json({
      success: true,
      message: 'เพิ่มผลงานสำเร็จ'
    });
  } catch (error) {
    console.error('Add portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มผลงาน'
    });
  }
};

// Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // Verify ownership
    const [technicians] = await pool.query('SELECT id FROM technicians WHERE user_id = ?', [userId]);
    if (technicians.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์ลบข้อมูลนี้'
      });
    }

    const technicianId = technicians[0].id;

    const [result] = await pool.query(
      'DELETE FROM technician_portfolios WHERE id = ? AND technician_id = ?',
      [id, technicianId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผลงานหรือคุณไม่มีสิทธิ์ลบผลงานนี้'
      });
    }

    res.json({
      success: true,
      message: 'ลบผลงานสำเร็จ'
    });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบผลงาน'
    });
  }
};
