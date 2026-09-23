/**
 * CẤU HÌNH BẢN XUẤT — sửa đúng file này là đủ.
 * Mọi trang đã nạp file này TRƯỚC js/demo_embed.js.
 */
window.MH_DEMO_CONFIG = {
  // Bật sẵn chế độ học thử (không cần thêm ?demo=1 vào URL)
  force: true,
  // Domain Mini Hippo — nơi lấy đề, audio, ảnh
  base: 'https://www.minihippo.edu.vn',
  // API key do Mini Hippo cấp
  key: 'DAN_API_KEY_VAO_DAY',
  // Trang mở khi học viên bấm "quay lại danh sách" / "về trang chủ" trong bài.
  // Để '' nếu muốn ở lại trang (trang cha vẫn nhận được postMessage, xem README).
  homeUrl: 'index.html'
};
