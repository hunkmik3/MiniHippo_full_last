import create from '../../server/api/practice_sets/create.js';
import remove from '../../server/api/practice_sets/delete.js';
import get from '../../server/api/practice_sets/get.js';
import list from '../../server/api/practice_sets/list.js';
import update from '../../server/api/practice_sets/update.js';
// Endpoint HỌC THỬ gắn nhờ vào dispatcher này để không tốn thêm 1 suất
// Serverless Function (Hobby plan giới hạn 12).
import demoSet from '../../server/api/demo/set.js';
import demoSets from '../../server/api/demo/sets.js';

const handlers = {
  create,
  delete: remove,
  get,
  list,
  update,
  'demo-set': demoSet,
  'demo-sets': demoSets
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_sets action' });
  }

  return fn(req, res);
}
