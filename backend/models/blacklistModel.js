import pool from '../config/database.js';

class BlacklistModel {
  // Get all blacklist entries
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          id, report_id as reportId, name, id_card as idCard, offense, 
          work_type as workType, reported_by as reportedBy, 
          bank_account as bankAccount, bank_name as bankName,
          DATE_FORMAT(transfer_date, '%Y-%m-%d') as transferDate,
          DATE_FORMAT(posted_date, '%Y-%m-%d %H:%i') as postedDate,
          DATE_FORMAT(created_at, '%Y-%m-%d') as date,
          amount, report_count as reportCount, total_amount as totalAmount, 
          status, description, created_at, updated_at
        FROM blacklist
      `;

      const conditions = [];
      const params = [];

      if (filters.status && filters.status !== 'all') {
        conditions.push('status = ?');
        params.push(filters.status);
      }

      if (filters.search) {
        conditions.push('(name LIKE ? OR offense LIKE ? OR id_card LIKE ? OR work_type LIKE ? OR bank_account LIKE ? OR bank_name LIKE ? OR description LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get approved blacklist (public)
  static async getApproved(search = '') {
    try {
      let query = `
        SELECT 
          id, report_id as reportId, name, id_card as idCard, offense, 
          work_type as workType, reported_by as reportedBy,
          bank_account as bankAccount, bank_name as bankName,
          DATE_FORMAT(transfer_date, '%Y-%m-%d') as transferDate,
          DATE_FORMAT(posted_date, '%Y-%m-%d %H:%i') as postedDate,
          DATE_FORMAT(created_at, '%Y-%m-%d') as date,
          amount, report_count as reportCount, total_amount as totalAmount
        FROM blacklist
        WHERE status = 'approved'
      `;

      const params = [];

      if (search) {
        query += ' AND (name LIKE ? OR offense LIKE ? OR id_card LIKE ? OR work_type LIKE ? OR bank_account LIKE ? OR bank_name LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        `SELECT 
          id, report_id as reportId, name, id_card as idCard, offense, 
          work_type as workType, reported_by as reportedBy,
          bank_account as bankAccount, bank_name as bankName,
          DATE_FORMAT(transfer_date, '%Y-%m-%d') as transferDate,
          DATE_FORMAT(posted_date, '%Y-%m-%d %H:%i') as postedDate,
          DATE_FORMAT(created_at, '%Y-%m-%d') as date,
          amount, report_count as reportCount, total_amount as totalAmount, 
          status, description, created_at, updated_at
        FROM blacklist 
        WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new entry
  static async create(data) {
    try {
      const reportId = Date.now().toString().slice(-6);
      const [result] = await pool.query(
        `INSERT INTO blacklist 
        (report_id, name, id_card, offense, work_type, reported_by, 
         bank_account, bank_name, transfer_date, posted_date, amount, 
         report_count, total_amount, status, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportId,
          data.name,
          data.idCard || null,
          data.offense,
          data.workType || null,
          data.reportedBy,
          data.bankAccount || null,
          data.bankName || null,
          data.transferDate || null,
          data.postedDate || null,
          data.amount || 0,
          data.reportCount || 1,
          data.totalAmount || data.amount || 0,
          data.status || 'pending',
          data.description || null,
        ]
      );

      return { id: result.insertId, reportId };
    } catch (error) {
      throw error;
    }
  }

  // Update entry
  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      const mapping = {
        name: 'name',
        idCard: 'id_card',
        offense: 'offense',
        workType: 'work_type',
        reportedBy: 'reported_by',
        bankAccount: 'bank_account',
        bankName: 'bank_name',
        transferDate: 'transfer_date',
        postedDate: 'posted_date',
        amount: 'amount',
        reportCount: 'report_count',
        totalAmount: 'total_amount',
        status: 'status',
        description: 'description',
      };

      Object.keys(data).forEach((key) => {
        if (mapping[key] && data[key] !== undefined) {
          fields.push(`${mapping[key]} = ?`);
          values.push(data[key]);
        }
      });

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      const [result] = await pool.query(
        `UPDATE blacklist SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update status
  static async updateStatus(id, status) {
    try {
      const [result] = await pool.query(
        'UPDATE blacklist SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete entry
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM blacklist WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          SUM(total_amount) as totalAmount,
          SUM(report_count) as totalReports
        FROM blacklist
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

export default BlacklistModel;

