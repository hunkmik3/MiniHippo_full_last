document.addEventListener('DOMContentLoaded', function() {
    // Lấy số lượng người truy cập từ API
    fetch('/api/visitor-count')
        .then(response => {
            if (!response.ok) {
                throw new Error('API không phản hồi đúng');
            }
            return response.json();
        })
        .then(data => {
            // Kiểm tra xem các phần tử có tồn tại trước khi cập nhật
            const visitorCountElement = document.getElementById('visitorCount');
            const todayVisitorsElement = document.getElementById('todayVisitors');
            const weekVisitorsElement = document.getElementById('weekVisitors');
            if (visitorCountElement) {
                visitorCountElement.textContent = data.visitorCount;
            }
            if (todayVisitorsElement) {
                todayVisitorsElement.textContent = data.todayVisitors;
            }
            if (weekVisitorsElement) {
                weekVisitorsElement.textContent = data.weekVisitors;
            }
        })
        .catch(err => {
            console.error('Lỗi khi lấy số liệu người truy cập:', err);
            // Hiển thị thông báo lỗi nếu phần tử không tồn tại
            const visitorCountElement = document.getElementById('visitorCount');
            const todayVisitorsElement = document.getElementById('todayVisitors');
            const weekVisitorsElement = document.getElementById('weekVisitors');

            if (visitorCountElement) {
                visitorCountElement.innerHTML = 'Không thể lấy số liệu<br>Vui lòng thử lại';
            }
            if (todayVisitorsElement) {
                todayVisitorsElement.innerHTML = 'Không thể lấy số liệu<br>Vui lòng thử lại';
            }
            if (weekVisitorsElement) {
                weekVisitorsElement.innerHTML = 'Không thể lấy số liệu<br>Vui lòng thử lại';
            }
        });



          // Attach an event listener to the sign-out button
  document.getElementById('signOutBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior

    // Send a GET request to /logout to clear cookies and log the user out
    fetch('/logout', { method: 'GET' })
      .then(response => {
        // After logging out, redirect to the homepage (or login page)
        window.location.href = '/'; // Or replace with the desired redirect URL
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  });
});


window.onload = function() {
  // Hàm để đọc giá trị cookie theo tên
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Lấy giá trị cookie 'displayName', nếu null thì hiển thị "Khách"
  const userName = getCookie('displayName');
  const displayName = userName ? decodeURIComponent(userName) : 'Khách'; // Kiểm tra nếu null thì gán "Khách"
  document.getElementById('userName').textContent = displayName; // Cập nhật tên người dùng vào phần tử có id='userName'
};



