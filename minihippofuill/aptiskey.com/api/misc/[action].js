// Dispatcher GỘP các endpoint lẻ.
//
// Lý do: Vercel Hobby plan giới hạn 12 Serverless Function mỗi deployment.
// Trước đây mỗi endpoint lẻ (ask, upload-audio, upload-speaking-recording,
// upload-lesson, visitor-count) là 1 function riêng -> chiếm 5 suất. Gộp lại
// còn 1 suất, dành chỗ cho các nhóm API khác.
//
// Các file handler vẫn giữ nguyên vị trí và nội dung; file này chỉ định tuyến.

import ask from '../ask.js';
import uploadAudio from '../upload-audio.js';
import uploadSpeakingRecording from '../upload-speaking-recording.js';
import uploadLesson from '../upload-lesson.js';
import visitorCount from '../visitor-count.js';

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
