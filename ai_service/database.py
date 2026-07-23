import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def save_appointment_request(
    patient_name: str,
    patient_email: str,
    patient_phone: str,
    reason_for_visit: str,
    is_new_patient: bool = True,
    is_in_pain: bool = False,
    preferred_days: list = None,
    preferred_times: list = None
) -> dict:
    preferred_days = preferred_days or []
    preferred_times = preferred_times or []

    # Valid schema ENUMs
    valid_days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"}
    valid_times = {"Morning", "Noon", "Afternoon", "Evening"}

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # 1. Upsert Patient (Get existing patient_id or create new)
            cur.execute("""
                INSERT INTO patients (full_name, email, phone, is_new_patient)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (email) 
                DO UPDATE SET 
                    full_name = EXCLUDED.full_name,
                    phone = EXCLUDED.phone,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id;
            """, (patient_name, patient_email, patient_phone, is_new_patient))
            
            patient_id = cur.fetchone()[0]

            # 2. Insert Appointment Request
            cur.execute("""
                INSERT INTO appointment_requests (
                    patient_id, 
                    reason_for_visit, 
                    is_in_pain, 
                    status
                )
                VALUES (%s, %s, %s, 'PENDING')
                RETURNING id;
            """, (patient_id, reason_for_visit, is_in_pain))
            
            appointment_id = cur.fetchone()[0]

            # 3. Insert Preferred Days (Junction Table)
            for day in preferred_days:
                # Sanitize case matching schema ENUM ('Monday', 'Tuesday', etc.)
                formatted_day = day.capitalize()
                if formatted_day in valid_days:
                    cur.execute("""
                        INSERT INTO appointment_preferred_days (appointment_request_id, day_name)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (appointment_id, formatted_day))

            # 4. Insert Preferred Times (Junction Table)
            for time_slot in preferred_times:
                # Sanitize case matching schema ENUM ('Morning', 'Noon', 'Afternoon', 'Evening')
                formatted_time = time_slot.capitalize()
                if formatted_time in valid_times:
                    cur.execute("""
                        INSERT INTO appointment_preferred_times (appointment_request_id, time_slot)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (appointment_id, formatted_time))

        conn.commit()
        return {"status": "success", "booking_id": appointment_id}

    except Exception as e:
        if conn:
            conn.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        if conn:
            conn.close()