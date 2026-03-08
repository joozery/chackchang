import pool from '../config/database.js';

export const getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const [rows] = await pool.query('SELECT value FROM app_settings WHERE `key` = ?', [key]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Setting not found' });
        }

        res.json({ success: true, data: rows[0].value });
    } catch (error) {
        console.error('getSetting error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        await pool.query(
            'INSERT INTO app_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
            [key, JSON.stringify(value), JSON.stringify(value)]
        );

        res.json({ success: true, message: 'Setting updated successfully' });
    } catch (error) {
        console.error('updateSetting error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
