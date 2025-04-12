document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const sessionForm = document.getElementById('session-form');
    const upcomingSessions = document.getElementById('upcoming-sessions');
    const emptyState = document.getElementById('empty-state');
    const editModal = document.getElementById('edit-modal');
    const editSessionForm = document.getElementById('edit-session-form');
    const closeModal = document.querySelector('.close-modal');

    // Sample data (replace with actual data from backend)
    let sessions = [
        {
            id: 1,
            title: "Python OOP Concepts",
            course: "Python Fundamentals",
            date: "2025-04-15T10:00",
            duration: 120,
            platform: "zoom",
            description: "Introduction to Object-Oriented Programming in Python"
        },
        {
            id: 2,
            title: "SQL Joins Practice",
            course: "Advanced SQL",
            date: "2025-04-18T14:00",
            duration: 90,
            platform: "teams",
            description: "Hands-on practice with different JOIN operations"
        }
    ];

    // Initialize the page
    function init() {
        renderSessions();
        setMinDate();

        // Load platform integrations
        loadIntegrations();

        // Set up event listeners
        setupEventListeners();
    }

    // Set minimum date/time for the date picker
    function setMinDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        document.getElementById('session-date').min = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Form submission for new session
        sessionForm.addEventListener('submit', handleSessionSubmission);

        // Cancel button clears the form
        document.getElementById('cancel-session').addEventListener('click', function () {
            if (confirm('Discard this session?')) {
                sessionForm.reset();
            }
        });

        // Refresh calendars button
        document.getElementById('refresh-calendars').addEventListener('click', function () {
            // In a real app, this would sync with calendar APIs
            alert('Refreshing calendar integrations...');
            loadIntegrations();
        });

        // Close modal button
        closeModal.addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    // Load platform integrations
    function loadIntegrations() {
        // In a real app, this would check connected accounts
        console.log('Loading platform integrations...');
    }

    // Render all sessions
    function renderSessions() {
        upcomingSessions.innerHTML = '';

        if (sessions.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        sessions.forEach(session => {
            const sessionDate = new Date(session.date);
            const sessionElement = createSessionElement(session, sessionDate);
            upcomingSessions.appendChild(sessionElement);
        });

        // Add event listeners to session actions
        document.querySelectorAll('.btn-start').forEach(btn => {
            btn.addEventListener('click', function () {
                const sessionId = parseInt(this.dataset.id);
                startSession(sessionId);
            });
        });

        document.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.addEventListener('click', function () {
                const sessionId = parseInt(this.dataset.id);
                openEditModal(sessionId);
            });
        });

        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.addEventListener('click', function () {
                const sessionId = parseInt(this.dataset.id);
                deleteSession(sessionId);
            });
        });
    }

    // Create HTML for a session
    function createSessionElement(session, date) {
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const startTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const endDate = new Date(date.getTime() + session.duration * 60000);
        const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const sessionElement = document.createElement('div');
        sessionElement.className = 'session-card';
        sessionElement.dataset.id = session.id;

        sessionElement.innerHTML = `
      <div class="session-date" style="background-color: ${getDateColor(session.date)};">
        <span>${day}</span>
        <small>${month}</small>
      </div>
      <div class="session-details">
        <h3>${session.title}</h3>
        <div class="session-meta">
          <p><i class="fas fa-book"></i> ${session.course}</p>
          <p><i class="far fa-clock"></i> <span class="session-duration">${startTime} - ${endTime}</span></p>
          <p class="session-platform">
            <i class="fab fa-${session.platform === 'zoom' ? 'zoom' : 'microsoft'} platform-icon"></i> 
            ${session.platform === 'zoom' ? 'Zoom Meeting' : 'Microsoft Teams'}
          </p>
        </div>
        ${session.description ? `<p class="session-description">${session.description}</p>` : ''}
      </div>
      <div class="session-actions">
        <button class="btn-start" data-id="${session.id}">
          <i class="fas fa-video"></i> Start
        </button>
        <button class="btn-icon edit" data-id="${session.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete" data-id="${session.id}">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

        return sessionElement;
    }

    // Get color based on session date
    function getDateColor(sessionDate) {
        const date = new Date(sessionDate);
        const now = new Date();
        const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'var(--reddish-orange)'; // Past
        if (diffDays < 3) return 'var(--burnt-orange)'; // Upcoming soon
        return 'var(--light-orange-peach)'; // Future
    }

    // Handle session form submission
    function handleSessionSubmission(e) {
        e.preventDefault();

        const newSession = {
            id: Date.now(), // Simple ID generation
            title: document.getElementById('session-title').value,
            course: document.getElementById('session-course').value,
            date: document.getElementById('session-date').value,
            duration: parseInt(document.getElementById('session-duration').value),
            platform: document.querySelector('input[name="platform"]:checked').value,
            description: document.getElementById('session-description').value
        };

        sessions.push(newSession);
        renderSessions();
        sessionForm.reset();
        setMinDate();

        // Show success message
        alert('Session scheduled successfully!');
    }

    // Start a session
    function startSession(sessionId) {
        const session = sessions.find(s => s.id === sessionId);
        if (session) {
            alert(`Starting ${session.platform} session: ${session.title}\n\nMeeting would launch in a real application`);
        }
    }

    // Open edit modal
    function openEditModal(sessionId) {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return;

        const sessionDate = new Date(session.date);
        const formattedDate = sessionDate.toISOString().slice(0, 16);

        // Create edit form
        editSessionForm.innerHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>Course</label>
          <select id="edit-course" required>
            <option value="">Select a course</option>
            <option ${session.course === 'Python Fundamentals' ? 'selected' : ''}>Python Fundamentals</option>
            <option ${session.course === 'Advanced SQL' ? 'selected' : ''}>Advanced SQL</option>
            <option ${session.course === 'Data Analysis with Pandas' ? 'selected' : ''}>Data Analysis with Pandas</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Session Title</label>
          <input type="text" id="edit-title" value="${session.title}" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Date & Time</label>
          <input type="datetime-local" id="edit-date" value="${formattedDate}" required>
        </div>
        
        <div class="form-group">
          <label>Duration (minutes)</label>
          <input type="number" id="edit-duration" value="${session.duration}" min="15" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Platform</label>
        <div class="platform-options">
          <label class="platform-option">
            <input type="radio" name="edit-platform" value="zoom" ${session.platform === 'zoom' ? 'checked' : ''} required>
            <span class="platform-label">
              <i class="fab fa-zoom platform-icon"></i> Zoom
            </span>
          </label>
          
          <label class="platform-option">
            <input type="radio" name="edit-platform" value="teams" ${session.platform === 'teams' ? 'checked' : ''} required>
            <span class="platform-label">
              <i class="fab fa-microsoft platform-icon"></i> Microsoft Teams
            </span>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea id="edit-description" rows="3">${session.description || ''}</textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-secondary" id="cancel-edit">
          Cancel
        </button>
        <button type="submit" class="btn-primary">
          Save Changes
        </button>
      </div>
    `;

        // Set minimum date for edit form
        const now = new Date();
        document.getElementById('edit-date').min = now.toISOString().slice(0, 16);

        // Add event listeners to edit form
        document.getElementById('cancel-edit').addEventListener('click', () => {
            editModal.style.display = 'none';
        });

        editSessionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateSession(sessionId);
        });

        // Show modal
        editModal.style.display = 'block';
    }

    // Update a session
    function updateSession(sessionId) {
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) return;

        sessions[sessionIndex] = {
            ...sessions[sessionIndex],
            title: document.getElementById('edit-title').value,
            course: document.getElementById('edit-course').value,
            date: document.getElementById('edit-date').value,
            duration: parseInt(document.getElementById('edit-duration').value),
            platform: document.querySelector('input[name="edit-platform"]:checked').value,
            description: document.getElementById('edit-description').value
        };

        renderSessions();
        editModal.style.display = 'none';
        alert('Session updated successfully!');
    }

    // Delete a session
    function deleteSession(sessionId) {
        if (confirm('Are you sure you want to delete this session?')) {
            sessions = sessions.filter(s => s.id !== sessionId);
            renderSessions();
            alert('Session deleted successfully!');
        }
    }

    // Initialize the page
    init();
});