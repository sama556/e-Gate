document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const mcqForm = document.getElementById('mcq-form');
    const questionsContainer = document.getElementById('questions-container');
    const addMcqQuestionBtn = document.getElementById('add-mcq-question');
    const testsList = document.getElementById('tests-list');
    const emptyState = document.getElementById('empty-state');
    const previewModal = document.getElementById('preview-modal');
    const gradeModal = document.getElementById('grade-modal');
    const editModal = document.getElementById('edit-modal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const testForms = document.querySelectorAll('.test-form');

    // Sample data (replace with actual data from backend)
    let tests = [
        {
            id: 1,
            title: "Python Basics Quiz",
            course: "Python Fundamentals",
            type: "MCQ",
            dueDate: "2025-04-20T23:59",
            status: "published",
            submissions: 12,
            totalStudents: 20,
            questions: [
                {
                    text: "What is the correct way to create a function in Python?",
                    options: [
                        "function myFunction():",
                        "def myFunction():",
                        "create myFunction():",
                        "func myFunction():"
                    ],
                    correctAnswer: 1
                }
            ]
        },
        {
            id: 2,
            title: "SQL Final Project",
            course: "Advanced SQL",
            type: "Essay",
            dueDate: "2025-05-05T23:59",
            status: "draft",
            submissions: 0,
            totalStudents: 15,
            questions: []
        }
    ];

    // Initialize the page
    function init() {
        renderTests();
        setMinDate();
        addFirstQuestion();

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

        document.getElementById('test-due-date').min = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.getElementById('essay-due-date').min = `${year}-${month}-${day}T${hours}:${minutes}`;
        document.getElementById('survey-due-date').min = `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Add question button
        addMcqQuestionBtn.addEventListener('click', addMcqQuestion);
        document.getElementById('add-survey-question').addEventListener('click', addSurveyQuestion);

        // Form submissions
        mcqForm.addEventListener('submit', handleTestSubmission);
        document.getElementById('essay-form').addEventListener('submit', (e) => {
            e.preventDefault();
            saveEssay('published');
        });
        document.getElementById('survey-form').addEventListener('submit', (e) => {
            e.preventDefault();
            saveSurvey('published');
        });

        // Save draft buttons
        document.getElementById('save-draft').addEventListener('click', () => saveTest('draft'));
        document.getElementById('save-essay-draft').addEventListener('click', () => saveEssay('draft'));
        document.getElementById('save-survey-draft').addEventListener('click', () => saveSurvey('draft'));

        // Export results button
        document.getElementById('export-results').addEventListener('click', exportResults);

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                previewModal.style.display = 'none';
                gradeModal.style.display = 'none';
                editModal.style.display = 'none';
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === previewModal) previewModal.style.display = 'none';
            if (e.target === gradeModal) gradeModal.style.display = 'none';
            if (e.target === editModal) editModal.style.display = 'none';
        });

        // Edit form listeners
        document.getElementById('cancel-edit').addEventListener('click', () => {
            editModal.style.display = 'none';
        });
        document.getElementById('edit-test-form').addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedTest();
        });
        document.getElementById('edit-add-question').addEventListener('click', () => {
            const questionCount = document.querySelectorAll('#edit-questions-container .question-item').length + 1;
            addEditQuestion({
                text: '',
                options: ['', ''],
                correctAnswer: 0
            }, questionCount);
        });
    }

    // Switch between test type tabs
    function switchTab(tabName) {
        // Update active tab
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show the corresponding form
        testForms.forEach(form => {
            form.classList.toggle('hidden', form.id !== `${tabName}-form`);
        });
    }

    // Add a new MCQ question
    function addMcqQuestion() {
        const questionCount = document.querySelectorAll('.question-item').length + 1;

        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${questionCount}</span>
                <button class="remove-question" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Question Text</label>
                <textarea class="question-text" rows="3" placeholder="Enter the question text" required></textarea>
            </div>
            <div class="options-container">
                <div class="option-item">
                    <input type="radio" name="question-${questionCount}" checked>
                    <input type="text" class="option-text" placeholder="Option 1" required>
                    <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                </div>
                <div class="option-item">
                    <input type="radio" name="question-${questionCount}">
                    <input type="text" class="option-text" placeholder="Option 2" required>
                    <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <button class="add-option" type="button">
                <i class="fas fa-plus"></i> Add Option
            </button>
        `;

        questionsContainer.appendChild(questionElement);

        // Add event listeners for the new question
        setupQuestionEventListeners(questionElement);
    }

    // Add a default first question
    function addFirstQuestion() {
        if (questionsContainer.children.length === 0) {
            addMcqQuestion();
        }
    }

    // Add an option to a question
    function addOption(questionElement) {
        const optionsContainer = questionElement.querySelector('.options-container');
        const optionCount = optionsContainer.children.length + 1;
        const questionNumber = questionElement.querySelector('.question-number').textContent.split(' ')[1];

        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.innerHTML = `
            <input type="radio" name="question-${questionNumber}">
            <input type="text" class="option-text" placeholder="Option ${optionCount}" required>
            <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
        `;

        optionsContainer.appendChild(optionElement);

        // Add event listener for the remove button
        optionElement.querySelector('.remove-option').addEventListener('click', function () {
            if (optionsContainer.children.length > 2) {
                this.closest('.option-item').remove();
            } else {
                alert('A question must have at least 2 options');
            }
        });
    }

    // Set up event listeners for a question
    function setupQuestionEventListeners(questionElement) {
        const removeQuestionBtn = questionElement.querySelector('.remove-question');
        const addOptionBtn = questionElement.querySelector('.add-option');
        const removeOptionBtns = questionElement.querySelectorAll('.remove-option');

        removeQuestionBtn.addEventListener('click', () => {
            if (confirm('Delete this question?')) {
                questionElement.remove();
                updateQuestionNumbers();
            }
        });

        addOptionBtn.addEventListener('click', () => {
            addOption(questionElement);
        });

        removeOptionBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                if (this.closest('.options-container').children.length > 2) {
                    this.closest('.option-item').remove();
                } else {
                    alert('A question must have at least 2 options');
                }
            });
        });
    }

    // Update question numbers after deletion
    function updateQuestionNumbers() {
        const questions = document.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.querySelector('.question-number').textContent = `Question ${index + 1}`;
        });
    }

    // Handle test form submission
    function handleTestSubmission(e) {
        e.preventDefault();
        saveTest('published');
    }

    // Save test (draft or published)
    function saveTest(status) {
        // Collect all questions
        const questions = [];
        document.querySelectorAll('.question-item').forEach(question => {
            const options = [];
            let correctAnswer = 0;

            question.querySelectorAll('.option-item').forEach((option, index) => {
                options.push(option.querySelector('.option-text').value);
                if (option.querySelector('input[type="radio"]').checked) {
                    correctAnswer = index;
                }
            });

            questions.push({
                text: question.querySelector('.question-text').value,
                options: options,
                correctAnswer: correctAnswer
            });
        });

        // Create test object
        const newTest = {
            id: Date.now(), // Simple ID generation
            title: document.getElementById('test-title').value,
            course: document.getElementById('test-course').value,
            type: "MCQ",
            dueDate: document.getElementById('test-due-date').value,
            timeLimit: document.getElementById('test-time-limit').value,
            instructions: document.getElementById('test-instructions').value,
            status: status,
            submissions: 0,
            totalStudents: 20, // This would come from course enrollment
            questions: questions
        };

        tests.push(newTest);
        renderTests();

        // Reset form if published
        if (status === 'published') {
            mcqForm.reset();
            questionsContainer.innerHTML = '';
            addFirstQuestion();
            alert('Test published successfully!');
        } else {
            alert('Draft saved successfully!');
        }
    }

    // Save essay assignment
    function saveEssay(status) {
        const allowedFileTypes = [];
        document.querySelectorAll('input[name="essay-file-types"]:checked').forEach(checkbox => {
            allowedFileTypes.push(checkbox.value);
        });

        const newEssay = {
            id: Date.now(),
            title: document.getElementById('essay-title').value,
            course: document.getElementById('essay-course').value,
            type: "Essay",
            dueDate: document.getElementById('essay-due-date').value,
            wordLimit: document.getElementById('essay-word-limit').value || null,
            prompt: document.getElementById('essay-prompt').value,
            rubric: document.getElementById('essay-rubric').value,
            allowedFileTypes: allowedFileTypes,
            status: status,
            submissions: 0,
            totalStudents: 20
        };

        tests.push(newEssay);
        renderTests();

        if (status === 'published') {
            document.getElementById('essay-form').reset();
            alert('Assignment published successfully!');
        } else {
            alert('Draft saved successfully!');
        }
    }

    // Save survey
    function saveSurvey(status) {
        const questions = [];
        document.querySelectorAll('#survey-questions-container .question-item').forEach(question => {
            const options = [];
            question.querySelectorAll('.option-text').forEach(opt => {
                options.push(opt.value);
            });

            questions.push({
                text: question.querySelector('.question-text').value,
                type: question.dataset.questionType,
                options: options,
                required: question.querySelector('.required-toggle').checked
            });
        });

        const newSurvey = {
            id: Date.now(),
            title: document.getElementById('survey-title').value,
            course: document.getElementById('survey-course').value,
            type: "Survey",
            dueDate: document.getElementById('survey-due-date').value,
            anonymous: document.getElementById('survey-anonymous').value === 'anonymous',
            description: document.getElementById('survey-description').value,
            questions: questions,
            status: status,
            submissions: 0,
            totalStudents: 20
        };

        tests.push(newSurvey);
        renderTests();

        if (status === 'published') {
            document.getElementById('survey-form').reset();
            document.getElementById('survey-questions-container').innerHTML = '';
            alert('Survey published successfully!');
        } else {
            alert('Draft saved successfully!');
        }
    }

    // Add survey question
    function addSurveyQuestion() {
        const questionCount = document.querySelectorAll('#survey-questions-container .question-item').length + 1;

        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.dataset.questionType = 'multiple-choice';
        questionElement.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${questionCount}</span>
                <div class="question-type">
                    <select class="question-type-select">
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="checkbox">Checkboxes</option>
                        <option value="short-answer">Short Answer</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="scale">Scale (1-5)</option>
                    </select>
                </div>
                <div class="question-required">
                    <label>
                        <input type="checkbox" class="required-toggle" checked>
                        Required
                    </label>
                </div>
                <button class="remove-question" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Question Text</label>
                <textarea class="question-text" rows="2" placeholder="Enter the question text" required></textarea>
            </div>
            <div class="options-container">
                <div class="option-item">
                    <input type="text" class="option-text" placeholder="Option 1" required>
                    <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                </div>
                <div class="option-item">
                    <input type="text" class="option-text" placeholder="Option 2" required>
                    <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <button class="add-option" type="button">
                <i class="fas fa-plus"></i> Add Option
            </button>
        `;

        document.getElementById('survey-questions-container').appendChild(questionElement);

        // Set up event listeners
        const removeQuestionBtn = questionElement.querySelector('.remove-question');
        const addOptionBtn = questionElement.querySelector('.add-option');
        const removeOptionBtns = questionElement.querySelectorAll('.remove-option');
        const typeSelect = questionElement.querySelector('.question-type-select');

        removeQuestionBtn.addEventListener('click', () => {
            if (confirm('Delete this question?')) {
                questionElement.remove();
                updateSurveyQuestionNumbers();
            }
        });

        addOptionBtn.addEventListener('click', () => {
            addSurveyOption(questionElement);
        });

        removeOptionBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                if (this.closest('.options-container').children.length > 2) {
                    this.closest('.option-item').remove();
                } else {
                    alert('A question must have at least 2 options');
                }
            });
        });

        typeSelect.addEventListener('change', function () {
            updateQuestionType(questionElement, this.value);
        });
    }

    // Add option to survey question
    function addSurveyOption(questionElement) {
        const optionsContainer = questionElement.querySelector('.options-container');
        const optionCount = optionsContainer.children.length + 1;

        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.innerHTML = `
            <input type="text" class="option-text" placeholder="Option ${optionCount}" required>
            <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
        `;

        optionsContainer.appendChild(optionElement);

        optionElement.querySelector('.remove-option').addEventListener('click', function () {
            if (optionsContainer.children.length > 2) {
                this.closest('.option-item').remove();
            } else {
                alert('A question must have at least 2 options');
            }
        });
    }

    // Update question type
    function updateQuestionType(questionElement, type) {
        questionElement.dataset.questionType = type;
        const optionsContainer = questionElement.querySelector('.options-container');

        if (type === 'short-answer' || type === 'paragraph' || type === 'scale') {
            optionsContainer.innerHTML = '';

            if (type === 'scale') {
                optionsContainer.innerHTML = `
                    <div class="scale-options">
                        <span>1 (Lowest)</span>
                        <span>2</span>
                        <span>3 (Neutral)</span>
                        <span>4</span>
                        <span>5 (Highest)</span>
                    </div>
                `;
            }
        } else {
            if (optionsContainer.children.length === 0) {
                optionsContainer.innerHTML = `
                    <div class="option-item">
                        <input type="text" class="option-text" placeholder="Option 1" required>
                        <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="option-item">
                        <input type="text" class="option-text" placeholder="Option 2" required>
                        <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                    </div>
                `;
            }
        }
    }

    // Update survey question numbers
    function updateSurveyQuestionNumbers() {
        const questions = document.querySelectorAll('#survey-questions-container .question-item');
        questions.forEach((question, index) => {
            question.querySelector('.question-number').textContent = `Question ${index + 1}`;
        });
    }

    // Render all tests in the table
    function renderTests() {
        testsList.innerHTML = '';

        if (tests.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        tests.forEach(test => {
            const testElement = document.createElement('tr');
            testElement.dataset.id = test.id;

            const dueDate = new Date(test.dueDate);
            const formattedDate = dueDate.toLocaleDateString() + ' ' + dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let statusClass = '';
            let statusText = '';

            switch (test.status) {
                case 'draft':
                    statusClass = 'status-draft';
                    statusText = 'Draft';
                    break;
                case 'published':
                    statusClass = 'status-published';
                    statusText = 'Published';
                    break;
                case 'closed':
                    statusClass = 'status-closed';
                    statusText = 'Closed';
                    break;
            }

            testElement.innerHTML = `
                <td>${test.title}</td>
                <td>${test.course}</td>
                <td>${test.type}</td>
                <td>${formattedDate}</td>
                <td><span class="test-status ${statusClass}">${statusText}</span></td>
                <td>${test.submissions}/${test.totalStudents}</td>
                <td class="test-actions">
                    <button class="btn-action btn-preview" data-action="preview">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    ${test.status === 'published' ? `
                        <button class="btn-action btn-grade" data-action="grade">
                            <i class="fas fa-check-circle"></i> Grade
                        </button>
                    ` : ''}
                    <button class="btn-action btn-edit" data-action="edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action btn-delete" data-action="delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;

            testsList.appendChild(testElement);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', function () {
                const testId = parseInt(this.closest('tr').dataset.id);
                const action = this.dataset.action;
                const test = tests.find(t => t.id === testId);

                switch (action) {
                    case 'preview':
                        previewTest(test);
                        break;
                    case 'grade':
                        gradeTest(test);
                        break;
                    case 'edit':
                        editTest(test);
                        break;
                    case 'delete':
                        deleteTest(testId);
                        break;
                }
            });
        });
    }

    // Preview a test
    function previewTest(test) {
        const previewContent = document.getElementById('preview-content');
        previewContent.innerHTML = `
            <h3>${test.title}</h3>
            <p><strong>Course:</strong> ${test.course}</p>
            <p><strong>Due:</strong> ${new Date(test.dueDate).toLocaleString()}</p>
            ${test.timeLimit ? `<p><strong>Time Limit:</strong> ${test.timeLimit} minutes</p>` : ''}
            ${test.wordLimit ? `<p><strong>Word Limit:</strong> ${test.wordLimit} words</p>` : ''}
            
            <div class="test-instructions">
                <h4>Instructions</h4>
                <p>${test.instructions || test.prompt || test.description || 'No instructions provided.'}</p>
            </div>
            
            ${test.questions && test.questions.length > 0 ? `
                <div class="test-questions">
                    <h4>Questions (${test.questions.length})</h4>
                    ${test.questions.map((q, i) => `
                        <div class="preview-question">
                            <p><strong>${i + 1}. ${q.text}</strong> ${q.required ? '(Required)' : ''}</p>
                            ${q.options && q.options.length > 0 ? `
                                <ul>
                                    ${q.options.map((o, j) => `
                                        <li style="${j === q.correctAnswer ? 'color: var(--burnt-orange); font-weight: bold;' : ''}">
                                            ${String.fromCharCode(97 + j)}. ${o}
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : q.type === 'scale' ? `
                                <div class="scale-options">
                                    <span>1 (Lowest)</span>
                                    <span>2</span>
                                    <span>3 (Neutral)</span>
                                    <span>4</span>
                                    <span>5 (Highest)</span>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;

        previewModal.style.display = 'block';
    }

    // Grade test submissions
    function gradeTest(test) {
        const gradeContent = document.getElementById('grade-content');
        gradeContent.innerHTML = `
            <h4>${test.title} - Grading</h4>
            <p>${test.submissions} submissions to grade</p>
            
            <div class="submission-list">
                <div class="submission-item">
                    <div class="student-info">
                        <img src="https://via.placeholder.com/40" alt="Student">
                        <div>
                            <p><strong>${test.anonymous ? 'Anonymous' : 'Ahmed Mohamed'}</strong></p>
                            <p>Submitted: ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="submission-grade">
                        <select class="grade-select">
                            <option value="">Select grade</option>
                            <option value="A">A (90-100%)</option>
                            <option value="B">B (80-89%)</option>
                            <option value="C">C (70-79%)</option>
                            <option value="D">D (60-69%)</option>
                            <option value="F">F (Below 60%)</option>
                        </select>
                        <button class="btn-primary btn-sm">Save</button>
                    </div>
                </div>
                <!-- More submissions would be listed here -->
            </div>
            
            <div class="grade-actions">
                <button class="btn-primary">
                    <i class="fas fa-save"></i> Save All Grades
                </button>
                <button class="btn-secondary">
                    <i class="fas fa-download"></i> Export Grades
                </button>
            </div>
        `;

        gradeModal.style.display = 'block';
    }

    // Edit a test - updated version
    function editTest(test) {
        const editModal = document.getElementById('edit-modal');
        const editForm = document.getElementById('edit-test-form');

        // Fill in the form with the test data
        document.getElementById('edit-test-title').value = test.title;
        document.getElementById('edit-test-course').value = test.course;
        document.getElementById('edit-test-due-date').value = test.dueDate;

        // Only set time limit for MCQ tests
        if (test.type === "MCQ") {
            document.getElementById('edit-test-time-limit').value = test.timeLimit || 30;
        } else {
            document.getElementById('edit-test-time-limit').value = '';
        }

        // Set instructions based on test type
        if (test.type === "MCQ") {
            document.getElementById('edit-test-instructions').value = test.instructions || '';
        } else if (test.type === "Essay") {
            document.getElementById('edit-test-instructions').value = test.prompt || '';
        } else if (test.type === "Survey") {
            document.getElementById('edit-test-instructions').value = test.description || '';
        }

        // Clear existing questions
        const editQuestionsContainer = document.getElementById('edit-questions-container');
        editQuestionsContainer.innerHTML = '';

        // Store the test ID being edited
        editForm.dataset.testId = test.id;

        // Add questions if they exist
        if (test.questions && test.questions.length > 0) {
            test.questions.forEach((q, i) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question-item';
                questionElement.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Question ${i + 1}</span>
                    <button class="remove-question" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="form-group">
                    <label>Question Text</label>
                    <textarea class="question-text" rows="3" required>${q.text}</textarea>
                </div>
                <div class="options-container">
                    ${q.options.map((option, j) => `
                        <div class="option-item">
                            <input type="radio" name="edit-question-${i + 1}" ${j === q.correctAnswer ? 'checked' : ''}>
                            <input type="text" class="option-text" value="${option}" required>
                            <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                        </div>
                    `).join('')}
                </div>
                <button class="add-option" type="button">
                    <i class="fas fa-plus"></i> Add Option
                </button>
            `;

                editQuestionsContainer.appendChild(questionElement);

                // Set up event listeners for the new question
                const removeQuestionBtn = questionElement.querySelector('.remove-question');
                const addOptionBtn = questionElement.querySelector('.add-option');
                const removeOptionBtns = questionElement.querySelectorAll('.remove-option');

                removeQuestionBtn.addEventListener('click', () => {
                    if (confirm('Delete this question?')) {
                        questionElement.remove();
                        updateEditQuestionNumbers();
                    }
                });

                addOptionBtn.addEventListener('click', () => {
                    const optionsContainer = questionElement.querySelector('.options-container');
                    const optionCount = optionsContainer.children.length + 1;

                    const optionElement = document.createElement('div');
                    optionElement.className = 'option-item';
                    optionElement.innerHTML = `
                    <input type="radio" name="edit-question-${i + 1}">
                    <input type="text" class="option-text" placeholder="Option ${optionCount}" required>
                    <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                `;

                    optionsContainer.appendChild(optionElement);

                    optionElement.querySelector('.remove-option').addEventListener('click', function () {
                        if (optionsContainer.children.length > 2) {
                            this.closest('.option-item').remove();
                        } else {
                            alert('A question must have at least 2 options');
                        }
                    });
                });

                removeOptionBtns.forEach(btn => {
                    btn.addEventListener('click', function () {
                        if (this.closest('.options-container').children.length > 2) {
                            this.closest('.option-item').remove();
                        } else {
                            alert('A question must have at least 2 options');
                        }
                    });
                });
            });
        }

        // Show the modal
        editModal.style.display = 'block';
    }

    // Update question numbers in edit form
    function updateEditQuestionNumbers() {
        const questions = document.querySelectorAll('#edit-questions-container .question-item');
        questions.forEach((question, index) => {
            question.querySelector('.question-number').textContent = `Question ${index + 1}`;
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.name = `edit-question-${index + 1}`;
            });
        });
    }

    // Add question to edit form
    function addEditQuestion(question, questionNumber) {
        const editQuestionsContainer = document.getElementById('edit-questions-container');

        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        questionElement.dataset.questionId = questionNumber;
        questionElement.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${questionNumber}</span>
                <button class="remove-question" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Question Text</label>
                <textarea class="question-text" rows="3" required>${question.text}</textarea>
            </div>
            <div class="options-container">
                ${question.options ? question.options.map((option, j) => `
                    <div class="option-item">
                        <input type="radio" name="edit-question-${questionNumber}" ${j === question.correctAnswer ? 'checked' : ''}>
                        <input type="text" class="option-text" value="${option}" required>
                        <button class="remove-option" type="button"><i class="fas fa-times"></i></button>
                    </div>
                `).join('') : ''}
            </div>
            <button class="add-option" type="button">
                <i class="fas fa-plus"></i> Add Option
            </button>
        `;

        editQuestionsContainer.appendChild(questionElement);

        // Add event listeners
        setupQuestionEventListeners(questionElement);
    }

    // Save edited test
    function saveEditedTest() {
        const editForm = document.getElementById('edit-test-form');
        const testId = parseInt(editForm.dataset.testId);
        const testIndex = tests.findIndex(t => t.id === testId);

        if (testIndex === -1) return;

        // Collect all questions
        const questions = [];
        document.querySelectorAll('#edit-questions-container .question-item').forEach(question => {
            const options = [];
            let correctAnswer = 0;

            question.querySelectorAll('.option-item').forEach((option, index) => {
                options.push(option.querySelector('.option-text').value);
                if (option.querySelector('input[type="radio"]').checked) {
                    correctAnswer = index;
                }
            });

            questions.push({
                text: question.querySelector('.question-text').value,
                options: options,
                correctAnswer: correctAnswer
            });
        });

        // Update test object
        tests[testIndex] = {
            ...tests[testIndex],
            title: document.getElementById('edit-test-title').value,
            course: document.getElementById('edit-test-course').value,
            dueDate: document.getElementById('edit-test-due-date').value,
            timeLimit: document.getElementById('edit-test-time-limit').value,
            instructions: document.getElementById('edit-test-instructions').value,
            questions: questions
        };

        // Close modal and refresh
        editModal.style.display = 'none';
        renderTests();
        alert('Test updated successfully!');
    }

    // Delete a test
    function deleteTest(testId) {
        if (confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
            tests = tests.filter(t => t.id !== testId);
            renderTests();
            alert('Test deleted successfully!');
        }
    }

    // Export results
    function exportResults() {
        // In a real app, this would generate a CSV or PDF
        alert('Exporting test results...');
    }

    // Initialize the page
    init();
});