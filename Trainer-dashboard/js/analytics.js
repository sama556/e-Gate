// Initialize charts
document.addEventListener('DOMContentLoaded', function () {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendance-chart').getContext('2d');
    new Chart(attendanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [85, 15],
                backgroundColor: [
                    'rgba(244, 177, 131, 0.8)',
                    'rgba(139, 44, 21, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Scores Chart
    const scoresCtx = document.getElementById('scores-chart').getContext('2d');
    new Chart(scoresCtx, {
        type: 'bar',
        data: {
            labels: ['Quiz 1', 'Quiz 2', 'Midterm', 'Final'],
            datasets: [{
                label: 'Average Score',
                data: [65, 72, 68, 75],
                backgroundColor: 'rgba(211, 89, 38, 0.8)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Export button functionality
    document.getElementById('export-btn').addEventListener('click', function () {
        alert('Exporting progress report...');
        // Add actual export logic here
    });
});