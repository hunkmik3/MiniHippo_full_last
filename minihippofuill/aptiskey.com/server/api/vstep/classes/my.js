import { verifyUserRequest } from '../../_utils/auth.js';
import { selectFrom } from '../../_utils/supabase.js';
import { vstepSchemaErrorResponse } from '../_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await verifyUserRequest(req, { requireDevice: true });
  if (!authResult.success) {
    return res.status(authResult.status || 401).json({ error: authResult.error || 'Unauthorized' });
  }

  try {
    if (authResult.user.role === 'admin') {
      const classes = await selectFrom('vstep_classes', {
        order: { column: 'created_at', asc: false }
      });
      const students = await selectFrom('vstep_students', {
        order: { column: 'created_at', asc: false },
        limit: 200
      });
      return res.status(200).json({
        adminView: true,
        student: null,
        class: null,
        classes: Array.isArray(classes) ? classes : [],
        classmates: Array.isArray(students) ? students.map(item => ({
          id: item.id,
          account_code: item.account_code,
          full_name: item.full_name,
          band: item.band
        })) : []
      });
    }

    const student = await selectFrom('vstep_students', {
      filters: [{ column: 'user_id', value: authResult.user.id }],
      single: true
    });
    if (!student?.class_id) {
      return res.status(200).json({ student, class: null, classmates: [] });
    }

    const classInfo = await selectFrom('vstep_classes', {
      filters: [{ column: 'id', value: student.class_id }],
      single: true
    });
    const memberships = await selectFrom('vstep_class_students', {
      filters: [
        { column: 'class_id', value: student.class_id },
        { column: 'status', value: 'active' }
      ]
    });
    const classmates = await Promise.all((Array.isArray(memberships) ? memberships : []).slice(0, 80).map(member =>
      selectFrom('vstep_students', {
        filters: [{ column: 'id', value: member.student_id }],
        single: true
      }).catch(() => null)
    ));

    return res.status(200).json({
      student,
      class: classInfo || null,
      classmates: classmates.filter(Boolean).map(item => ({
        id: item.id,
        account_code: item.account_code,
        full_name: item.full_name,
        band: item.band
      }))
    });
  } catch (error) {
    const schema = vstepSchemaErrorResponse(error);
    if (schema) return res.status(schema.status).json(schema.body);
    console.error('vstep classes my error:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Không thể tải thông tin lớp VSTEP',
      details: error?.details || null
    });
  }
}
