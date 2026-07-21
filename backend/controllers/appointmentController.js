import pool from '../config/db.js';

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
        COALESCE(ARRAY_AGG(DISTINCT pd.day_name), '{}') AS preferred_days,
        COALESCE(ARRAY_AGG(DISTINCT pt.time_slot), '{}') AS preferred_times
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