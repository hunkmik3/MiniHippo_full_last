import deleteLesson from '../../server/api/lessons/delete.js';
import getScriptUrl from '../../server/api/lessons/get-script-url.js';
import getScript from '../../server/api/lessons/get-script.js';
import getLesson from '../../server/api/lessons/get.js';
import listLessons from '../../server/api/lessons/list.js';

const handlers = {
  delete: deleteLesson,
  'get-script-url': getScriptUrl,
  'get-script': getScript,
  get: getLesson,
  list: listLessons
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown lessons action' });
  }

  return fn(req, res);
}
