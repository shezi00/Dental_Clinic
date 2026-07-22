import pool from "../config/db.js";
import { sendEmail } from '../config/mailer.js';
// GET /api/inquiries - Retrieve all inquiries for Admin Dashboard
// GET /api/inquiries - Retrieve all inquiries for Admin Dashboard
export const getInquiries = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, phone, message, status, created_at 
       FROM contact_inquiries 
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      inquiries: result.rows,
    });
  } catch (err) {
    console.error('Error fetching contact inquiries:', err);
    return res.status(500).json({ error: 'Failed to retrieve inquiries.' });
  }
};

// POST /api/inquiries - Submit public contact form
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
export const replyToInquiry = async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;

  if (!replyMessage || !replyMessage.trim()) {
    return res.status(400).json({ error: 'Reply message cannot be empty.' });
  }

  try {
    // 1. Fetch inquiry recipient
    const result = await pool.query(
      'SELECT id, full_name, email, message FROM contact_inquiries WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    const inquiry = result.rows[0];

    // 2. Build and send reply email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0891b2; margin-bottom: 8px;">Harbord Dentistry</h2>
        <p style="color: #64748b; font-size: 13px;">Response to your contact inquiry</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />

        <p>Hi <strong>${inquiry.full_name || 'there'}</strong>,</p>
        
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #1e293b;">
          ${replyMessage.replace(/\n/g, '<br/>')}
        </div>

        <div style="background-color: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 24px; font-size: 12px; color: #64748b;">
          <strong>Your Original Inquiry:</strong><br/>
          "${inquiry.message}"
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
          Warm regards,<br/>
          <strong>Harbord Dentistry Team</strong>
        </p>
      </div>
    `;

    await sendEmail({
      to: inquiry.email,
      subject: 'Response to your inquiry - Harbord Dentistry',
      html: emailContent,
    });

    // 3. Mark status as RESOLVED in database
    await pool.query(
      "UPDATE contact_inquiries SET status = 'RESOLVED' WHERE id = $1",
      [id]
    );

    return res.status(200).json({
      message: 'Reply sent successfully and inquiry marked as RESOLVED.',
    });
  } catch (err) {
    console.error('Error replying to inquiry:', err);
    return res.status(500).json({ error: 'Failed to send reply email.' });
  }
};