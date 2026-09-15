import lesson from '../../server/api/demo/lesson.js';
import lessons from '../../server/api/demo/lessons.js';
import set from '../../server/api/demo/set.js';
import sets from '../../server/api/demo/sets.js';

const handlers = {
  lesson,
  lessons,
  set,
  sets
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown demo action' });
  }

  return fn(req, res);
}
