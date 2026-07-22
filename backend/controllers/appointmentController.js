import pool from '../config/db.js';
import { sendEmail } from '../config/mailer.js';
// Public: Submit Appointment Request
export const createAppointmentRequest = async (req, res) => {
  const client = await pool.connect();

  try {
    const { 
      fullName, 
      email, 
      phone, 
      isNewPatient, 
      reasonForVisit, 
      isInPain, 
      additionalNotes, 
      preferredDays, 
      preferredTimes 
    } = req.body;

    if (!fullName || !email || !phone || !reasonForVisit) {
      return res.status(400).json({ error: 'Required fields missing.' });
    }

    await client.query('BEGIN'); // Start Transaction

    // 1. Check or Insert Patient
    let patientRes = await client.query('SELECT id FROM patients WHERE email = $1', [email.toLowerCase().trim()]);
    let patientId;

    if (patientRes.rows.length === 0) {
      const newPatientRes = await client.query(
        `INSERT INTO patients (full_name, email, phone, is_new_patient) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [fullName, email.toLowerCase().trim(), phone, isNewPatient ?? true]
      );
      patientId = newPatientRes.rows[0].id;
    } else {
      patientId = patientRes.rows[0].id;
    }

    // 2. Create Appointment Request
    const apptRes = await client.query(
      `INSERT INTO appointment_requests (patient_id, reason_for_visit, is_in_pain, additional_notes) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [patientId, reasonForVisit, isInPain ?? false, additionalNotes || null]
    );
    const appointmentRequestId = apptRes.rows[0].id;

    // 3. Insert Preferred Days
    if (Array.isArray(preferredDays) && preferredDays.length > 0) {
      for (const day of preferredDays) {
        await client.query(
          `INSERT INTO appointment_preferred_days (appointment_request_id, day_name) VALUES ($1, $2)`,
          [appointmentRequestId, day]
        );
      }
    }

    // 4. Insert Preferred Times
    if (Array.isArray(preferredTimes) && preferredTimes.length > 0) {
      for (const timeSlot of preferredTimes) {
        await client.query(
          `INSERT INTO appointment_preferred_times (appointment_request_id, time_slot) VALUES ($1, $2)`,
          [appointmentRequestId, timeSlot]
        );
      }
    }

    await client.query('COMMIT'); // Commit Transaction
    return res.status(201).json({ message: 'Appointment request submitted successfully!', appointmentRequestId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Booking Error:', err);
    return res.status(500).json({ error: 'Failed to process appointment request.' });
  } finally {
    client.release();
  }
};

// Protected: Get All Appointments (For Admin, Doctor, Staff)
export const getAllAppointments = async (req, res) => {
  try {
    const query = `
      SELECT 
        ar.id, 
        p.full_name AS patient_name, 
        p.email AS patient_email, 
        p.phone AS patient_phone,
        p.is_new_patient,
        ar.reason_for_visit, 
        ar.is_in_pain, 
        ar.status, 
        ar.created_at,
        u.full_name AS assigned_doctor,
        COALESCE(
          json_agg(DISTINCT pd.day_name) FILTER (WHERE pd.day_name IS NOT NULL), 
          '[]'::json
        ) AS preferred_days,
        COALESCE(
          json_agg(DISTINCT pt.time_slot) FILTER (WHERE pt.time_slot IS NOT NULL), 
          '[]'::json
        ) AS preferred_times
      FROM appointment_requests ar
      JOIN patients p ON ar.patient_id = p.id
      LEFT JOIN users u ON ar.assigned_doctor_id = u.id
      LEFT JOIN appointment_preferred_days pd ON ar.id = pd.appointment_request_id
      LEFT JOIN appointment_preferred_times pt ON ar.id = pt.appointment_request_id
      GROUP BY ar.id, p.id, u.id
      ORDER BY ar.created_at DESC;
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Fetch Appointments Error:', err);
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
};

// Protected: Update Appointment Status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({ error: 'Invalid or missing status value.' });
  }

  const uppercaseStatus = status.toUpperCase();

  try {
    // 1. Update status & fetch patient details for email
    const result = await pool.query(
      `UPDATE appointment_requests ar
       SET status = $1 
       FROM patients p
       WHERE ar.patient_id = p.id AND ar.id = $2
       RETURNING ar.id, ar.status, ar.reason_for_visit, p.full_name AS patient_name, p.email AS patient_email`,
      [uppercaseStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment request not found.' });
    }

    const appt = result.rows[0];

    // 2. Trigger automated email if status changed to CONFIRMED
    if (uppercaseStatus === 'CONFIRMED' && appt.patient_email) {
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #0891b2; margin-bottom: 8px;">Harbord Dentistry</h2>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
          
          <p>Dear <strong>${appt.patient_name}</strong>,</p>
          <p>Great news! Your appointment request at Harbord Dentistry has been <strong>CONFIRMED</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0891b2;">
            <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Reason for Visit:</strong> ${appt.reason_for_visit}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;"><strong>Status:</strong> Confirmed</p>
          </div>

          <p>If you need to reschedule or have any questions prior to your visit, please feel free to call our office directly.</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
            Best regards,<br/>
            <strong>Harbord Dentistry Team</strong>
          </p>
        </div>
      `;

      // Send asynchronously without blocking HTTP response
      sendEmail({
        to: appt.patient_email,
        subject: 'Appointment Confirmed - Harbord Dentistry',
        html: emailContent,
      });
    }

    return res.status(200).json({
      message: 'Status updated successfully.',
      appointment: appt,
    });
  } catch (err) {
    console.error('Update Appointment Status Error:', err);
    return res.status(500).json({ error: 'Failed to update appointment status.' });
  }
};