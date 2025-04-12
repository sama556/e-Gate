document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const trainerName = document.getElementById('trainer-name');
    const currentDate = document.getElementById('current-date');
    const upcomingSessions = document.getElementById('upcoming-sessions');
    const recentActivity = document.getElementById('recent-activity');
    const userInfo = document.getElementById('userInfo');
    const profileDropdown = document.getElementById('profileDropdown');

    // Sample data (replace with actual data from backend)
    const trainerData = {
        name: "Ahmed Mohamed",
        courses: 5,
        trainees: 42,
        upcomingSessions: [
            {
                id: 1,
                title: "Python OOP Concepts",
                date: "2025-04-15T10:00:00",
                duration: 120,
                course: "Python Fundamentals"
            },
            {
                id: 2,
                title: "SQL Joins Practice",
                date: "2025-04-18T14:00:00",
                duration: 90,
                course: "Advanced SQL"
            },
            {
                id: 3,
                title: "Data Cleaning Techniques",
                date: "2025-04-20T09:30:00",
                duration: 60,
                course: "Data Analysis"
            }
        ],
        recentActivities: [
            {
                type: "assignment",
                title: "3 New Submissions",
                description: "Python Functions Exercise",
                date: "2025-04-10T14:30:00",
                icon: "fas fa-tasks"
            },
            {
                type: "test",
                title: "Test Grading Completed",
                description: "SQL Basics Quiz",
                date: "2025-04-09T11:15:00",
                icon: "fas fa-clipboard-check"
            },
            {
                type: "session",
                title: "Session Feedback Received",
                description: "Python Data Structures",
                date: "2025-04-08T16:45:00",
                icon: "fas fa-comments"
            },
            {
                type: "trainee",
                title: "New Trainee Registered",
                description: "Sarah Williams",
                date: "2025-04-07T10:20:00",
                icon: "fas fa-user-plus"
            }
        ]
    };

    // Initialize the dashboard
    function initDashboard() {
        displayCurrentDate();
        loadTrainerProfile();
        renderUpcomingSessions();
        renderRecentActivities();
        setupEventListeners();
    }

    // Display current date
    function displayCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Load trainer profile
    function loadTrainerProfile() {
        trainerName.textContent = trainerData.name;
    }

    // Render upcoming sessions
    function renderUpcomingSessions() {
        upcomingSessions.innerHTML = '';

        trainerData.upcomingSessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const endDate = new Date(sessionDate.getTime() + session.duration * 60000);

            const sessionElement = document.createElement('li');
            sessionElement.className = 'session-item';
            sessionElement.innerHTML = `
        <div class="session-date">
          <div class="session-day">${sessionDate.getDate()}</div>
          <div class="session-month">${sessionDate.toLocaleString('default', { month: 'short' })}</div>
        </div>
        <div class="session-details">
          <div class="session-title">${session.title}</div>
          <div class="session-time">
            <i class="far fa-clock"></i>
            ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span style="margin: 0 5px">•</span>
            ${session.course}
          </div>
        </div>
        <button class="session-join" data-id="${session.id}">
          <i class="fas fa-video"></i> Join
        </button>
      `;

            upcomingSessions.appendChild(sessionElement);
        });

        // Add event listeners to join buttons
        document.querySelectorAll('.session-join').forEach(btn => {
            btn.addEventListener('click', function () {
                const sessionId = this.dataset.id;
                joinSession(sessionId);
            });
        });
    }

    // Render recent activities
    function renderRecentActivities() {
        recentActivity.innerHTML = '';

        trainerData.recentActivities.forEach(activity => {
            const activityDate = new Date(activity.date);

            const activityElement = document.createElement('li');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
        <div class="activity-icon">
          <i class="${activity.icon}"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-description">${activity.description}</div>
          <div class="activity-date">${activityDate.toLocaleDateString()} • ${activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      `;

            recentActivity.appendChild(activityElement);
        });
    }

    // Join session function
    function joinSession(sessionId) {
        const session = trainerData.upcomingSessions.find(s => s.id == sessionId);
        if (session) {
            alert(`Joining session: ${session.title}\n\nThis would launch the meeting in a real application`);
            // In a real app, this would launch Zoom/Teams with the meeting link
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Toggle profile dropdown
        userInfo.addEventListener('click', function () {
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#userInfo')) {
                profileDropdown.style.display = 'none';
            }
        });

        // Quick actions button
        document.querySelector('.welcome-banner .btn-primary').addEventListener('click', function () {
            // Show quick actions modal or dropdown
            alert('Showing quick actions menu');
        });
    }

    // Initialize the dashboard
    initDashboard();
});