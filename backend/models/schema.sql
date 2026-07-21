-- =============================================================================
-- Harbord Dentistry Schema
-- Target Engine: PostgreSQL 13+
-- Target Database: clinic_db
-- Features: RBAC Auth (Admin, Doctor, Staff), Patient Requests, 
--           Doctor Profiles, and JWT Refresh Tokens.
-- =============================================================================

-- Ensure extensions for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Custom ENUM Types
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'DOCTOR', 'STAFF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'SPAM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE weekday_name AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE time_slot_name AS ENUM ('Morning', 'Noon', 'Afternoon', 'Evening');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- -----------------------------------------------------------------------------
-- 2. System Users & Auth Table (Admins, Doctors, Staff)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'STAFF',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);


-- -----------------------------------------------------------------------------
-- 3. Doctor Profiles Table (Extended metadata for Doctor users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    specialization VARCHAR(100) DEFAULT 'General Dentistry',
    license_number VARCHAR(50) NOT NULL UNIQUE,
    bio TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- -----------------------------------------------------------------------------
-- 4. Contact Inquiries Table (For Contact Us form)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NULL,
    message TEXT NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_inquiries(status);


-- -----------------------------------------------------------------------------
-- 5. Patients Table (For Book a Visit form)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    is_new_patient BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patient_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patient_phone ON patients(phone);


-- -----------------------------------------------------------------------------
-- 6. Appointment Requests Table (Linked to Patient & Assigned Doctor)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointment_requests (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    assigned_doctor_id INT NULL REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    reason_for_visit VARCHAR(150) NOT NULL,
    is_in_pain BOOLEAN NOT NULL DEFAULT FALSE,
    additional_notes TEXT NULL,
    status appointment_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointment_status ON appointment_requests(status);
CREATE INDEX IF NOT EXISTS idx_appointment_doctor ON appointment_requests(assigned_doctor_id);


-- -----------------------------------------------------------------------------
-- 7. Appointment Preferred Days Junction Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointment_preferred_days (
    id SERIAL PRIMARY KEY,
    appointment_request_id INT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE ON UPDATE CASCADE,
    day_name weekday_name NOT NULL,
    
    CONSTRAINT uq_appointment_day UNIQUE (appointment_request_id, day_name)
);


-- -----------------------------------------------------------------------------
-- 8. Appointment Preferred Times Junction Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointment_preferred_times (
    id SERIAL PRIMARY KEY,
    appointment_request_id INT NOT NULL REFERENCES appointment_requests(id) ON DELETE CASCADE ON UPDATE CASCADE,
    time_slot time_slot_name NOT NULL,
    
    CONSTRAINT uq_appointment_time UNIQUE (appointment_request_id, time_slot)
);


-- -----------------------------------------------------------------------------
-- 9. Refresh Tokens Table (JWT Session Management for Auth APIs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_token_user ON refresh_tokens(user_id);


-- -----------------------------------------------------------------------------
-- 10. Automated updated_at Trigger Function
-- Automatically updates timestamp columns on edit.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach triggers to tables with updated_at columns
CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_appointment_requests_updated_at BEFORE UPDATE ON appointment_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();