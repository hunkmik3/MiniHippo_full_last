// Route shim cho /api/github-media.
//
// Dưới cấu hình `builds` kiểu cũ trong vercel.json, rewrite đặc biệt
// (/api/github-media -> upload-audio.js) KHÔNG được Vercel áp dụng — chỉ route
// bắt-tất-cả + file vật lý mới hoạt động. Vì không có file nào tên github-media,
// request bị Vercel trả 404 trước khi tới handler. File này tạo một function thật
// tại đúng đường dẫn đó, dùng chung handler của upload-audio (GET -> media proxy).
export { default } from './upload-audio.js';
