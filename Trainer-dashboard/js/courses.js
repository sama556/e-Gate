document.addEventListener('DOMContentLoaded', function () {

    const coursesContainer = document.getElementById('courses-container');
    const newCourseBtn = document.getElementById('new-course-btn');
    const courseModal = document.getElementById('course-modal');
    const courseForm = document.getElementById('course-form');
    const modulesContainer = document.getElementById('modules-container');
    const addModuleBtn = document.getElementById('add-module-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');

  
    if (!coursesContainer || !courseModal || !courseForm || !modulesContainer) {
        console.error('Critical DOM elements are missing. Check your HTML structure.');
        return; 
    }

    let courses = [
        {
            id: 1,
            name: "Python Fundamentals",
            category: "Programming",
            description: "Learn the basics of Python programming language",
            thumbnail: "python",
            createdBy: "admin", 
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
            createdBy: "admin", // Added to track creator
            modules: [
                { id: 1, title: "SQL Joins", content: "Different types of joins" },
                { id: 2, title: "Query Optimization", content: "Improving query performance" }
            ]
        },
        {
            id: 3,
            name: "Web Development Basics",
            category: "Web Development",
            description: "Introduction to HTML, CSS and JavaScript",
            thumbnail: "webdev",
            createdBy: "admin",
            modules: [
                { id: 1, title: "HTML Fundamentals", content: "Basic HTML structure and elements" }
            ]
        }
    ];
    let currentCourseId = null;
    let uploadedThumbnail = null;
    let isAddingContent = false; 

    // Initialize the page
    function init() {
        renderCourses();
        setupEventListeners();
    }
    function setupEventListeners() {
        if (newCourseBtn) {
            newCourseBtn.innerHTML = '<i class="fas fa-plus"></i> Add Course Materials';
            newCourseBtn.addEventListener('click', () => openCourseModal());
        }
        
        // Close modal buttons
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (courseModal) courseModal.style.display = 'none';
                if (previewModal) previewModal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (courseModal && e.target === courseModal) courseModal.style.display = 'none';
            if (previewModal && e.target === previewModal) previewModal.style.display = 'none';
        });

        // Cancel course button
        const cancelBtn = document.getElementById('cancel-course');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Discard changes?')) {
                    if (courseModal) courseModal.style.display = 'none';
                    resetForm();
                }
            });
        }

        if (addModuleBtn) {
            addModuleBtn.addEventListener('click', addModule);
        }
        if (courseForm) {
            courseForm.addEventListener('submit', handleCourseSubmit);
        }
        const fileUpload = document.getElementById('file-upload');
        if (fileUpload) {
            fileUpload.addEventListener('change', handleFileUpload);
        }
    }

    // Render all courses
    function renderCourses(filteredCourses = null) {
        if (!coursesContainer) return;
        
        coursesContainer.innerHTML = '';
        const coursesToRender = filteredCourses || courses;

        if (coursesToRender.length === 0) {
            coursesContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No Courses Found</h3>
                    <p>Add content to existing courses or adjust your search</p>
                </div>
            `;
            return;
        }

        coursesToRender.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course-card';
            courseElement.dataset.id = course.id;
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

            // Determine course badge based on creator
            const creatorBadge = course.createdBy === 'admin' 
                ? `<span class="course-badge admin-badge"><i class="fas fa-shield-alt"></i> Admin Course</span>` 
                : `<span class="course-badge trainer-badge"><i class="fas fa-user"></i> Trainer Course</span>`;

            courseElement.innerHTML = `
                <div class="course-thumbnail" style="background-color: ${thumbnailColor};">
                    ${initials}
                </div>
                <div class="course-details">
                    <div class="course-header">
                        <h3>${course.name}</h3>
                        ${creatorBadge}
                    </div>
                    <div class="course-meta">
                        <span><i class="fas fa-tag"></i> ${course.category}</span>
                        <span><i class="fas fa-layer-group"></i> ${course.modules.length} Lessons</span>
                    </div>
                    <p>${course.description}</p>
                    <div class="course-actions">
                        <button class="btn-preview" data-id="${course.id}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        ${course.createdBy === 'admin' ? `
                            <button class="btn-add-content" data-id="${course.id}">
                                <i class="fas fa-plus-circle"></i> Add Content
                            </button>
                        ` : `
                            <button class="btn-edit" data-id="${course.id}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn-delete" data-id="${course.id}">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        `}
                    </div>
                </div>
            `;

            coursesContainer.appendChild(courseElement);
        });
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

        // Add listeners for the new "Add Content" button
        document.querySelectorAll('.btn-add-content').forEach(btn => {
            btn.addEventListener('click', function () {
                const courseId = parseInt(this.dataset.id);
                addContentToCourse(courseId);
            });
        });
    }
    function addContentToCourse(courseId) {
        if (!modulesContainer) return;
        
        currentCourseId = courseId;
        isAddingContent = true;
        const course = courses.find(c => c.id === courseId);
        
        if (!course) return;

        // Update modal title - with null check
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = `Add Content to "${course.name}"`;
        }

        // Clear previous form
        resetForm();
        
        // Display existing modules as read-only
        course.modules.forEach(module => {
            const moduleElement = document.createElement('div');
            moduleElement.className = 'module-item existing-module';
            moduleElement.innerHTML = `
                <div class="module-header">
                    <div class="module-title">Existing Lesson: ${module.title}</div>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <div class="readonly-field">${module.content}</div>
                </div>
            `;
            modulesContainer.appendChild(moduleElement);
        });

        addModule({
            title: '',
            content: '',
            isNew: true
        });
        if (courseModal) {
            courseModal.style.display = 'block';
        }
    }

    // Open course modal for adding/editing - with null checks
    function openCourseModal(courseId = null) {
        if (!modulesContainer || !courseModal) return;
        
        currentCourseId = courseId;
        isAddingContent = false;
        
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            if (courseId) {
        
                modalTitle.textContent = 'Edit Course';
                const course = courses.find(c => c.id === courseId);
                
                if (course) {
                    // Load modules
                    modulesContainer.innerHTML = '';
                    course.modules.forEach(module => {
                        addModule(module);
                    });
                }
            } else {
                // Adding new course
                modalTitle.textContent = 'Add New Course';
                resetForm();
            }
        }

        courseModal.style.display = 'block';
    }

    // Reset the form - with null checks
    function resetForm() {
        if (courseForm) {
            if (courseForm.classList.contains('content-mode')) {
                courseForm.classList.remove('content-mode');
            }
            courseForm.reset();
        }
        
        if (modulesContainer) {
            modulesContainer.innerHTML = '';
            addModule(); 
        }
        uploadedThumbnail = null;
    }

    // Add a module to the form - with null checks
    function addModule(moduleData = null) {
        if (!modulesContainer) return;
        
        const moduleId = moduleData?.id || Date.now();
        const moduleNumber = modulesContainer.children.length + 1;
        const isNewModule = moduleData?.isNew || false;

        const moduleElement = document.createElement('div');
        moduleElement.className = 'module-item';
        if (isNewModule) {
            moduleElement.classList.add('new-module');
        }
        moduleElement.dataset.id = moduleId;
        
        moduleElement.innerHTML = `
            <div class="module-header">
                <div class="module-title">${isNewModule ? 'New Lesson' : `Lesson ${moduleNumber}`}</div>
                <button class="remove-module" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Lesson Title</label>
                <input type="text" class="module-title-input" value="${moduleData?.title || ''}" placeholder="Lesson title" required>
            </div>
            <div class="form-group">
                <label>Content Description</label>
                <textarea class="module-content-input" rows="3" placeholder="Brief description of lesson content">${moduleData?.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Upload Content Files</label>
                <div class="file-upload-container">
                    <label for="module-file-${moduleId}" class="file-upload-label">
                        <i class="fas fa-cloud-upload-alt"></i> Select Files
                    </label>
                    <input type="file" id="module-file-${moduleId}" class="module-file-input" multiple>
                    <div class="selected-files" id="selected-files-${moduleId}">No files selected</div>
                </div>
            </div>
        `;

        modulesContainer.appendChild(moduleElement);

        // Add event listener to remove button
        const removeBtn = moduleElement.querySelector('.remove-module');
        if (removeBtn) {
            removeBtn.addEventListener('click', function () {
                if (modulesContainer.children.length > 1) {
                    moduleElement.remove();
                    updateModuleNumbers();
                } else {
                    alert('A course must have at least one module');
                }
            });
        }
        
        // Add event listener to file input
        const fileInput = moduleElement.querySelector('.module-file-input');
        const selectedFilesDiv = moduleElement.querySelector('.selected-files');
        
        if (fileInput && selectedFilesDiv) {
            fileInput.addEventListener('change', function(e) {
                if (this.files.length > 0) {
                    const fileNames = Array.from(this.files).map(file => file.name).join(', ');
                    selectedFilesDiv.textContent = fileNames;
                    selectedFilesDiv.style.color = 'var(--dark-text)';
                } else {
                    selectedFilesDiv.textContent = 'No files selected';
                    selectedFilesDiv.style.color = '#999';
                }
            });
        }
    }
    function updateModuleNumbers() {
        if (!modulesContainer) return;
        
        const modules = modulesContainer.querySelectorAll('.module-item:not(.new-module):not(.existing-module)');
        modules.forEach((module, index) => {
            const titleEl = module.querySelector('.module-title');
            if (titleEl) {
                titleEl.textContent = `Module ${index + 1}`;
            }
        });
    }

    // Handle course form submission
    function handleCourseSubmit(e) {
        e.preventDefault();

        if (isAddingContent) {
            // Adding content to admin course
            const course = courses.find(c => c.id === currentCourseId);
            if (!course) return;
            
            // Get new modules
            const newModules = [];
            const newModuleElements = modulesContainer.querySelectorAll('.module-item.new-module');
            
            newModuleElements.forEach(module => {
                const titleInput = module.querySelector('.module-title-input');
                const contentInput = module.querySelector('.module-content-input');
                
                if (titleInput && contentInput && titleInput.value.trim() !== '') {
                    newModules.push({
                        id: course.modules.length + newModules.length + 1,
                        title: titleInput.value,
                        content: contentInput.value,
                        // In a real app, you would handle file uploads here
                    });
                }
            });
            
            if (newModules.length === 0) {
                alert('Please add at least one module with content');
                return;
            }
            
            // Add new modules to the course
            course.modules = [...course.modules, ...newModules];
            
            alert(`Content added successfully to "${course.name}"!`);
        } else {
            // Regular course add/edit
            // Collect module data
            const modules = [];
            const moduleElements = modulesContainer.querySelectorAll('.module-item:not(.existing-module)');
            
            moduleElements.forEach(module => {
                const titleInput = module.querySelector('.module-title-input');
                const contentInput = module.querySelector('.module-content-input');
                
                if (titleInput && contentInput) {
                    modules.push({
                        id: parseInt(module.dataset.id),
                        title: titleInput.value,
                        content: contentInput.value,
                        // In a real app, you would handle file uploads here
                    });
                }
            });

            const nameInput = document.getElementById('course-name');
            const categoryInput = document.getElementById('course-category');
            const descriptionInput = document.getElementById('course-description');

            const courseData = {
                id: currentCourseId || Date.now(),
                name: nameInput?.value || "New Course", // Fallback if input doesn't exist
                category: categoryInput?.value || "General",
                description: descriptionInput?.value || "Course description",
                thumbnail: uploadedThumbnail || "default",
                createdBy: "trainer", // All courses created here are by trainer
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

            alert(`Course ${currentCourseId ? 'updated' : 'added'} successfully!`);
        }

        renderCourses();
        if (courseModal) {
            courseModal.style.display = 'none';
        }
        resetForm();
    }

    // Preview a course - with null checks
    function previewCourse(courseId) {
        if (!previewContent || !previewModal) return;
        
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

        // Determine course badge based on creator
        const creatorBadge = course.createdBy === 'admin' 
            ? `<div class="creator-badge admin">Created by Admin</div>` 
            : `<div class="creator-badge trainer">Created by Trainer</div>`;

        previewContent.innerHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-eye"></i> ${course.name}</h3>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px; position: relative;">
                <div style="width: 150px; height: 150px; background-color: ${thumbnailColor}; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 3rem; font-weight: bold;">
                    ${initials}
                </div>
                ${creatorBadge}
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
                <div style="max-height: 300px; overflow-y: auto;">
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
        const course = courses.find(c => c.id === courseId);
        
        if (!course) return;
        
        // Only allow deletion of trainer-created courses
        if (course.createdBy === 'admin') {
            alert('Admin courses cannot be deleted from this panel.');
            return;
        }
        
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

    // Initialize the page
    init();
});