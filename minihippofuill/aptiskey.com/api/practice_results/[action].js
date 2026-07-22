import remove from '../../server/api/practice_results/delete.js';
import list from '../../server/api/practice_results/list.js';
import myList from '../../server/api/practice_results/my-list.js';
import submit from '../../server/api/practice_results/submit.js';
import update from '../../server/api/practice_results/update.js';
import aiGradeWriting from '../../server/api/practice_results/ai-grade-writing.js';
import aiGradeSpeaking from '../../server/api/practice_results/ai-grade-speaking.js';

// Chấm AI (Grok reasoning + Whisper) có thể mất 60-120s/bài → nới maxDuration.
// Cần Vercel Pro để >60s; Hobby cap 60s (dùng model nhanh hơn nếu ở Hobby).
export const config = { maxDuration: 300 };

const handlers = {
  delete: remove,
  list,
  'my-list': myList,
  submit,
  update,
  'ai-grade-writing': aiGradeWriting,
  ai_grade_writing: aiGradeWriting,
  'ai-grade-speaking': aiGradeSpeaking,
  ai_grade_speaking: aiGradeSpeaking
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown practice_results action' });
  }

  return fn(req, res);
}
