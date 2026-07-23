// controllers/dashboardController.js
import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      pendingApptsRes,
      emergencyApptsRes,
      unreadInquiriesRes,
      recentApptsRes,
      recentInquiriesRes,
      weeklyTrendsRes
    ] = await Promise.all([
      // Pending appointments needing action
      pool.query("SELECT COUNT(*)::int FROM appointment_requests WHERE status = 'PENDING'"),
      
      // Emergency requests: is_in_pain = TRUE and strictly active (exclude CANCELLED and COMPLETED)
      pool.query("SELECT COUNT(*)::int FROM appointment_requests WHERE is_in_pain = TRUE AND status NOT IN ('CANCELLED', 'COMPLETED')"),
      
      // Unread/Pending inquiries
      pool.query("SELECT COUNT(*)::int FROM contact_inquiries WHERE status IN ('NEW', 'IN_PROGRESS')"),
      
      // Recent 5 appointment requests
      pool.query(`
        SELECT ar.id, p.full_name, ar.reason_for_visit, ar.is_in_pain, ar.status, ar.created_at, 'APPOINTMENT' as type
        FROM appointment_requests ar
        JOIN patients p ON ar.patient_id = p.id
        ORDER BY ar.created_at DESC LIMIT 5
      `),

      // Recent 5 contact inquiries
      pool.query(`
        SELECT id, full_name, message as details, FALSE as is_in_pain, status, created_at, 'INQUIRY' as type
        FROM contact_inquiries
        ORDER BY created_at DESC LIMIT 5
      `),

      // Booking trend (Weekly count for last 30 days)
      pool.query(`
        SELECT 
          TO_CHAR(DATE_TRUNC('week', created_at), 'Mon DD') as week_label,
          COUNT(*)::int as count
        FROM appointment_requests
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('week', created_at)
        ORDER BY DATE_TRUNC('week', created_at) ASC
      `)
    ]);

    // Combine recent activities and sort by timestamp
    const recentActivity = [
      ...recentApptsRes.rows.map(a => ({
        id: `appt-${a.id}`,
        title: `${a.full_name} booked an appointment`,
        subtitle: a.reason_for_visit,
        badge: a.is_in_pain ? '🚨 Severe Pain' : a.status,
        type: 'APPOINTMENT',
        created_at: a.created_at
      })),
      ...recentInquiriesRes.rows.map(i => ({
        id: `inq-${i.id}`,
        title: `Inquiry from ${i.full_name || 'Anonymous'}`,
        subtitle: i.details,
        badge: i.status || 'NEW',
        type: 'INQUIRY',
        created_at: i.created_at
      }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 7);

    return res.status(200).json({
      success: true,
      stats: {
        pendingAppointments: pendingApptsRes.rows[0].count,
        emergencyRequests: emergencyApptsRes.rows[0].count,
        unreadInquiries: unreadInquiriesRes.rows[0].count,
      },
      recentActivity,
      weeklyTrends: weeklyTrendsRes.rows,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    return res.status(500).json({ error: 'Failed to retrieve dashboard stats.' });
  }
};