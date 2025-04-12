// Toggle profile dropdown
document.getElementById('userInfo').addEventListener('click', function () {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('#userInfo')) {
        document.getElementById('profileDropdown').style.display = 'none';
    }
});

// Sample data for assignments (replace with API calls)
const assignments = [
    { title: "Python Basics", due: "2025-04-15", submissions: 12 },
    { title: "SQL Quiz", due: "2025-04-18", submissions: 8 }
];

// Render assignments
const assignmentList = document.querySelector('.assignment-list');
assignments.forEach(assignment => {
    assignmentList.innerHTML += `
    <div class="assignment">
      <h4>${assignment.title}</h4>
      <p>Due: ${assignment.due} | Submissions: ${assignment.submissions}/20</p>
    </div>
  `;
});

// Initialize progress chart
const ctx = document.getElementById('progressChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Course 1', 'Course 2', 'Course 3'],
        datasets: [{
            label: 'Average Score',
            data: [75, 82, 68],
            backgroundColor: [
                'rgba(244, 177, 131, 0.7)',
                'rgba(211, 89, 38, 0.7)',
                'rgba(180, 63, 24, 0.7)'
            ]
        }]
    }
});

// Highlight active menu item based on current page
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const link = item.getAttribute('href');
        if (currentPage === link) {
            item.classList.add('active');
        } else if (currentPage === '' && link === 'index.html') {
            item.classList.add('active');
        }
    });
});