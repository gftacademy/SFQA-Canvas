// Variabel Global
let currentCapabilities = [];
let currentMilestones = [];
let projects = loadProjectsFromLocalStorage();

// Helper function to save projects to Local Storage
function saveProjectsToLocalStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}
// Helper function to load projects from Local Storage
function loadProjectsFromLocalStorage() {
    const storedProjects = localStorage.getItem('projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
}

// Load projects from Local Storage or use dummy data if empty
if (projects.length === 0) {
    projects = [
        {
            id: 'P001',
            name: 'Project A',
            description: 'Project A Description',
            status: 'In Progress',
            startDate: '2023-08-01',
            endDate: '2023-12-31',
            capabilities: ['Feature 1', 'Feature 2', 'Feature 3'],
            milestones: [
                {
                    name: 'Milestone 1',
                    useCases: ['Use Case 1', 'Use Case 2'],
                    deliverables: [
                        {
                            name: 'Deliverable 1',
                            details: 'Technical details for deliverable 1'
                        },
                        {
                            name: 'Deliverable 2',
                            details: 'Technical details for deliverable 2'
                        }
                    ],
                    completed: true
                },
                {
                    name: 'Milestone 2',
                    useCases: ['Use Case 3'],
                    deliverables: [
                        {
                            name: 'Deliverable 3',
                            details: 'Technical details for deliverable 3'
                        }
                    ],
                    completed: false
                }
            ]
        }
    ];
    saveProjectsToLocalStorage(); // Save the initial data to Local Storage
}

// Calculate project progress
function calculateProgress(milestones) {
    const completedMilestones = milestones.filter(milestone => milestone.completed).length;
    return Math.round((completedMilestones / milestones.length) * 100);
}


// View project details
function viewProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        document.getElementById('project-list-view').classList.add('hidden');
        document.getElementById('project-detail-view').classList.remove('hidden');

        document.getElementById('project-name-detail').textContent = project.name;
        document.getElementById('project-description-detail').textContent = project.description;

        // Populate capability list
        const capabilityList = document.getElementById('capability-list');
        capabilityList.innerHTML = ''; // Clear previous items
        project.capabilities.forEach(capability => {
            const listItem = document.createElement('li');
            listItem.textContent = capability;
            capabilityList.appendChild(listItem);
        });

        // Populate milestone list with deliverables
        const milestoneList = document.getElementById('milestone-list');
        milestoneList.innerHTML = ''; // Clear previous items
        project.milestones.forEach(milestone => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 bg-gray-100 rounded-lg shadow';
            listItem.innerHTML = `
          <span class="font-semibold">${milestone.name}</span>
          <ul class="list-disc ml-5 mt-1">
            ${milestone.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
          </ul>
        `;
            listItem.appendChild(loadDeliverables(milestone));
            milestoneList.appendChild(listItem);
        });
    } else {
        alert('project tidak ditemukan')
    }
}

// Load Deliverables into the UI
function loadDeliverables(milestone) {
    const deliverableList = document.createElement('ul');
    deliverableList.className = 'list-disc ml-5 mt-1';
    milestone.deliverables.forEach(deliverable => {
        const deliverableItem = document.createElement('li');
        deliverableItem.innerHTML = `<strong>${deliverable.name}</strong>: ${deliverable.details}`;
        deliverableList.appendChild(deliverableItem);
    });
    return deliverableList;
}

// Save projects back to Local Storage after any changes
function saveAndUpdateProjects() {
    saveProjectsToLocalStorage();
    loadProjectList();
}

// Delete project
function deleteProject(projectId) {
    const confirmation = confirm(`Are you sure to delete project ID: ${projectId}?`);
    if (confirmation) {
        projects = projects.filter(project => project.id !== projectId);
        currentPage = 1; // Reset ke halaman pertama saat jumlah per halaman diubah
        showToast('Project deleted successfully');
        saveAndUpdateProjects();
    };
}

// Function to load and display the project list in the table
let currentPage = 1;
let itemsPerPage = 5;
document.getElementById('projectsPerPage').value = 5; // Default projects per page    
// Fungsi untuk menghitung total halaman
function calculateTotalPages() {
    return Math.ceil(projects.length / itemsPerPage);
}

function loadProjectList() {
    const tableBody = document.getElementById("project-list-tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    paginatedProjects.forEach(project => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-100', 'transition-colors', 'border-b', 'border-gray-300');

        row.innerHTML = `
        <td class="py-3 px-4 flex items-center text-sm text-gray-800">
          <i class="fas fa-folder-open text-blue-500 mr-3"></i> ${project.name} 
        </td>
        <td class="py-3 px-4 text-sm">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(project.status)}">
            <i class="fas fa-tasks mr-1"></i> ${project.status}
          </span>
        </td>
        <td class="py-3 px-4 text-sm text-gray-600">
          <ul class="list-disc pl-5">
            ${project.capabilities.map(cap => `<li>${cap}</li>`).join('')}
          </ul>
        </td>
        <td class="py-3 px-4 text-sm text-gray-600">${project.startDate}</td>
        <td class="py-3 px-4 text-sm text-gray-600">${project.endDate}</td>
        <td class="py-3 px-4 text-sm text-gray-600">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: ${project.progress}%;"></div>
          </div>
          <div class="text-xs text-gray-500 mt-1">${project.progress}% Complete</div>
        </td>
        <td class="py-3 px-4 text-center text-sm">
          <button class="text-blue-600 hover:underline" onclick="viewProjectDetails('${project.id}')">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="text-green-600 hover:underline ml-3" onclick="openEditProjectModal('${project.id}')">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="text-red-600 hover:underline ml-3" onclick="deleteProject('${project.id}')">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </td>
      `;
        tableBody.appendChild(row);
    });
    updatePaginationControls();
}
// Fungsi untuk memperbarui kontrol pagination
function updatePaginationControls() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = calculateTotalPages();
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === calculateTotalPages();
}

// Event listener untuk tombol sebelumnya
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadProjectList();
    }
});

// Event listener untuk tombol berikutnya
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < calculateTotalPages()) {
        currentPage++;
        loadProjectList();
    }
});
// Event listener untuk dropdown items per page
document.getElementById('projectsPerPage').addEventListener('change', (event) => {
    itemsPerPage = parseInt(event.target.value);
    currentPage = 1; // Reset ke halaman pertama saat jumlah per halaman diubah
    loadProjectList();
});

// Handle Dashboard Navigation DASHBOARD
document.getElementById('dashboard-link').addEventListener('click', function () {
    document.getElementById('dashboard-view').classList.remove('hidden');
    document.getElementById('project-list-view').classList.add('hidden');
    document.getElementById('capability-management-view').classList.add('hidden');
    document.getElementById('project-detail-view').classList.add('hidden');
    document.getElementById('test-execution-view').classList.add('hidden');
    loadDashboardData();
});

// Event listeners for navigation PROJECT MANAGEMENT
document.getElementById('project-management-link').addEventListener('click', function () {
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('capability-management-view').classList.add('hidden');
    document.getElementById('project-list-view').classList.remove('hidden');
    document.getElementById('project-detail-view').classList.add('hidden');
    document.getElementById('test-execution-view').classList.add('hidden');
    loadProjectList();
});
// Event listeners for navigation CAPABILITY MANAGEMENT
document.getElementById('capability-management-link').addEventListener('click', function () {
    document.getElementById('capability-management-view').classList.remove('hidden');
    document.getElementById('dashboard-view').classList.add('hidden');
    document.getElementById('project-list-view').classList.add('hidden');
    document.getElementById('project-detail-view').classList.add('hidden');
    document.getElementById('test-execution-view').classList.add('hidden');
    loadCapabilityList();
});

// Open and Close Modals
// Fungsi untuk Membuka Modal Create Project
function openCreateProjectModal() {
    document.getElementById('create-project-modal').classList.remove('hidden');
}

// Fungsi untuk Menutup Modal Create Project
function closeCreateProjectModal() {
    document.getElementById('create-project-modal').classList.add('hidden');
    document.getElementById('create-project-form').reset();
    currentCapabilities = [];
    currentMilestones = [];
    updateCapabilitiesList();
    updateMilestonesList();
}

// Fungsi untuk Menambah Capabilities
function addCapability() {
    const capability = document.getElementById('new-capability').value.trim();
    if (capability) {
        currentCapabilities.push(capability);
        updateCapabilitiesList();
        document.getElementById('new-capability').value = '';
    }
}

function updateCapabilitiesList() {
    const list = document.getElementById('capabilities-list');
    list.innerHTML = '';
    currentCapabilities.forEach((capability, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = capability;
        listItem.innerHTML += ` <button onclick="removeCapability(${index})" class="text-red-600 ml-2">Remove</button>`;
        list.appendChild(listItem);
    });
}

function removeCapability(index) {
    currentCapabilities.splice(index, 1);
    updateCapabilitiesList();
}

// Fungsi untuk Menambah Milestones
function addMilestone() {
    const milestone = document.getElementById('new-milestone').value.trim();
    if (milestone) {
        currentMilestones.push({
            name: milestone,
            useCases: [],
            deliverables: [],
            completed: false
        });
        updateMilestonesList();
        document.getElementById('new-milestone').value = '';
    }
}

function updateMilestonesList() {
    const list = document.getElementById('milestones-list');
    list.innerHTML = '';
    currentMilestones.forEach((milestone, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = milestone.name;
        listItem.innerHTML += ` <button onclick="removeMilestone(${index})" class="text-red-600 ml-2">Remove</button>`;
        list.appendChild(listItem);
    });
}

function removeMilestone(index) {
    currentMilestones.splice(index, 1);
    updateMilestonesList();
}

// Fungsi untuk Menyimpan Proyek Baru dan Update
document.getElementById('create-project-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const projectId = document.getElementById('project-id').value.trim();
    const existingProjectIndex = projects.findIndex(project => project.id === projectId);

    const projectData = {
        id: projectId,
        name: document.getElementById('project-name').value.trim(),
        description: document.getElementById('project-description').value.trim(),
        status: document.getElementById('project-status').value,
        startDate: document.getElementById('project-start-date').value,
        endDate: document.getElementById('project-end-date').value,
        capabilities: [...currentCapabilities],
        milestones: [...currentMilestones],
        progress: existingProjectIndex !== -1 ? projects[existingProjectIndex].progress : 0
    };

    if (existingProjectIndex !== -1) {
        // Update existing project
        projects[existingProjectIndex] = projectData;
        showToast('Project updated successfully!');
    } else {
        // Create new project
        projects.push(projectData);
        showToast('Project created successfully!');
    }

    saveAndUpdateProjects();
    closeCreateProjectModal();
});

function saveAndUpdateProjects() {
    saveProjectsToLocalStorage();
    loadProjectList();
}

function loadDashboardData() {
    document.getElementById('dashboard-view').classList.remove('hidden');
    // Summary Data
    const totalProjects = projects.length;
    const completedProjects = projects.filter(project => project.status === 'Completed').length;
    const ongoingProjects = projects.filter(project => project.status === 'In Progress').length;
    const teamMembers = 32; // Example static value, you can replace this with dynamic data

    // Update Summary Cards
    document.querySelector('.summary-total-projects').textContent = totalProjects;
    document.querySelector('.summary-completed-projects').textContent = completedProjects;
    document.querySelector('.summary-ongoing-projects').textContent = ongoingProjects;
    document.querySelector('.summary-team-members').textContent = teamMembers;
    // Populate Recent Projects Table
    const recentProjectList = document.getElementById('recent-project-list');
    recentProjectList.innerHTML = '';
    projects.forEach(project => {
        const row = document.createElement('tr');
        row.classList.add('border-b');
        row.innerHTML = `
        <td class="p-2 text-sm">${project.id}</td>
        <td class="p-2 text-sm">${project.name}</td>
        <td class="p-2 text-sm">${project.capabilities.length}</td>
        <td class="p-2 text-sm">${project.milestones.length}</td>
        <td class="p-2 text-sm"><span class="text-${project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'yellow' : 'blue'}-500 font-medium">${project.status}</span></td>
          <td class="p-2 text-sm">
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-${project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'yellow' : 'blue'}-500 h-2 rounded-full" style="width: ${project.progress}%"></div>
              </div>
            </div>
          </td>
          <td class="p-2 text-sm">${project.endDate}</td>
      `;
        recentProjectList.appendChild(row);
    });
}

// Function to get the appropriate status class for the badge
function getStatusClass(status) {
    switch (status) {
        case 'In Progress':
            return 'bg-blue-100 text-blue-800';
        case 'Completed':
            return 'bg-green-100 text-green-800';
        case 'Planning':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function openEditProjectModal(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.name;
        document.getElementById('project-description').value = project.description;
        document.getElementById('project-status').value = project.status;
        document.getElementById('project-start-date').value = project.startDate;
        document.getElementById('project-end-date').value = project.endDate;
        document.getElementById('create-project-modal').classList.remove('hidden');
        currentCapabilities = project.capabilities;
        currentMilestones = project.milestones;
        updateCapabilitiesList();
        updateMilestonesList();
    }
}



// load capability management
function loadCapabilityList(){
    const capabilities = [
      {
          id: 1,
          name: "User Management",
          description: "Manage user authentication, profiles, and access control.",
          features: [
              {
                  id: 1,
                  name: "User Registration",
                  deliverables: [
                      { id: 1, name: "Registration Form", description: "User sign-up with validation", status: "Completed" },
                      { id: 2, name: "Email Verification", description: "verify after user registration", status: "In Progress" }
                  ]
              },
              {
                  id: 2,
                  name: "User Login",
                  deliverables: [
                      { id: 3, name: "Login Screen", description: "UI sign in / sign up",status: "Completed" },
                      { id: 4, name: "Password Reset", description: "if forget",status: "Pending" }
                  ]
              }
          ]
      },
      {
          id: 2,
          name: "Product Catalog",
          description: "Manage product listings, categories, and inventories.",
          features: [
              {
                  id: 3,
                  name: "Product Listing",
                  deliverables: [
                      { id: 5, name: "Product Database Setup", description: "setting multiple databases",status: "Completed" },
                      { id: 6, name: "Product Filter", description: "search products by category, id, name",status: "In Progress" }
                  ]
              },
              {
                  id: 4,
                  name: "Category Management",
                  deliverables: [
                      { id: 7, name: "Category Tree Structure", description: "UI tree",status: "Pending" },
                      { id: 8, name: "Category Navigation", description: "short cut to partifcular product",status: "Pending" }
                  ]
              }
          ]
      }
    ];
    
    const tableBody = document.getElementById('capability-list-tbody');
  
      function renderTableByCap() {
        const tableBody = document.getElementById('capability-list-tbody');
        tableBody.innerHTML = '';
    
        capabilities.forEach(capability => {
            const featureCount = capability.features.length; // Jumlah fitur dalam capability ini
            let firstRow = true;
    
            capability.features.forEach(feature => {
                feature.deliverables.forEach((deliverable, index) => {
                    const deliverableRow = document.createElement('tr');
    
                    if (firstRow && index === 0) {
                        deliverableRow.innerHTML += `
                            <td class="py-2 px-4 text-sm border-b feature-column" rowspan="${capability.features.reduce((acc, feature) => acc + feature.deliverables.length, 0)}">
                                <i class="fas fa-cogs text-blue-500 icon-feature mr-2 "></i>
                                <strong>${capability.name}</strong><br>
                                <span class="text-gray-600 text-sm">${capability.description}</span>
                            </td>
                        `;
                        firstRow = false;
                    }
    
                    deliverableRow.innerHTML += `
                        <td class="py-2 px-4 text-sm border-b feature-column">
                            ${index === 0 ? `<i class="fas fa-clipboard-list text-green-500 icon-feature mr-2"></i>${feature.name}` : ''}
                        </td>
                        <td class="py-2 px-4 text-sm border-b deliverable-column">
                            <i class="fas fa-check-circle text-yellow-500 icon-deliverable mr-2"></i>
                            <span class="">${deliverable.name}</span>
                        </td>
                        <td class="py-2 px-4 text-sm border-b description-column">
                            ${deliverable.description}
                        </td>
                    `;
    
                    tableBody.appendChild(deliverableRow);
                });
            });
        });
    }
  
      // Initial rendering of the table
      renderTableByCap();
  }






//<!-- Toast Notification -->
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000); // Durasi tampil toast, dalam milidetik
}

function showQATab(event, sectionId) {
    event.preventDefault();
    // Remove 'active' class from all tabs
    document.querySelectorAll('.qa-tab-menu a').forEach(tab => tab.classList.remove('active'));
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));

    // Add 'active' class to the clicked tab and display corresponding section
    event.currentTarget.classList.add('active');
    document.getElementById(sectionId).classList.remove('hidden');
}
// Load the project list on page load
loadDashboardData(); 
