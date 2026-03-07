import BlacklistModel from '../models/blacklistModel.js';

class BlacklistController {
  // Get all blacklist (admin)
  static async getAll(req, res) {
    try {
      const { status, search, limit } = req.query;
      const filters = { status, search, limit };
      
      const blacklist = await BlacklistModel.getAll(filters);
      
      res.json({
        success: true,
        count: blacklist.length,
        data: blacklist,
      });
    } catch (error) {
      console.error('Error getting blacklist:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error.message,
      });
    }
  }

  // Get approved blacklist (public)
  static async getApproved(req, res) {
    try {
      const { search } = req.query;
      const blacklist = await BlacklistModel.getApproved(search);
      
      res.json({
        success: true,
        count: blacklist.length,
        data: blacklist,
      });
    } catch (error) {
      console.error('Error getting approved blacklist:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error.message,
      });
    }
  }

  // Get by ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const entry = await BlacklistModel.getById(id);
      
      if (!entry) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลที่ต้องการ',
        });
      }

      res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      console.error('Error getting blacklist by ID:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: error.message,
      });
    }
  }

  // Create new entry
  static async create(req, res) {
    try {
      const data = req.body;

      // Validate required fields
      if (!data.name || !data.offense || !data.reportedBy) {
        return res.status(400).json({
          success: false,
          message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, พฤติกรรม, ผู้แจ้ง)',
        });
      }

      const result = await BlacklistModel.create(data);
      
      res.status(201).json({
        success: true,
        message: 'เพิ่มข้อมูลสำเร็จ',
        data: { id: result.id, reportId: result.reportId },
      });
    } catch (error) {
      console.error('Error creating blacklist entry:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
        error: error.message,
      });
    }
  }

  // Update entry
  static async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const success = await BlacklistModel.update(id, data);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
        });
      }

      res.json({
        success: true,
        message: 'แก้ไขข้อมูลสำเร็จ',
      });
    } catch (error) {
      console.error('Error updating blacklist entry:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล',
        error: error.message,
      });
    }
  }

  // Update status
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'สถานะไม่ถูกต้อง',
        });
      }

      const success = await BlacklistModel.updateStatus(id, status);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลที่ต้องการอัปเดต',
        });
      }

      res.json({
        success: true,
        message: 'อัปเดตสถานะสำเร็จ',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ',
        error: error.message,
      });
    }
  }

  // Delete entry
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await BlacklistModel.delete(id);
      
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลที่ต้องการลบ',
        });
      }

      res.json({
        success: true,
        message: 'ลบข้อมูลสำเร็จ',
      });
    } catch (error) {
      console.error('Error deleting blacklist entry:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
        error: error.message,
      });
    }
  }

  // Get statistics
  static async getStats(req, res) {
    try {
      const stats = await BlacklistModel.getStats();
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error getting statistics:', error);
      res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงสถิติ',
        error: error.message,
      });
    }
  }
}

export default BlacklistController;

