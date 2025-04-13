// Sample test data - in a real application, this would come from a database
let tests = [
    {
        id: 1,
        title: "Python Basics Quiz",
        course: "Python Fundamentals",
        type: "MCQ Test",
        dueDate: "2025-04-20T23:59",
        status: "Published",
        submissions: 12,
        questions: [
            {
                question: "What is the correct way to create a variable in Python?",
                options: ["var x = 5", "x = 5", "int x = 5", "define x = 5"],
                correctAnswer: 1
            },
            {
                question: "Which of these is not a Python data type?",
                options: ["string", "integer", "boolean", "character"],
                correctAnswer: 3
            }
        ]
    },
    {
        id: 2,
        title: "SQL Assignment",
        course: "Advanced SQL",
        type: "Essay Assignment",
        dueDate: "2025-04-25T23:59",
        status: "Draft",
        submissions: 0,
        prompt: "Explain the differences between INNER JOIN and LEFT JOIN with examples."
    },
    {
        id: 3,
        title: "Data Analysis Project",
        course: "Data Analysis",
        type: "Essay Assignment",
        dueDate: "2025-05-05T23:59",
        status: "Published",
        submissions: 8,
        prompt: "Analyze the provided dataset and present your findings."
    }
];

// Sample student submission data
const studentSubmissions = {
    1: [
        { student: "Sama Ahmed", score: 85, submittedAt: "2025-04-15T14:30" },
        { student: "Sarah ALi", score: 92, submittedAt: "2025-04-16T10:15" },
        { student: "Amr Mohmed", score: 78, submittedAt: "2025-04-17T09:45" }
    ],
    3: [
        { student: "Ali Ahmed", score: 88, submittedAt: "2025-04-20T15:20" },
        { student: "Kareem Adel", score: 91, submittedAt: "2025-04-21T11:30" }
    ]
};
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Load existing tests
    loadTests();
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all forms
            document.querySelectorAll('.test-form').forEach(form => {
                form.classList.add('hidden');
            });
            
            // Show the selected form
            const formId = button.getAttribute('data-tab') + '-form';
            document.getElementById(formId).classList.remove('hidden');
        });
    });
    
    // Add MCQ Question
    document.getElementById('add-mcq-question').addEventListener('click', addMCQQuestion);
    
    // MCQ Form submission
    document.getElementById('mcq-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTest(true); // true = publish
    });
    
    // Save Draft
    document.getElementById('save-draft').addEventListener('click', function() {
        saveTest(false); // false = save as draft
    });
    
    // Essay Form submission
    document.getElementById('essay-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEssayAssignment(true); // true = publish
    });
    
    // Save Essay Draft
    document.getElementById('save-essay-draft').addEventListener('click', function() {
        saveEssayAssignment(false); // false = save as draft
    });
    
    // Export Results
    document.getElementById('export-results').addEventListener('click', exportResults);
    
    // Close modals when clicking the X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Cancel edit
    document.getElementById('cancel-edit').addEventListener('click', function() {
        document.getElementById('edit-modal').style.display = 'none';
    });
    
    // Edit form submission
    document.getElementById('edit-test-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateTest();
    });
    
    // Edit add question
    document.getElementById('edit-add-question').addEventListener('click', function() {
        addMCQQuestion(true); // true = edit mode
    });
});

// Function to load tests into the table
function loadTests() {
    const testsList = document.getElementById('tests-list');
    const emptyState = document.getElementById('empty-state');
    
    if (tests.length === 0) {
        testsList.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    testsList.innerHTML = '';
    
    tests.forEach(test => {
        const row = document.createElement('tr');
        const formattedDate = new Date(test.dueDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        row.innerHTML = `
            <td>${test.title}</td>
            <td>${test.course}</td>
            <td>${test.type}</td>
            <td>${formattedDate}</td>
            <td><span class="status-badge ${test.status.toLowerCase()}">${test.status}</span></td>
            <td>${test.submissions}</td>
            <td class="actions-cell">
                ${getActionButtons(test)}
            </td>
        `;
        
        testsList.appendChild(row);
    });
    
    // Add event listeners for the buttons
    attachActionButtonEvents();
}

// Function to generate action buttons based on test status
function getActionButtons(test) {
    let buttons = '';
    
    if (test.status === 'Draft') {
        // For draft tests, show Edit and Publish buttons
        buttons += `
            <button class="action-btn edit-btn" data-id="${test.id}">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="action-btn publish-btn" data-id="${test.id}">
                <i class="fas fa-upload"></i> Publish
            </button>
        `;
    } else if (test.status === 'Published') {
        // For published tests, show Preview and Grade buttons
        buttons += `
            <button class="action-btn preview-btn" data-id="${test.id}">
                <i class="fas fa-eye"></i> Preview
            </button>
            <button class="action-btn grade-btn" data-id="${test.id}">
                <i class="fas fa-check-circle"></i> Grade
            </button>
        `;
    }
    
    // Always show Delete button
    buttons += `
        <button class="action-btn delete-btn" data-id="${test.id}">
            <i class="fas fa-trash"></i> Delete
        </button>
    `;
    
    return buttons;
}

// Function to attach event listeners to action buttons
function attachActionButtonEvents() {
    // Edit button
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const testId = parseInt(this.getAttribute('data-id'));
            openEditModal(testId);
        });
    });
    
    // Preview button
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const testId = parseInt(this.getAttribute('data-id'));
            previewTest(testId);
        });
    });
    
    // Grade button
    document.querySelectorAll('.grade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const testId = parseInt(this.getAttribute('data-id'));
            openGradeModal(testId);
        });
    });
    
    // Publish button
    document.querySelectorAll('.publish-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const testId = parseInt(this.getAttribute('data-id'));
            publishTest(testId);
        });
    });
    
    // Delete button
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const testId = parseInt(this.getAttribute('data-id'));
            deleteTest(testId);
        });
    });
}

// Function to publish a test
function publishTest(testId) {
    const test = tests.find(t => t.id === testId);
    if (test) {
        if (confirm(`Are you sure you want to publish "${test.title}"? Once published, you will not be able to edit it.`)) {
            test.status = 'Published';
            loadTests(); // Refresh the table
            alert('Test published successfully!');
        }
    }
}

// Function to delete a test
function deleteTest(testId) {
    if (confirm('Are you sure you want to delete this test?')) {
        tests = tests.filter(test => test.id !== testId);
        loadTests(); // Refresh the table
        alert('Test deleted successfully!');
    }
}

// Function to preview a test
function previewTest(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    
    const previewContent = document.getElementById('preview-content');
    
    let content = `
        <h3 class="head">${test.title}</h3>
        <div class="preview-info">
            <p><strong>Course:</strong> ${test.course}</p>
            <p><strong>Type:</strong> ${test.type}</p>
            <p><strong>Due Date:</strong> ${new Date(test.dueDate).toLocaleString()}</p>
            <p><strong>Status:</strong> ${test.status}</p>
        </div>
    `;
    
    if (test.type === 'MCQ Test' && test.questions) {
        content += '<div class="preview-questions">';
        test.questions.forEach((q, index) => {
            content += `
                <div class="preview-question">
                    <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                    <ul>
                        ${q.options.map((option, i) => `
                            <li class="${i === q.correctAnswer ? 'correct-answer' : ''}">${option} 
                                ${i === q.correctAnswer ? '<span class="correct-badge">Correct</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        content += '</div>';
    } else if (test.type === 'Essay Assignment' && test.prompt) {
        content += `
            <div class="preview-prompt">
                <h4>Assignment Prompt:</h4>
                <p>${test.prompt}</p>
            </div>
        `;
    }
    
    // Add student submissions if available
    if (studentSubmissions[testId] && studentSubmissions[testId].length > 0) {
        content += `
            <div class="preview-submissions">
                <h4>Student Submissions (${studentSubmissions[testId].length})</h4>
                <table class="submissions-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Submitted On</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentSubmissions[testId].map(sub => `
                            <tr>
                                <td>${sub.student}</td>
                                <td>${sub.score}%</td>
                                <td>${new Date(sub.submittedAt).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        content += `
            <div class="preview-submissions">
                <h4>Student Submissions (0)</h4>
                <p>No submissions yet.</p>
            </div>
        `;
    }
    
    previewContent.innerHTML = content;
    document.getElementById('preview-modal').style.display = 'block';
}

// Function to open the grade modal
function openGradeModal(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    
    const gradeContent = document.getElementById('grade-content');
    
    if (!studentSubmissions[testId] || studentSubmissions[testId].length === 0) {
        gradeContent.innerHTML = `
            <div class="no-submissions">
                <p>No submissions to grade for "${test.title}".</p>
            </div>
        `;
    } else {
        gradeContent.innerHTML = `
            <div class="grade-header">
                <h4>${test.title}</h4>
                <p><strong>Submissions:</strong> ${studentSubmissions[testId].length}</p>
            </div>
            <div class="submissions-list">
                ${studentSubmissions[testId].map(sub => `
                    <div class="submission-item">
                        <div class="submission-header">
                            <h5>${sub.student}</h5>
                            <p>Submitted: ${new Date(sub.submittedAt).toLocaleString()}</p>
                        </div>
                        <div class="submission-grade">
                            <label for="grade-${testId}-${sub.student.replace(/\s+/g, '-')}">Grade:</label>
                            <input type="number" 
                                id="grade-${testId}-${sub.student.replace(/\s+/g, '-')}" 
                                value="${sub.score}" 
                                min="0" 
                                max="100">
                            <span>/ 100</span>
                        </div>
                        
                    </div>
                `).join('')}
            </div>
            <div class="grade-actions">
                <button class="btn-primary" id="save-grades">Save Grades</button>
            </div>
        `;
        
        // Add event listener to save grades button
        document.getElementById('save-grades').addEventListener('click', function() {
            saveGrades(testId);
        });
    }
    
    document.getElementById('grade-modal').style.display = 'block';
}

// Function to save grades
function saveGrades(testId) {
    // In a real application, this would send data to a server
    alert('Grades saved successfully!');
    document.getElementById('grade-modal').style.display = 'none';
}

// Function to open edit modal
function openEditModal(testId) {
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    
    // Populate form fields
    document.getElementById('edit-test-title').value = test.title;
    document.getElementById('edit-test-course').value = test.course;
    document.getElementById('edit-test-due-date').value = test.dueDate;
    
    if (test.type === 'MCQ Test') {
        document.getElementById('edit-test-time-limit').value = test.timeLimit || 30;
        document.getElementById('edit-test-instructions').value = test.instructions || '';
        
        // Populate questions
        const questionsContainer = document.getElementById('edit-questions-container');
        questionsContainer.innerHTML = '';
        
        if (test.questions) {
            test.questions.forEach((question, index) => {
                addQuestionToEditForm(question, index);
            });
        }
    }
    
    // Store the test ID in the form for later use
    document.getElementById('edit-test-form').setAttribute('data-test-id', testId);
    
    document.getElementById('edit-modal').style.display = 'block';
}

// Function to add a question to the edit form
function addQuestionToEditForm(question, index) {
    const questionsContainer = document.getElementById('edit-questions-container');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.setAttribute('data-question-index', index);
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <h4>Question ${index + 1}</h4>
            <button type="button" class="remove-question" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="form-group">
            <label for="edit-q${index}-text">Question Text</label>
            <textarea id="edit-q${index}-text" rows="2" required>${question.question}</textarea>
        </div>
        <div class="options-container">
            ${question.options.map((option, i) => `
                <div class="option-item">
                    <div class="form-group">
                        <label for="edit-q${index}-opt${i}">Option ${i + 1}</label>
                        <input type="text" id="edit-q${index}-opt${i}" value="${option}" required>
                    </div>
                    <div class="radio-option">
                        <input type="radio" 
                            name="edit-q${index}-correct" 
                            id="edit-q${index}-correct${i}" 
                            value="${i}" 
                            ${i === question.correctAnswer ? 'checked' : ''}>
                        <label for="edit-q${index}-correct${i}">Correct Answer</label>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    questionsContainer.appendChild(questionDiv);
    
    // Add event listener to remove button
    questionDiv.querySelector('.remove-question').addEventListener('click', function() {
        questionsContainer.removeChild(questionDiv);
    });
}

// Function to update a test
function updateTest() {
    const testId = parseInt(document.getElementById('edit-test-form').getAttribute('data-test-id'));
    const test = tests.find(t => t.id === testId);
    
    if (!test) return;
    
    // Update basic info
    test.title = document.getElementById('edit-test-title').value;
    test.course = document.getElementById('edit-test-course').value;
    test.dueDate = document.getElementById('edit-test-due-date').value;
    
    if (test.type === 'MCQ Test') {
        test.timeLimit = parseInt(document.getElementById('edit-test-time-limit').value);
        test.instructions = document.getElementById('edit-test-instructions').value;
        
        // Update questions
        test.questions = [];
        const questionItems = document.querySelectorAll('#edit-questions-container .question-item');
        
        questionItems.forEach((item, index) => {
            const questionText = item.querySelector(`#edit-q${index}-text`).value;
            const options = [];
            
            // Get options
            for (let i = 0; i < 4; i++) {
                const optionInput = item.querySelector(`#edit-q${index}-opt${i}`);
                if (optionInput) {
                    options.push(optionInput.value);
                }
            }
            
            // Get correct answer
            let correctAnswer = 0;
            const correctInputs = item.querySelectorAll(`input[name="edit-q${index}-correct"]`);
            correctInputs.forEach((input, i) => {
                if (input.checked) {
                    correctAnswer = i;
                }
            });
            
            test.questions.push({
                question: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        });
    }
    
    document.getElementById('edit-modal').style.display = 'none';
    loadTests(); // Refresh the table
    alert('Test updated successfully!');
}

// Function to add MCQ question
function addMCQQuestion(isEditMode = false) {
    const containerId = isEditMode ? 'edit-questions-container' : 'questions-container';
    const container = document.getElementById(containerId);
    const questionIndex = container.children.length;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.setAttribute('data-question-index', questionIndex);
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <h4>Question ${questionIndex + 1}</h4>
            <button type="button" class="remove-question" data-index="${questionIndex}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="form-group">
            <label for="${isEditMode ? 'edit-' : ''}q${questionIndex}-text">Question Text</label>
            <textarea id="${isEditMode ? 'edit-' : ''}q${questionIndex}-text" rows="2" required placeholder="Enter your question here..."></textarea>
        </div>
        <div class="options-container">
            ${[0, 1, 2, 3].map(i => `
                <div class="option-item">
                    <div class="form-group">
                        <label for="${isEditMode ? 'edit-' : ''}q${questionIndex}-opt${i}">Option ${i + 1}</label>
                        <input type="text" id="${isEditMode ? 'edit-' : ''}q${questionIndex}-opt${i}" placeholder="Enter option ${i + 1}" required>
                    </div>
                    <div class="radio-option">
                        <input type="radio" 
                            name="${isEditMode ? 'edit-' : ''}q${questionIndex}-correct" 
                            id="${isEditMode ? 'edit-' : ''}q${questionIndex}-correct${i}" 
                            value="${i}" 
                            ${i === 0 ? 'checked' : ''}>
                        <label for="${isEditMode ? 'edit-' : ''}q${questionIndex}-correct${i}">Correct Answer</label>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.appendChild(questionDiv);
    
    // Add event listener to remove button
    questionDiv.querySelector('.remove-question').addEventListener('click', function() {
        container.removeChild(questionDiv);
        // Update question numbers
        updateQuestionNumbers(container);
    });
}

// Function to update question numbers after removal
function updateQuestionNumbers(container) {
    const questions = container.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        question.querySelector('h4').textContent = `Question ${index + 1}`;
        question.setAttribute('data-question-index', index);
    });
}

// Function to save MCQ test
function saveTest(publish = false) {
    // Get form values
    const title = document.getElementById('test-title').value;
    const course = document.getElementById('test-course').value;
    const dueDate = document.getElementById('test-due-date').value;
    const timeLimit = parseInt(document.getElementById('test-time-limit').value);
    const instructions = document.getElementById('test-instructions').value;
    
    // Validate form
    if (!title || !course || !dueDate) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Get questions
    const questions = [];
    const questionItems = document.querySelectorAll('#questions-container .question-item');
    
    if (questionItems.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    questionItems.forEach((item, index) => {
        const questionText = item.querySelector(`#q${index}-text`).value;
        const options = [];
        
        // Get options
        for (let i = 0; i < 4; i++) {
            const optionInput = item.querySelector(`#q${index}-opt${i}`);
            if (optionInput) {
                options.push(optionInput.value);
            }
        }
        
        // Get correct answer
        let correctAnswer = 0;
        const correctInputs = item.querySelectorAll(`input[name="q${index}-correct"]`);
        correctInputs.forEach((input, i) => {
            if (input.checked) {
                correctAnswer = i;
            }
        });
        
        questions.push({
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        });
    });
    
    // Create new test object
    const newTest = {
        id: tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1,
        title: title,
        course: course,
        type: 'MCQ Test',
        dueDate: dueDate,
        status: publish ? 'Published' : 'Draft',
        submissions: 0,
        timeLimit: timeLimit,
        instructions: instructions,
        questions: questions
    };
    
    // Add to tests array
    tests.push(newTest);
    
    // Reset form
    document.getElementById('mcq-form').reset();
    document.getElementById('questions-container').innerHTML = '';
    
    // Reload tests
    loadTests();
    
    alert(`Test ${publish ? 'published' : 'saved as draft'} successfully!`);
}

// Function to save essay assignment
function saveEssayAssignment(publish = false) {
    // Get form values
    const title = document.getElementById('essay-title').value;
    const course = document.getElementById('essay-course').value;
    const dueDate = document.getElementById('essay-due-date').value;
    const wordLimit = document.getElementById('essay-word-limit').value;
    const prompt = document.getElementById('essay-prompt').value;
    const rubric = document.getElementById('essay-rubric').value;
    
    // Get allowed file types
    const allowedFileTypes = [];
    document.querySelectorAll('input[name="essay-file-types"]:checked').forEach(input => {
        allowedFileTypes.push(input.value);
    });
    
    // Validate form
    if (!title || !course || !dueDate || !prompt) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Create new assignment object
    const newAssignment = {
        id: tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1,
        title: title,
        course: course,
        type: 'Essay Assignment',
        dueDate: dueDate,
        status: publish ? 'Published' : 'Draft',
        submissions: 0,
        wordLimit: wordLimit ? parseInt(wordLimit) : null,
        prompt: prompt,
        rubric: rubric,
        allowedFileTypes: allowedFileTypes
    };
    
    // Add to tests array
    tests.push(newAssignment);
    
    // Reset form
    document.getElementById('essay-form').reset();
    
    // Check file type checkboxes (reset doesn't do this for checkboxes)
    document.querySelector('input[name="essay-file-types"][value="pdf"]').checked = true;
    
    // Reload tests
    loadTests();
    
    alert(`Assignment ${publish ? 'published' : 'saved as draft'} successfully!`);
}

// Function to export results
function exportResults() {
    // In a real application, this would generate a CSV or PDF file
    alert('This functionality would export all test results to a CSV file in a real application.');
}