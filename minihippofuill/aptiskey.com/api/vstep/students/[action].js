import create from '../../../server/api/vstep/students/create.js';
import list from '../../../server/api/vstep/students/list.js';
import bulkImport from '../../../server/api/vstep/students/bulk-import.js';
import update from '../../../server/api/vstep/students/update.js';

const handlers = {
  'bulk-import': bulkImport,
  bulk_import: bulkImport,
  create,
  list,
  update
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];
  if (!fn) return res.status(404).json({ error: 'Unknown vstep students action' });
  return fn(req, res);
}
