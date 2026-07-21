import pool from './config/db.js'; // Adjust path to your db pool file
import bcrypt from 'bcrypt';

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seed...');

    await client.query('BEGIN'); // Start Transaction

    // 1. Hash Default Passwords
    const saltRounds = 10;
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', saltRounds);
    const doctorPasswordHash = await bcrypt.hash('DoctorPass123!', saltRounds);

    // 2. Insert System Users (Admin, Doctors, Staff)
    console.log('👤 Inserting System Users...');
    const usersQuery = `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES 
        ('Dr. Alex Mercer', 'admin@harborddentistry.com', $1, 'ADMIN'),
        ('Dr. Sarah Jenkins', 'dr.jenkins@harborddentistry.com', $2, 'DOCTOR'),
        ('Dr. Michael Chen', 'dr.chen@harborddentistry.com', $2, 'DOCTOR'),
        ('Emily Watson', 'staff@harborddentistry.com', $2, 'STAFF')
      ON CONFLICT (email) DO UPDATE 
        SET full_name = EXCLUDED.full_name
      RETURNING id, full_name, email, role;
    `;
    const userRes = await client.query(usersQuery, [adminPasswordHash, doctorPasswordHash]);
    
    // Map user IDs by email for foreign key assignments
    const userMap = {};
    userRes.rows.forEach(u => {
      userMap[u.email] = u.id;
    });

    // 3. Insert Doctor Profiles
    console.log('🩺 Inserting Doctor Profiles...');
    const doctorProfilesQuery = `
      INSERT INTO doctor_profiles (user_id, specialization, license_number, bio)
      VALUES 
        ($1, 'Cosmetic & Restorative Dentistry', 'ON-DENT-88492', 'Dr. Jenkins has over 12 years of clinical experience specializing in porcelain veneers and full-mouth rehabilitation.'),
        ($2, 'Orthodontics & Invisalign', 'ON-DENT-91034', 'Dr. Chen is a certified Invisalign Provider focused on modern alignment techniques and airway-focused dentistry.')
      ON CONFLICT (user_id) DO NOTHING;
    `;
    await client.query(doctorProfilesQuery, [
      userMap['dr.jenkins@harborddentistry.com'],
      userMap['dr.chen@harborddentistry.com']
    ]);

    // 4. Insert Dummy Patients
    console.log('👨‍👩‍👧 Inserting Patients...');
    const patientsQuery = `
      INSERT INTO patients (full_name, email, phone, is_new_patient)
      VALUES 
        ('John Doe', 'john.doe@example.com', '416-555-0143', TRUE),
        ('Claire Redfield', 'claire.r@example.com', '416-555-0198', FALSE),
        ('Robert Taylor', 'rtaylor@example.com', '647-555-0112', TRUE)
      ON CONFLICT (email) DO UPDATE 
        SET phone = EXCLUDED.phone
      RETURNING id, email;
    `;
    const patientRes = await client.query(patientsQuery);
    const patientMap = {};
    patientRes.rows.forEach(p => {
      patientMap[p.email] = p.id;
    });

    // 5. Insert Appointment Requests
    console.log('📅 Inserting Appointment Requests...');
    
    // Request 1: Emergency Pain (Assigned to Dr. Jenkins)
    const appt1Res = await client.query(`
      INSERT INTO appointment_requests (patient_id, assigned_doctor_id, reason_for_visit, is_in_pain, additional_notes, status)
      VALUES ($1, $2, 'Severe molar toothache', TRUE, 'Pain started yesterday night, sensitive to hot/cold.', 'CONFIRMED')
      RETURNING id;
    `, [patientMap['john.doe@example.com'], userMap['dr.jenkins@harborddentistry.com']]);
    const appt1Id = appt1Res.rows[0].id;

    // Preferences for Request 1
    await client.query(`
      INSERT INTO appointment_preferred_days (appointment_request_id, day_name)
      VALUES ($1, 'Monday'), ($1, 'Tuesday')
      ON CONFLICT DO NOTHING;
    `, [appt1Id]);

    await client.query(`
      INSERT INTO appointment_preferred_times (appointment_request_id, time_slot)
      VALUES ($1, 'Morning'), ($1, 'Noon')
      ON CONFLICT DO NOTHING;
    `, [appt1Id]);

    // Request 2: Routine Checkup & Cleaning (Unassigned Pending)
    const appt2Res = await client.query(`
      INSERT INTO appointment_requests (patient_id, assigned_doctor_id, reason_for_visit, is_in_pain, additional_notes, status)
      VALUES ($1, NULL, 'Hygiene Cleaning & Checkup', FALSE, 'Due for biannual cleaning. Prefer afternoon if available.', 'PENDING')
      RETURNING id;
    `, [patientMap['claire.r@example.com']]);
    const appt2Id = appt2Res.rows[0].id;

    // Preferences for Request 2
    await client.query(`
      INSERT INTO appointment_preferred_days (appointment_request_id, day_name)
      VALUES ($1, 'Wednesday'), ($1, 'Thursday'), ($1, 'Friday')
      ON CONFLICT DO NOTHING;
    `, [appt2Id]);

    await client.query(`
      INSERT INTO appointment_preferred_times (appointment_request_id, time_slot)
      VALUES ($1, 'Afternoon'), ($1, 'Evening')
      ON CONFLICT DO NOTHING;
    `, [appt2Id]);

    // Request 3: Invisalign Consultation (Assigned to Dr. Chen)
    const appt3Res = await client.query(`
      INSERT INTO appointment_requests (patient_id, assigned_doctor_id, reason_for_visit, is_in_pain, additional_notes, status)
      VALUES ($1, $2, 'Invisalign / Ortho Consultation', FALSE, 'Looking to correct crowding in lower front teeth.', 'PENDING')
      RETURNING id;
    `, [patientMap['rtaylor@example.com'], userMap['dr.chen@harborddentistry.com']]);
    const appt3Id = appt3Res.rows[0].id;

    await client.query(`
      INSERT INTO appointment_preferred_days (appointment_request_id, day_name)
      VALUES ($1, 'Friday')
      ON CONFLICT DO NOTHING;
    `, [appt3Id]);

    await client.query(`
      INSERT INTO appointment_preferred_times (appointment_request_id, time_slot)
      VALUES ($1, 'Morning')
      ON CONFLICT DO NOTHING;
    `, [appt3Id]);

    // 6. Insert Contact Inquiries
    console.log('📬 Inserting Contact Inquiries...');
    await client.query(`
      INSERT INTO contact_inquiries (full_name, email, phone, message, status)
      VALUES 
        ('Marcus Vance', 'marcus.v@example.com', '416-555-0921', 'Hi, do you offer direct billing to Sun Life insurance?', 'NEW'),
        ('Sophia Patel', 'spatel@example.com', NULL, 'Interested in booking a teeth whitening session. What are your current rates?', 'IN_PROGRESS')
      ON CONFLICT DO NOTHING;
    `);

    await client.query('COMMIT'); // Commit Transaction

    console.log('--------------------------------------------------');
    console.log('✅ Seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('🔑 CREDENTIALS CREATED:');
    console.log('   [ADMIN]  Email: admin@harborddentistry.com    Pass: AdminPass123!');
    console.log('   [DOCTOR] Email: dr.jenkins@harborddentistry.com Pass: DoctorPass123!');
    console.log('   [DOCTOR] Email: dr.chen@harborddentistry.com    Pass: DoctorPass123!');
    console.log('   [STAFF]  Email: staff@harborddentistry.com     Pass: DoctorPass123!');
    console.log('--------------------------------------------------');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed, transaction rolled back:', err);
  } finally {
    client.release();
    process.exit();
  }
}

seedDatabase();