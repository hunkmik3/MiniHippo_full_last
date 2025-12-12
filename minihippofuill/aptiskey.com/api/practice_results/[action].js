import submitResult from '../../server/api/practice_results/submit.js';
import listResults from '../../server/api/practice_results/list.js';

const handlers = {
  submit: submitResult,
  list: listResults
};

export default async function handler(req, res) {
  const action = (req.query?.action || req.url?.split('/')?.pop() || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_results action' });
  }

  return fn(req, res);
}










