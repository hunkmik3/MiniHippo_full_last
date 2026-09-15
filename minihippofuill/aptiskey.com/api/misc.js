// Dispatcher GỘP các endpoint lẻ.
//
// Lý do: Vercel Hobby plan giới hạn 12 Serverless Function mỗi deployment.
// Trước đây mỗi endpoint lẻ (ask, upload-audio, upload-speaking-recording,
// upload-lesson, visitor-count) là 1 function riêng -> chiếm 5 suất. Gộp lại
// còn 1 suất, dành chỗ cho các nhóm API khác.
//
// Các handler đã chuyển sang server/api/misc/ (nội dung giữ nguyên). Bắt buộc
// phải nằm NGOÀI thư mục api/ vì Vercel quét api/ để sinh function -> để lại
// đó thì vẫn bị tính suất và build fail.

import ask from '../server/api/misc/ask.js';
import uploadAudio from '../server/api/misc/upload-audio.js';
import uploadSpeakingRecording from '../server/api/misc/upload-speaking-recording.js';
import uploadLesson from '../server/api/misc/upload-lesson.js';
import visitorCount from '../server/api/misc/visitor-count.js';

const handlers = {
  'ask': ask,
  'upload-audio': uploadAudio,
  // /api/github-media dùng chung handler với upload-audio: GET/HEAD sẽ vào
  // nhánh handleGithubMedia bên trong file đó.
  'github-media': uploadAudio,
  'upload-speaking-recording': uploadSpeakingRecording,
  'upload-lesson': uploadLesson,
  'visitor-count': visitorCount
};

export default async function handler(req, res) {
  const action = String(req.query?.action || '').toLowerCase();
  const fn = handlers[action];

  if (!fn) {
    return res.status(404).json({ error: 'Unknown endpoint: ' + action });
  }

  return fn(req, res);
}
