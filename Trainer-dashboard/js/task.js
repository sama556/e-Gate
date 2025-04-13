document.addEventListener('DOMContentLoaded', function() {
    // Initialize user profile dropdown
    const userInfo = document.getElementById('userInfo');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (userInfo) {
        userInfo.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
    }
    
    document.addEventListener('click', function() {
        if (profileDropdown.classList.contains('show')) {
            profileDropdown.classList.remove('show');
        }
    });
    
    // Variables to store data
    let tasks = [
        {
            id: 1,
            title: "Python Functions Exercise",
            course: "Python Fundamentals",
            description: "Complete the exercises on Python functions including defining functions, parameters, return values, and scope.",
            startDate: "2025-04-10T09:00",
            endDate: "2025-04-17T23:59",
            priority: "medium",
            submissionTypes: ["file", "text"],
            status: "active",
            submissions: "12/25",
            studentSubmissions: [
                {
                    id: 1,
                    studentName: "John Doe",
                    submissionDate: "2025-04-15T14:30",
                    status: "Submitted",
                    grade: null,
                    feedback: null,
                    content: "Submitted Python functions exercise file"
                },
                {
                    id: 2,
                    studentName: "Jane Smith",
                    submissionDate: "2025-04-16T10:15",
                    status: "Submitted",
                    grade: null,
                    feedback: null,
                    content: "Text submission explaining Python functions"
                }
            ]
        },
        {
            id: 2,
            title: "SQL Joins Practice",
            course: "Advanced SQL",
            description: "Practice different types of SQL joins (INNER, LEFT, RIGHT, FULL) with the provided database schema.",
            startDate: "2025-04-05T08:00",
            endDate: "2025-04-12T23:59",
            priority: "high",
            submissionTypes: ["file"],
            status: "expired",
            submissions: "18/20",
            studentSubmissions: [
                {
                    id: 1,
                    studentName: "Mike Johnson",
                    submissionDate: "2025-04-10T16:45",
                    status: "Submitted",
                    grade: 85,
                    feedback: "Good work but needs more complex examples",
                    content: "SQL joins practice file"
                }
            ]
        },
        {
            id: 3,
            title: "Data Visualization Project",
            course: "Data Analysis",
            description: "Create visualizations using matplotlib and seaborn for the provided dataset and write a brief analysis.",
            startDate: "2025-04-20T00:00",
            endDate: "2025-04-30T23:59",
            priority: "high",
            submissionTypes: ["file", "link"],
            status: "upcoming",
            submissions: "0/15",
            studentSubmissions: []
        }
    ];
    
    let currentTaskId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    let currentTask = null;
    
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
 
    
    // Modals
    const viewModal = document.getElementById('view-modal');
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    const submissionModal = document.getElementById('submission-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Form elements
    const taskTitle = document.getElementById('task-title');
    const taskCourse = document.getElementById('task-course');
    const taskStartDate = document.getElementById('task-start-date');
    const taskEndDate = document.getElementById('task-end-date');
    const taskDescription = document.getElementById('task-description');
    const taskPriorityRadios = document.getElementsByName('task-priority');
    const taskSubmissionTypes = document.getElementsByName('task-submission-types');
    
    // Edit form elements
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskId = document.getElementById('edit-task-id');
    const editTaskTitle = document.getElementById('edit-task-title');
    const editTaskCourse = document.getElementById('edit-task-course');
    const editTaskStartDate = document.getElementById('edit-task-start-date');
    const editTaskEndDate = document.getElementById('edit-task-end-date');
    const editTaskDescription = document.getElementById('edit-task-description');
    const editTaskPriorityRadios = document.getElementsByName('edit-task-priority');
    const editTaskSubmissionTypes = document.getElementsByName('edit-task-submission-types');
    
    // Delete modal elements
    const deleteTaskName = document.querySelector('.delete-task-name');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    
    // Submission modal elements
    const gradeSubmissionForm = document.getElementById('grade-submission-form');
    const submissionGrade = document.getElementById('submission-grade');
    const submissionFeedback = document.getElementById('submission-feedback');
    
    // Initialize the app
    function init() {
        renderTasks();
        setupEventListeners();
    }
    
    // Render tasks to the table
    function renderTasks(filteredTasks = null) {
        const tasksToRender = filteredTasks || tasks;
        
        if (tasksToRender.length === 0) {
            tasksList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        tasksList.innerHTML = '';
        
        tasksToRender.forEach(task => {
            const row = document.createElement('tr');
            
            // Format dates for display
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const formattedStartDate = startDate.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const formattedEndDate = endDate.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Determine status badge class
            let statusClass = '';
            if (task.status === 'active') statusClass = 'active';
            else if (task.status === 'upcoming') statusClass = 'upcoming';
            else if (task.status === 'expired') statusClass = 'expired';
            
            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.title}</td>
                <td>${task.course}</td>
                <td>${formattedStartDate}</td>
                <td>${formattedEndDate}</td>
                <td><span class="status-badge ${statusClass}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></td>
                <td>${task.submissions}</td>
                <td class="actions-cell">
                    <button class="action-btn view-btn" title="View Task" data-id="${task.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" title="Edit Task" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete Task" data-id="${task.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tasksList.appendChild(row);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Task form submission
        if (taskForm) {
            taskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                createTask();
            });
        }
        
        // Edit form submission
        if (editTaskForm) {
            editTaskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updateTask();
            });
        }
        

        // Modal close buttons
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.display = 'none';
            });
        });
        
        // View, Edit, Delete buttons (delegated events)
        tasksList.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;
            
            const taskId = parseInt(target.getAttribute('data-id'));
            currentTask = tasks.find(task => task.id === taskId);
            
            if (target.classList.contains('view-btn')) {
                openViewModal(currentTask);
            } else if (target.classList.contains('edit-btn')) {
                openEditModal(currentTask);
            } else if (target.classList.contains('delete-btn')) {
                openDeleteModal(currentTask);
            }
        });
        
        // Delete modal buttons
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function() {
                deleteModal.style.display = 'none';
            });
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                deleteTask(currentTask);
                deleteModal.style.display = 'none';
            });
        }
        
        // Grade submission form
        if (gradeSubmissionForm) {
            gradeSubmissionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                gradeSubmission();
            });
        }
    }
    
    // Create a new task
    function createTask() {
        // Get form values
        const title = taskTitle.value.trim();
        const course = taskCourse.value;
        const startDate = taskStartDate.value;
        const endDate = taskEndDate.value;
        const description = taskDescription.value.trim();
        
        // Get priority
        let priority = 'medium';
        for (const radio of taskPriorityRadios) {
            if (radio.checked) {
                priority = radio.value;
                break;
            }
        }
        
        // Get submission types
        const submissionTypes = [];
        for (const checkbox of taskSubmissionTypes) {
            if (checkbox.checked) {
                submissionTypes.push(checkbox.value);
            }
        }
        
        // Determine status based on dates
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        let status = 'upcoming';
        
        if (now >= start && now <= end) {
            status = 'active';
        } else if (now > end) {
            status = 'expired';
        }
        
        // Create new task
        const newTask = {
            id: currentTaskId++,
            title,
            course,
            description,
            startDate,
            endDate,
            priority,
            submissionTypes,
            status,
            submissions: "0/0", // Placeholder, would be calculated in a real app
            studentSubmissions: []
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Reset form
        taskForm.reset();
        
        // Re-render tasks
        renderTasks();
    }
    
    // Open view modal with task details
    function openViewModal(task) {
        if (!task) return;
        
        // Format dates for display
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        const formattedStartDate = startDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const formattedEndDate = endDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Format submission types
        const submissionTypes = task.submissionTypes.map(type => {
            if (type === 'file') return 'File Upload';
            if (type === 'text') return 'Text Entry';
            if (type === 'link') return 'URL/Link';
            return type;
        }).join(', ');
        
        // Set task details
        document.getElementById('task-details').innerHTML = `
            <div class="task-detail">
                <h4>${task.title}</h4>
                <p><strong>Course:</strong> ${task.course}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <div class="detail-row">
                    <div class="detail-col">
                        <p><strong>Start Date:</strong> ${formattedStartDate}</p>
                        <p><strong>End Date:</strong> ${formattedEndDate}</p>
                    </div>
                    <div class="detail-col">
                        <p><strong>Priority:</strong> <span class="priority-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span></p>
                        <p><strong>Submission Types:</strong> ${submissionTypes}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Set submissions list
        const submissionsList = document.getElementById('submissions-list');
        submissionsList.innerHTML = '';
        
        if (task.studentSubmissions.length === 0) {
            submissionsList.innerHTML = '<tr><td colspan="4" class="no-submissions">No submissions yet</td></tr>';
        } else {
            task.studentSubmissions.forEach(submission => {
                const row = document.createElement('tr');
                const submissionDate = new Date(submission.submissionDate);
                const formattedDate = submissionDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                let statusClass = '';
                if (submission.status === 'Submitted') statusClass = 'submitted';
                else if (submission.status === 'Graded') statusClass = 'graded';
                else if (submission.status === 'Late') statusClass = 'late';
                
                row.innerHTML = `
                    <td>${submission.studentName}</td>
                    <td>${formattedDate}</td>
                    <td><span class="status-badge ${statusClass}">${submission.status}</span></td>
                    <td>
                        <button class="btn-small view-submission-btn" data-task-id="${task.id}" data-submission-id="${submission.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                `;
                submissionsList.appendChild(row);
            });
        }
        
        // Add event listeners to view submission buttons
        document.querySelectorAll('.view-submission-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-task-id'));
                const submissionId = parseInt(this.getAttribute('data-submission-id'));
                openSubmissionModal(taskId, submissionId);
            });
        });
        
        // Show modal
        viewModal.style.display = 'block';
    }
    
    // Open edit modal with task details
    function openEditModal(task) {
        if (!task) return;
        
        // Set form values
        editTaskId.value = task.id;
        editTaskTitle.value = task.title;
        editTaskCourse.value = task.course;
        editTaskStartDate.value = task.startDate.replace(' ', 'T');
        editTaskEndDate.value = task.endDate.replace(' ', 'T');
        editTaskDescription.value = task.description;
        
        // Set priority
        for (const radio of editTaskPriorityRadios) {
            if (radio.value === task.priority) {
                radio.checked = true;
                break;
            }
        }
        
        // Set submission types
        for (const checkbox of editTaskSubmissionTypes) {
            checkbox.checked = task.submissionTypes.includes(checkbox.value);
        }
        
        // Show modal
        editModal.style.display = 'block';
    }
    
    // Open delete confirmation modal
    function openDeleteModal(task) {
        if (!task) return;
        
        deleteTaskName.textContent = task.title;
        deleteModal.style.display = 'block';
    }
    
    // Open submission modal
    function openSubmissionModal(taskId, submissionId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const submission = task.studentSubmissions.find(s => s.id === submissionId);
        if (!submission) return;
        
        const submissionDate = new Date(submission.submissionDate);
        const formattedDate = submissionDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Set submission details
        document.getElementById('submission-details').innerHTML = `
            <div class="submission-detail">
                <h4>${task.title}</h4>
                <p><strong>Student:</strong> ${submission.studentName}</p>
                <p><strong>Submitted on:</strong> ${formattedDate}</p>
                <div class="submission-content">
                    <h5>Submission Content:</h5>
                    <p>${submission.content}</p>
                </div>
                ${submission.grade ? `
                <div class="current-grade">
                    <h5>Current Grade:</h5>
                    <p>${submission.grade}/100</p>
                    <p><strong>Feedback:</strong> ${submission.feedback || 'No feedback provided'}</p>
                </div>
                ` : ''}
            </div>
        `;
        
        // Set grade form values if already graded
        if (submission.grade) {
            submissionGrade.value = submission.grade;
            submissionFeedback.value = submission.feedback || '';
        } else {
            submissionGrade.value = '';
            submissionFeedback.value = '';
        }
        
        // Store current submission info on the form
        gradeSubmissionForm.setAttribute('data-task-id', taskId);
        gradeSubmissionForm.setAttribute('data-submission-id', submissionId);
        
        // Show modal
        submissionModal.style.display = 'block';
    }
    
    // Update task
    function updateTask() {
        const taskId = parseInt(editTaskId.value);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) return;
        
        // Get form values
        const title = editTaskTitle.value.trim();
        const course = editTaskCourse.value;
        const startDate = editTaskStartDate.value;
        const endDate = editTaskEndDate.value;
        const description = editTaskDescription.value.trim();
        
        // Get priority
        let priority = 'medium';
        for (const radio of editTaskPriorityRadios) {
            if (radio.checked) {
                priority = radio.value;
                break;
            }
        }
        
        // Get submission types
        const submissionTypes = [];
        for (const checkbox of editTaskSubmissionTypes) {
            if (checkbox.checked) {
                submissionTypes.push(checkbox.value);
            }
        }
        
        // Determine status based on dates
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        let status = 'upcoming';
        
        if (now >= start && now <= end) {
            status = 'active';
        } else if (now > end) {
            status = 'expired';
        }
        
        // Update task
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            course,
            description,
            startDate,
            endDate,
            priority,
            submissionTypes,
            status
        };
        
        // Close modal
        editModal.style.display = 'none';
        
        // Re-render tasks
        renderTasks();
    }
    
    // Delete task
    function deleteTask(task) {
        if (!task) return;
        
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
    }
    
    // Grade submission
    function gradeSubmission() {
        const taskId = parseInt(gradeSubmissionForm.getAttribute('data-task-id'));
        const submissionId = parseInt(gradeSubmissionForm.getAttribute('data-submission-id'));
        
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const submission = task.studentSubmissions.find(s => s.id === submissionId);
        if (!submission) return;
        
        // Update submission
        submission.grade = parseInt(submissionGrade.value);
        submission.feedback = submissionFeedback.value.trim();
        submission.status = 'Graded';
        
        // Close modal
        submissionModal.style.display = 'none';
        
        // Refresh view modal if open
        if (viewModal.style.display === 'block') {
            openViewModal(task);
        }
    }
    
    // Filter tasks
    function filterTasks() {
        const courseFilter = filterCourse.value;
        const statusFilter = filterStatus.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredTasks = tasks;
        
        // Apply course filter
        if (courseFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.course === courseFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }
        
        // Apply search filter
        if (searchTerm) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                task.description.toLowerCase().includes(searchTerm) ||
                task.course.toLowerCase().includes(searchTerm)
            );
        }
        
        renderTasks(filteredTasks);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Initialize the app
    init();
});