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
  
  // Load project list into the UI
  function loadProjectList() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = ''; // Clear previous items
  
    projects.forEach(project => {
      const capabilityCount = Array.isArray(project.capabilities) ? project.capabilities.length : 0;
      const milestoneCount = project.milestones.length;
      const progress = calculateProgress(project.milestones);
  
      const listItem = document.createElement('li');
      listItem.className = 'bg-white p-4 rounded-lg shadow-md';
  
      listItem.innerHTML = `
        <h3 class="text-lg font-bold">${project.name} (ID: ${project.id})</h3>
        <p class="text-sm text-gray-600">${project.description}</p>
        <p class="mt-2 text-sm text-gray-600">Status: <strong>${project.status}</strong></p>
        <p class="text-sm text-gray-600">Start Date: <strong>${project.startDate}</strong></p>
        <p class="text-sm text-gray-600">End Date: <strong>${project.endDate}</strong></p>
        <p class="text-sm text-gray-600">Capabilities: <strong>${capabilityCount}</strong></p>
        <p class="text-sm text-gray-600">Milestones: <strong>${milestoneCount}</strong></p>
        <p class="text-sm text-gray-600">Progress: <strong>${progress}%</strong></p>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${progress}%;"></div>
        </div>
        <button class="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onclick="viewProjectDetails('${project.id}')">View Details</button>
        <button class="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" onclick="deleteProject('${project.id}')">Delete</button>
      `;
  
      projectList.appendChild(listItem);
    });
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
    projects = projects.filter(project => project.id !== projectId);
    saveAndUpdateProjects();
  }
  
  // Manage Capabilities
  function openCapabilityModal() {
    document.getElementById('capabilities-modal').classList.remove('hidden');
  }
  
  function closeCapabilityModal() {
    document.getElementById('capabilities-modal').classList.add('hidden');
    document.getElementById('capability-name').value = '';
  }
  
  document.getElementById('capability-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const capabilityName = document.getElementById('capability-name').value;
    if (capabilityName) {
      const activeProject = projects.find(project => project.id === currentProjectId);
      activeProject.capabilities.push(capabilityName);
      saveAndUpdateProjects();
      closeCapabilityModal();
    }
  });
  
  // Manage Milestones
  function openMilestoneModal() {
    document.getElementById('milestone-modal').classList.remove('hidden');
  }
  
  function closeMilestoneModal() {
    document.getElementById('milestone-modal').classList.add('hidden');
    document.getElementById('milestone-name').value = '';
  }
  
  document.getElementById('milestone-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const milestoneName = document.getElementById('milestone-name').value;
    if (milestoneName) {
      const activeProject = projects.find(project => project.id === currentProjectId);
      activeProject.milestones.push({
        name: milestoneName,
        useCases: [],
        deliverables: [],
        completed: false
      });
      saveAndUpdateProjects();
      closeMilestoneModal();
    }
  });
  
  // Manage Deliverables
  function openDeliverableModal() {
    document.getElementById('deliverable-modal').classList.remove('hidden');
  }
  
    function closeDeliverableModal() {
        document.getElementById('deliverable-modal').classList.add('hidden');
        document.getElementById('deliverable-name').value = '';
        document.getElementById('deliverable-details').value = '';
      }
      
      document.getElementById('deliverable-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const deliverableName = document.getElementById('deliverable-name').value;
        const deliverableDetails = document.getElementById('deliverable-details').value;
        if (deliverableName && deliverableDetails) {
          const activeProject = projects.find(project => project.id === currentProjectId);
          const activeMilestone = activeProject.milestones.find(milestone => milestone.name === currentMilestoneName);
          activeMilestone.deliverables.push({
            name: deliverableName,
            details: deliverableDetails
          });
          saveAndUpdateProjects();
          closeDeliverableModal();
        }
      });
      
      // Event listeners for navigation
      document.getElementById('project-management-link').addEventListener('click', function () {
        document.getElementById('dashboard-view').classList.add('hidden');
        document.getElementById('project-list-view').classList.remove('hidden');
        document.getElementById('project-detail-view').classList.add('hidden');
        document.getElementById('test-execution-view').classList.add('hidden');
      });
      
      document.getElementById('milestone-management-link').addEventListener('click', openMilestoneModal);
      
      document.getElementById('test-execution-link').addEventListener('click', function () {
        document.getElementById('project-list-view').classList.add('hidden');
        document.getElementById('project-detail-view').classList.add('hidden');
        document.getElementById('test-execution-view').classList.remove('hidden');
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
  
  // Fungsi untuk Menyimpan Proyek Baru
  document.getElementById('create-project-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const newProject = {
      id: document.getElementById('project-id').value.trim(),
      name: document.getElementById('project-name').value.trim(),
      description: document.getElementById('project-description').value.trim(),
      status: document.getElementById('project-status').value,
      startDate: document.getElementById('project-start-date').value,
      endDate: document.getElementById('project-end-date').value,
      capabilities: [...currentCapabilities],
      milestones: [...currentMilestones]
    };
  
    projects.push(newProject);
    saveAndUpdateProjects();
    closeCreateProjectModal();
  });
  
  function saveAndUpdateProjects() {
    saveProjectsToLocalStorage();
    loadProjectList();
  }

      // Handle Dashboard Navigation
      document.getElementById('dashboard-link').addEventListener('click', function () {
        document.getElementById('dashboard-view').classList.remove('hidden');
        document.getElementById('project-list-view').classList.add('hidden');
        document.getElementById('project-detail-view').classList.add('hidden');
        document.getElementById('test-execution-view').classList.add('hidden');
        loadDashboardData();
      });
      
      function loadDashboardData(){
        const recentProjects = [
            {
              name: 'Website Redesign',
              status: 'Completed',
              progress: 100,
              deadline: 'July 20, 2024'
            },
            {
              name: 'Mobile App Development',
              status: 'In Progress',
              progress: 70,
              deadline: 'August 15, 2024'
            },
            {
              name: 'Marketing Campaign',
              status: 'Planning',
              progress: 30,
              deadline: 'September 10, 2024'
            }
          ];    
    // Populate Recent Projects Table
      const recentProjectList = document.getElementById('recent-project-list');
      recentProjectList.innerHTML = '';
      recentProjects.forEach(project =>{
        const row = document.createElement('tr');
      row.classList.add('border-b');
      row.innerHTML = `
      <td class="p-2 text-sm">${project.name}</td>
<td class="p-2 text-sm"><span class="text-${project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'yellow' : 'blue'}-500 font-medium">${project.status}</span></td>
          <td class="p-2 text-sm">
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-${project.status === 'Completed' ? 'green' : project.status === 'In Progress' ? 'yellow' : 'blue'}-500 h-2 rounded-full" style="width: ${project.progress}%"></div>
              </div>
            </div>
          </td>
          <td class="p-2 text-sm">${project.deadline}</td>
      `;
      recentProjectList.appendChild(row); 
      });
      
       
      }


      // Load the project list on page load
      loadProjectList();  
