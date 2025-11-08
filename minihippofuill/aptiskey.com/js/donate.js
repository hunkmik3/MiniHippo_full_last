document.addEventListener("DOMContentLoaded", function() {
  // Lấy phần tử nút và container để hiển thị QR Code
  const generateQrButton = document.getElementById('generateQr');
  const qrContainer = document.getElementById('qrContainer');
  const qrCodeImage = document.getElementById('qrCode');
  const amountInput = document.getElementById('amount');
  
  // Hàm để định dạng số với dấu phẩy
  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Định dạng số tiền khi người dùng nhập vào
  amountInput.addEventListener("input", function(event) {
    let value = event.target.value.replace(/,/g, ''); // Loại bỏ dấu phẩy
    if (!isNaN(value) && value.trim() !== '') {
      event.target.value = formatNumber(Number(value)); // Áp dụng dấu phẩy
    }
  });

  generateQrButton.addEventListener('click', function() {
    let amount = amountInput.value.replace(/,/g, ''); // Loại bỏ dấu phẩy trước khi gửi đi
    if (amount) {
        // Xem bài viết hướng dẫn mã qr tại đây: https://viblo.asia/p/tao-ma-qrcode-chuyen-tien-ngan-hang-7ymJXnd5Vkq
      // Cập nhật QR Code
      //const qrLink = `https://img.vietqr.io/image/OCB-0121101666888999-compact.png?amount=${amount}&addInfo=Cam on ban&accountName=Nguyen%20Thi%20Ha%20Phuong`;
      const qrLink = `https://qr.sepay.vn/img?acc=SEPAPTISDONATE&bank=OCB&amount=${amount}&des=Cam%20on%20ban`;

      console.log(qrLink)
      
      qrCodeImage.src = qrLink; // Cập nhật ảnh QR
      qrContainer.style.display = 'block'; // Hiển thị container QR

      // Gửi API với số tiền
      fetch('api/someonedonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Some one donate with amount: ${amount}`
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Server response:', data);
        // Bạn có thể xử lý phản hồi của server ở đây nếu cần
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      alert('Vui lòng nhập số tiền.');
    }
  });
});
