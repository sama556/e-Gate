document.addEventListener('DOMContentLoaded', function () {
  // DOM Elements
  const traineeList = document.getElementById('trainee-list');
  const emptyState = document.getElementById('empty-state');
  const traineeModal = document.getElementById('trainee-modal');
  const traineeDetailContent = document.getElementById('trainee-detail-content');

  // Sample data (replace with actual data from backend)
  const trainees = [
    {
      id: 1,
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      course: "Python Fundamentals",
      joinDate: "2025-01-15",
      lastActive: "2025-04-10",
      attendance: 85,
      performance: 78,
      completion: 65,
      engagement: 72,
      status: "Active",
      tests: [
        { name: "Python Basics Quiz", score: 85, date: "2025-02-10" },
        { name: "OOP Concepts Test", score: 72, date: "2025-03-05" }
      ],
      assignments: [
        { name: "Functions Exercise", status: "Submitted", grade: "A" },
        { name: "Data Structures Project", status: "Submitted", grade: "B+" }
      ],
      sessions: [
        { name: "Python Intro", date: "2025-01-20", attended: true },
        { name: "Functions Deep Dive", date: "2025-02-05", attended: true }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      course: "Advanced SQL",
      joinDate: "2025-02-01",
      lastActive: "2025-04-08",
      attendance: 92,
      performance: 88,
      completion: 78,
      engagement: 85,
      status: "Active",
      tests: [
        { name: "SQL Basics Test", score: 90, date: "2025-02-20" },
        { name: "Joins Practice", score: 85, date: "2025-03-15" }
      ],
      assignments: [
        { name: "Database Design", status: "Submitted", grade: "A" },
        { name: "Query Optimization", status: "Submitted", grade: "A-" }
      ],
      sessions: [
        { name: "SQL Introduction", date: "2025-02-10", attended: true },
        { name: "Advanced Joins", date: "2025-03-01", attended: true }
      ]
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@example.com",
      course: "Python Fundamentals",
      joinDate: "2025-01-20",
      lastActive: "2025-04-05",
      attendance: 65,
      performance: 58,
      completion: 45,
      engagement: 62,
      status: "At Risk",
      tests: [
        { name: "Python Basics Quiz", score: 60, date: "2025-02-12" },
        { name: "OOP Concepts Test", score: 55, date: "2025-03-08" }
      ],
      assignments: [
        { name: "Functions Exercise", status: "Submitted", grade: "C" },
        { name: "Data Structures Project", status: "Submitted", grade: "D" }
      ],
      sessions: [
        { name: "Python Intro", date: "2025-01-20", attended: true },
        { name: "Functions Deep Dive", date: "2025-02-05", attended: false }
      ]
    }
  ];

  // Initialize the page
  function init() {
    renderTrainees();
  }
  // Render all trainees
  function renderTrainees(traineesToRender = trainees) {
    traineeList.innerHTML = '';

    if (traineesToRender.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    traineesToRender.forEach(trainee => {
      const traineeElement = document.createElement('tr');
      traineeElement.dataset.id = trainee.id;

      // Get initials for avatar
      const initials = trainee.name.split(' ').map(n => n[0]).join('');

      traineeElement.innerHTML = `
        <td>
          <div class="progress-cell">
            <div class="trainee-avatar" style="background-color: ${getAvatarColor(trainee.performance)};">
              ${initials}
            </div>
            ${trainee.name}
          </div>
        </td>
        <td>${trainee.course}</td>
        <td>
          <div class="progress-cell">
            <div class="progress-bar">
              <div class="progress-fill attendance-fill" style="width: ${trainee.attendance}%"></div>
            </div>
            <span class="progress-value">${trainee.attendance}%</span>
          </div>
        </td>
        <td>
          <div class="progress-cell">
            <div class="progress-bar">
              <div class="progress-fill performance-fill" style="width: ${trainee.performance}%"></div>
            </div>
            <span class="progress-value">${trainee.performance}%</span>
          </div>
        </td>
        <td>
          <div class="progress-cell">
            <div class="progress-bar">
              <div class="progress-fill completion-fill" style="width: ${trainee.completion}%"></div>
            </div>
            <span class="progress-value">${trainee.completion}%</span>
          </div>
        </td>
        <td>
          <div class="progress-cell">
            <div class="progress-bar">
              <div class="progress-fill engagement-fill" style="width: ${trainee.engagement}%"></div>
            </div>
            <span class="progress-value">${trainee.engagement}%</span>
          </div>
        </td>
        <td>
          <button class="btn-details" data-id="${trainee.id}">
            <i class="fas fa-eye"></i> Details
          </button>
        </td>
      `;

      traineeList.appendChild(traineeElement);
    });

    // Add event listeners to detail buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
      btn.addEventListener('click', function () {
        const traineeId = parseInt(this.dataset.id);
        const trainee = trainees.find(t => t.id === traineeId);
        showTraineeDetails(trainee);
      });
    });
  }

 

  function showTraineeDetails(trainee) {
    const initials = trainee.name.split(' ').map(n => n[0]).join('');
    const joinDate = new Date(trainee.joinDate).toLocaleDateString();
    const lastActive = new Date(trainee.lastActive).toLocaleDateString();

    // Calculate average test score
    const avgTestScore = trainee.tests.length > 0
      ? Math.round(trainee.tests.reduce((sum, test) => sum + test.score, 0) / trainee.tests.length)
      : 0;

    // Count submitted assignments
    const submittedAssignments = trainee.assignments.filter(a => a.status === 'Submitted').length;

    // Create trainee details HTML
    traineeDetailContent.innerHTML = `
      <div class="trainee-detail-header">
        <div class="trainee-avatar" style="background-color: ${getAvatarColor(trainee.performance)};">
          ${initials}
        </div>
        <div class="trainee-info">
          <h3>${trainee.name}</h3>
          <p>${trainee.email}</p>
          <div class="trainee-meta">
            <span><i class="fas fa-book"></i> ${trainee.course}</span>
            <span><i class="fas fa-calendar-alt"></i> Joined: ${joinDate}</span>
            <span><i class="fas fa-clock"></i> Last active: ${lastActive}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-sections">
        <div class="detail-section">
          <h4><i class="fas fa-chart-bar"></i> Progress Overview</h4>
          
          <div class="detail-item">
            <label>Attendance Rate</label>
            <div class="progress-cell">
              <div class="progress-bar">
                <div class="progress-fill attendance-fill" style="width: ${trainee.attendance}%"></div>
              </div>
              <span class="progress-value">${trainee.attendance}%</span>
            </div>
          </div>
          
          <div class="detail-item">
            <label>Performance Score</label>
            <div class="progress-cell">
              <div class="progress-bar">
                <div class="progress-fill performance-fill" style="width: ${trainee.performance}%"></div>
              </div>
              <span class="progress-value">${trainee.performance}%</span>
            </div>
          </div>
          
          <div class="detail-item">
            <label>Course Completion</label>
            <div class="progress-cell">
              <div class="progress-bar">
                <div class="progress-fill completion-fill" style="width: ${trainee.completion}%"></div>
              </div>
              <span class="progress-value">${trainee.completion}%</span>
            </div>
          </div>
          
          <div class="detail-item">
            <label>Engagement Level</label>
            <div class="progress-cell">
              <div class="progress-bar">
                <div class="progress-fill engagement-fill" style="width: ${trainee.engagement}%"></div>
              </div>
              <span class="progress-value">${trainee.engagement}%</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h4><i class="fas fa-info-circle"></i> Details</h4>
          
          <div class="detail-item">
            <label>Status</label>
            <div class="value">
              <span class="test-status ${getStatusClass(trainee.status)}">
                ${trainee.status}
              </span>
            </div>
          </div>
          
          <div class="detail-item">
            <label>Tests Completed</label>
            <div class="value">${trainee.tests.length}</div>
          </div>
          
          <div class="detail-item">
            <label>Average Test Score</label>
            <div class="value">${avgTestScore}%</div>
          </div>
          
          <div class="detail-item">
            <label>Assignments Submitted</label>
            <div class="value">${submittedAssignments}/${trainee.assignments.length}</div>
          </div>
        </div>
      </div>
      
      <div class="activity-log">
        <h4><i class="fas fa-history"></i> Recent Activity</h4>
        
        ${trainee.tests.slice(0, 3).map(test => `
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">Completed: ${test.name}</div>
              <div class="activity-description">Score: ${test.score}%</div>
              <div class="activity-date">${new Date(test.date).toLocaleDateString()
      }</div>
            </div>
          </div>
        `).join('')}
        
        ${trainee.assignments.slice(0, 3).map(assignment => `
          <div class="activity-item">
            <div class="activity-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">${assignment.status}: ${assignment.name}</div>
              ${assignment.grade ? `
                <div class="activity-description">Grade: ${assignment.grade}</div>
              ` : ''}
              <div class="activity-date">Last updated: ${lastActive}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="export-actions" style="margin-top: 30px;">
        <button class="btn-secondary" id="download-report">
          <i class="fas fa-download"></i> Download Full Report
        </button>
        <button class="btn-primary" id="send-report">
          <i class="fas fa-envelope"></i> Send Progress Report
        </button>
      </div>
    `;

    document.getElementById('download-report').addEventListener('click', () => {
      alert(`Downloading report for ${trainee.name}`);
    });

    document.getElementById('send-report').addEventListener('click', () => {
      alert(`Sending report to ${trainee.email}`);
  
    });

    traineeModal.style.display = 'block';
  }

  function getStatusClass(status) {
    switch (status) {
      case 'Active': return 'status-published';
      case 'At Risk': return 'status-draft';
      default: return 'status-closed';
    }
  }

  // Get avatar color based on performance
  function getAvatarColor(performance) {
    if (performance >= 80) return 'var(--light-orange-peach)';
    if (performance >= 60) return 'var(--burnt-orange)';
    return 'var(--reddish-orange)';
  }

// Select all close buttons
const closeButtons = document.querySelectorAll('.close-modal');


closeButtons.forEach(button => {
  button.addEventListener('click', function() {
    const modal = this.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
    }
  });
});

  // Initialize the page
  init();
});