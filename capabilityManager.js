// Initialize data in localStorage if not present
function initializeData() {
    const data = localStorage.getItem('capabilityData');
    if (!data) {
        const initialData = {
            capabilities: [
                // Add initial capabilities data here if needed
                {
                    id: "cap-001",
                    name: "User Management",
                    description: "Manage user accounts, profiles, and roles.",
                    features: [
                        {
                            id: "feat-001",
                            name: "User Registration",
                            deliverables: [
                                {
                                    id: "del-001",
                                    name: "Registration Form",
                                    description: "A form for users to register.",
                                    backend: true,
                                    frontend: false
                                },
                                {
                                    id: "del-002",
                                    name: "Email Verification",
                                    description: "A process to verify user email.",
                                    backend: true,
                                    frontend: false
                                }
                            ]
                        },
                        {
                            id: "feat-002",
                            name: "User Login",
                            deliverables: [
                                {
                                    id: "del-003",
                                    name: "Login Page",
                                    description: "Page for users to log in.",
                                    backend: true,
                                    frontend: true
                                }
                            ]
                        }
                    ]
                },
                {
                    id: "cap-002",
                    name: "Product Management",
                    description: "Manage products, categories, and inventories.",
                    features: [
                        {
                            id: "feat-003",
                            name: "Product Listing",
                            deliverables: [
                                {
                                    id: "del-004",
                                    name: "Product List Page",
                                    description: "Page showing a list of products.",
                                    backend: true,
                                    frontend: true
                                }
                            ]
                        },
                        {
                            id: "feat-004",
                            name: "Inventory Management",
                            deliverables: [
                                {
                                    id: "del-005",
                                    name: "Inventory Dashboard",
                                    description: "Dashboard for managing inventory.",
                                    backend: true,
                                    frontend: false
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        localStorage.setItem('capabilityData', JSON.stringify(initialData));
    }
}

// Function to save a new capability
function saveCapability(capability) {
    const data = JSON.parse(localStorage.getItem('capabilityData'));
    data.capabilities.push(capability);
    localStorage.setItem('capabilityData', JSON.stringify(data));
}

// Function to get all capabilities
function getCapabilities() {
    const data = JSON.parse(localStorage.getItem('capabilityData'));
    return data.capabilities;
}

// Function to get a capability by ID
function getCapabilityById(id) {
    const data = JSON.parse(localStorage.getItem('capabilityData'));
    return data.capabilities.find(cap => cap.id === id);
}

// Function to update an existing capability
function updateCapability(updatedCapability) {
    const data = JSON.parse(localStorage.getItem('capabilityData'));
    const index = data.capabilities.findIndex(cap => cap.id === updatedCapability.id);
    if (index !== -1) {
        data.capabilities[index] = updatedCapability;
        localStorage.setItem('capabilityData', JSON.stringify(data));
    }
}

// Function to delete a capability by ID
function deleteCapability(id) {
    const data = JSON.parse(localStorage.getItem('capabilityData'));
    data.capabilities = data.capabilities.filter(cap => cap.id !== id);
    localStorage.setItem('capabilityData', JSON.stringify(data));
}

// Example usage:
 initializeData(); // Call this once at the start
// saveCapability(newCapability); // Save a new capability
// console.log(getCapabilities()); // Get all capabilities
// updateCapability(updatedCapability); // Update an existing capability
// deleteCapability("cap-002"); // Delete a capability by ID
