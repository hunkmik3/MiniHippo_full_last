import { selectFrom } from '../_utils/supabase.js';

function resolveLogicalType(set) {
  const marker = set?.data?.__practice_type;
  if (typeof marker === 'string' && marker.trim()) {
    return marker.trim().toLowerCase();
  }
  return typeof set?.type === 'string' ? set.type.toLowerCase() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const type = typeof req.query.type === 'string' ? req.query.type.toLowerCase() : '';

  try {
    // Fetch all then filter by logical type, so legacy databases can still
    // serve "speaking" sets stored with fallback type.
    const sets = await selectFrom('practice_sets', {
      order: { column: 'created_at', asc: false }
    });

    const normalizedSets = Array.isArray(sets) ? sets : [];
    const filteredSets = type
      ? normalizedSets.filter((set) => resolveLogicalType(set) === type)
      : normalizedSets;

    return res.status(200).json({ sets: filteredSets });
  } catch (error) {
    console.error('Practice sets list error:', error);
    return res.status(error.status || 500).json({
      error: error?.details?.message || error.message || 'Không thể tải bộ đề',
      details: error?.details || null
    });
  }
}
