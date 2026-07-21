import pool from '../config/db.js';

// Public: Get list of dental services for frontend forms/cards
export const getServices = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};