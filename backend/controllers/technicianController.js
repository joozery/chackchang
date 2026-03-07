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
        CONCAT(u.first_name, ' ', u.last_name) LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Add work type filter
    if (workType) {
      query += ` AND JSON_CONTAINS(t.work_types, ?)`;
      queryParams.push(JSON.stringify(workType));
    }

    // Order by rating and total reviews
    query += ` ORDER BY t.rating DESC, t.total_reviews DESC, t.total_jobs DESC`;

    // Add pagination
    query += ` LIMIT ? OFFSET ?`;
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
        CONCAT(u.first_name, ' ', u.last_name) LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
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

