import pool from "../config/db.js";
export const createInquiry = async (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    console.log('--- Incoming Request Body:', req.body);
    console.log('--- Attempting DB Insert...');

    const result = await pool.query(
      `INSERT INTO contact_inquiries (full_name, email, phone, message) 
       VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
      [fullName, email.toLowerCase().trim(), phone || null, message]
    );

    console.log('--- Insert Successful, ID:', result.rows[0].id);

    return res.status(201).json({
      message: 'Inquiry submitted successfully.',
      inquiryId: result.rows[0].id,
    });
  } catch (err) {
    console.error('Inquiry Submission Error:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry.' });
  }
};