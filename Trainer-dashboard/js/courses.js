document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const coursesContainer = document.getElementById('courses-container');
    const newCourseBtn = document.getElementById('new-course-btn');
    const courseModal = document.getElementById('course-modal');
    const courseForm = document.getElementById('course-form');
    const modulesContainer = document.getElementById('modules-container');
    const addModuleBtn = document.getElementById('add-module-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    // Sample data (replace with actual data from backend)
    let courses = [
        {
            id: 1,
            name: "Python Fundamentals",
            category: "Programming",
            description: "Learn the basics of Python programming language",
            thumbnail: "python",
            modules: [
                { id: 1, title: "Introduction to Python", content: "Basic syntax and concepts" },
                { id: 2, title: "Data Structures", content: "Lists, tuples, dictionaries" }
            ]
        },
        {
            id: 2,
            name: "Advanced SQL",
            category: "Database",
            description: "Master complex SQL queries and database design",
            thumbnail: "sql",
            modules: [
                { id: 1, title: "SQL Joins", content: "Different types of joins" },
                { id: 2, title: "Query Optimization", content: "Improving query performance" }
            ]
        }
    ];

    // Current course being edited
    let currentCourseId = null;
    let uploadedThumbnail = null;

    // Initialize the page
    function init() {
        renderCourses();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // New course button
        newCourseBtn.addEventListener('click', () => openCourseModal());

        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                courseModal.style.display = 'none';
                previewModal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === courseModal) courseModal.style.display = 'none';
            if (e.target === previewModal) previewModal.style.display = 'none';
        });

        // Cancel course button
        document.getElementById('cancel-course').addEventListener('click', () => {
            if (confirm('Discard changes?')) {
                courseModal.style.display = 'none';
                resetForm();
            }
        });

        // Add module button
        addModuleBtn.addEventListener('click', addModule);

        // Form submission
        courseForm.addEventListener('submit', handleCourseSubmit);

        // File upload
        document.getElementById('file-upload').addEventListener('change', handleFileUpload);
        document.getElementById('thumbnail-upload').addEventListener('change', handleThumbnailUpload);

        // Search functionality
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // Render all courses
    function renderCourses(filteredCourses = null) {
        coursesContainer.innerHTML = '';
        const coursesToRender = filteredCourses || courses;

        if (coursesToRender.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No Courses Found</h3>
                    <p>Create your first course or adjust your search</p>
                    <button class="btn-primary" id="empty-state-create-btn" style="margin-top: 15px;">
                        <i class="fas fa-plus"></i> Create Course
                    </button>
                </div>
            `;

            document.getElementById('empty-state-create-btn').addEventListener('click', () => openCourseModal());
            return;
        }

        coursesToRender.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card';
            courseElement.dataset.id = course.id;

            // Get thumbnail color based on course name
            const colors = [
                'var(--light-orange-peach)',
                'var(--burnt-orange)',
                'var(--reddish-orange)',
                'var(--dark-brick-red)'
            ];
            const colorIndex = course.name.length % colors.length;
            const thumbnailColor = colors[colorIndex];

            // Get initials for thumbnail
            const initials = course.name.split(' ').map(word => word[0]).join('').toUpperCase();

            courseElement.innerHTML = `
                <div class="course-thumbnail" style="background-color: ${thumbnailColor};">
                    ${initials}
                </div>
                <div class="course-details">
                    <h3>${course.name}</h3>
                    <div class="course-meta">
                        <span><i class="fas fa-tag"></i> ${course.category}</span>
                        <span><i class="fas fa-layer-group"></i> ${course.modules.length} Modules</span>
                    </div>
                    <p>${course.description}</p>
                    <div class="course-actions">
                        <button class="btn-preview" data-id="${course.id}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button class="btn-edit" data-id="${course.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" data-id="${course.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;

            coursesContainer.appendChild(courseElement);
        });

        // Add event listeners to course actions
        addCourseActionListeners();
    }

    // Add event listeners to course action buttons
    function addCourseActionListeners() {
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.addEventListener('click', function () {
                const courseId = parseInt(this.dataset.id);
                previewCourse(courseId);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function () {
                const courseId = parseInt(this.dataset.id);
                editCourse(courseId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function () {
                const courseId = parseInt(this.dataset.id);
                deleteCourse(courseId);
            });
        });
    }

    // Open course modal for adding/editing
    function openCourseModal(courseId = null) {
        currentCourseId = courseId;
        const modalTitle = document.getElementById('modal-title');

        if (courseId) {
            // Editing existing course
            modalTitle.textContent = 'Edit Course';
            const course = courses.find(c => c.id === courseId);

            // Fill in the form
            document.getElementById('course-name').value = course.name;
            document.getElementById('course-category').value = course.category;
            document.getElementById('course-description').value = course.description;

            // Load modules
            modulesContainer.innerHTML = '';
            course.modules.forEach(module => {
                addModule(module);
            });
        } else {
            // Adding new course
            modalTitle.textContent = 'Add New Course';
            resetForm();
        }

        courseModal.style.display = 'block';
    }

    // Reset the form
    function resetForm() {
        courseForm.reset();
        modulesContainer.innerHTML = '';
        uploadedThumbnail = null;
        addModule(); // Add one empty module by default
    }

    // Add a module to the form
    function addModule(moduleData = null) {
        const moduleId = moduleData?.id || Date.now();
        const moduleNumber = modulesContainer.children.length + 1;

        const moduleElement = document.createElement('div');
        moduleElement.className = 'module-item';
        moduleElement.dataset.id = moduleId;
        moduleElement.innerHTML = `
            <div class="module-header">
                <div class="module-title">Module ${moduleNumber}</div>
                <button class="remove-module" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Module Title</label>
                <input type="text" class="module-title-input" value="${moduleData?.title || ''}" placeholder="Module title" required>
            </div>
            <div class="form-group">
                <label>Content Description</label>
                <textarea class="module-content-input" rows="3" placeholder="Brief description of module content">${moduleData?.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Upload Content (Optional)</label>
                <input type="file" class="module-file-input" multiple>
            </div>
        `;

        modulesContainer.appendChild(moduleElement);

        // Add event listener to remove button
        moduleElement.querySelector('.remove-module').addEventListener('click', function () {
            if (modulesContainer.children.length > 1) {
                moduleElement.remove();
                updateModuleNumbers();
            } else {
                alert('A course must have at least one module');
            }
        });
    }

    // Update module numbers when one is removed
    function updateModuleNumbers() {
        const modules = modulesContainer.querySelectorAll('.module-item');
        modules.forEach((module, index) => {
            module.querySelector('.module-title').textContent = `Module ${index + 1}`;
        });
    }

    // Handle course form submission
    function handleCourseSubmit(e) {
        e.preventDefault();

        // Collect module data
        const modules = [];
        modulesContainer.querySelectorAll('.module-item').forEach(module => {
            modules.push({
                id: parseInt(module.dataset.id),
                title: module.querySelector('.module-title-input').value,
                content: module.querySelector('.module-content-input').value,
                // In a real app, you would handle file uploads here
            });
        });

        const courseData = {
            id: currentCourseId || Date.now(),
            name: document.getElementById('course-name').value,
            category: document.getElementById('course-category').value,
            description: document.getElementById('course-description').value,
            thumbnail: uploadedThumbnail || document.getElementById('course-name').value.toLowerCase().replace(/\s+/g, '-'),
            modules: modules
        };

        if (currentCourseId) {
            // Update existing course
            const index = courses.findIndex(c => c.id === currentCourseId);
            if (index !== -1) {
                courses[index] = courseData;
            }
        } else {
            // Add new course
            courses.push(courseData);
        }

        renderCourses();
        courseModal.style.display = 'none';
        resetForm();
        alert(`Course ${currentCourseId ? 'updated' : 'added'} successfully!`);
    }

    // Preview a course
    function previewCourse(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Get thumbnail color based on course name
        const colors = [
            'var(--light-orange-peach)',
            'var(--burnt-orange)',
            'var(--reddish-orange)',
            'var(--dark-brick-red)'
        ];
        const colorIndex = course.name.length % colors.length;
        const thumbnailColor = colors[colorIndex];

        // Get initials for thumbnail
        const initials = course.name.split(' ').map(word => word[0]).join('').toUpperCase();

        previewContent.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-eye"></i> ${course.name}</h3>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 150px; height: 150px; background-color: ${thumbnailColor}; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: bold;">
                    ${initials}
                </div>
            </div>
            
            <div class="form-group">
                <label>Category</label>
                <div style="padding: 10px 15px; background: var(--light-gray); border-radius: 6px;">${course.category}</div>
            </div>
            
            <div class="form-group">
                <label>Description</label>
                <div style="padding: 10px 15px; background: var(--light-gray); border-radius: 6px;">${course.description}</div>
            </div>
            
            <div class="form-group">
                <label>Modules (${course.modules.length})</label>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${course.modules.map(module => `
                        <div style="background: var(--light-gray); padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                            <div style="font-weight: 600; margin-bottom: 5px;">${module.title}</div>
                            <div style="color: #666; font-size: 0.9rem;">${module.content}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        previewModal.style.display = 'block';
    }

    // Edit a course
    function editCourse(courseId) {
        openCourseModal(courseId);
    }

    // Delete a course
    function deleteCourse(courseId) {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            courses = courses.filter(c => c.id !== courseId);
            renderCourses();
            alert('Course deleted successfully!');
        }
    }

    // Handle file upload
    function handleFileUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            alert(`Selected ${files.length} file(s) for upload`);
            // In a real app, this would upload files to server
        }
    }

    // Handle thumbnail upload
    function handleThumbnailUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                e.target.value = '';
                return;
            }

            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                e.target.value = '';
                return;
            }

            // Preview the image
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedThumbnail = event.target.result;
                alert('Thumbnail selected and ready for upload');
            };
            reader.readAsDataURL(file);
        }
    }

    // Handle search
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderCourses();
            return;
        }

        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm) ||
            course.category.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm)
        );

        renderCourses(filteredCourses);
    }

    // Initialize the page
    init();
});