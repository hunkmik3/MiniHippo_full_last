import remove from '../../server/api/lessons/delete.js';
import getScriptUrl from '../../server/api/lessons/get-script-url.js';
import getScript from '../../server/api/lessons/get-script.js';
import get from '../../server/api/lessons/get.js';
import list from '../../server/api/lessons/list.js';

// Endpoint HỌC THỬ gắn nhờ vào dispatcher này để không tốn thêm 1 suất
// Serverless Function (Hobby plan giới hạn 12).
import demoLesson from '../../server/api/demo/lesson.js';
import demoLessons from '../../server/api/demo/lessons.js';
import demoCatalog from '../../server/api/demo/catalog.js';

const handlers = {
  // Cây nội dung Aptis đã nhóm sẵn (kỹ năng -> chế độ -> part -> bài), 1 lần gọi.
  'demo-catalog': demoCatalog,
  'demo-lesson': demoLesson,
  'demo-lessons': demoLessons,
  delete: remove,
  'get-script-url': getScriptUrl,
  'get-script': getScript,
  get,
  list
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown lessons action' });
  }

  return fn(req, res);
}
