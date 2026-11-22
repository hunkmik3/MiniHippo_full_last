// Cloudflare Pages Function: bắt mọi request /api/* và chạy các API cũ (kiểu Vercel)
// qua server/cloudflare/adapter.js. File tĩnh không đi qua đây (Pages tự phục vụ).
import { handleNodeStyleRequest } from '../../server/cloudflare/adapter.js';
// Dữ liệu bài học "học theo câu hỏi" đã bóc sẵn lúc deploy (tools/build_cloudflare.mjs)
// cho /api/lessons/demo-lesson — Cloudflare không chạy được sandbox node:vm.
import lessonData from '../../server/cloudflare/lesson_data.generated.json';

globalThis.__MINIHIPPO_LESSON_DATA__ = lessonData;

export const onRequest = (context) => handleNodeStyleRequest(context);
