import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  client: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  employees: {
    _id: string;
    name: string;
    email: string;
    department: string;
  }[];
  budget: number;
  startDate: string;
  deadline: string;
  status: string;
  progress: number;
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  _id: string;
  project: string;
  client: string;
  amount: number;
  tax: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'paypal';
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  notes: string;
  status: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  message: string;
  file?: string;
  seen: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  user: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    role: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
  user: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  // const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    client: "",
    employees: [] as string[],
    budget: "",
    startDate: "",
    deadline: "",
    notes: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    phone: "",
    department: "",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    project: "",
    client: "",
    amount: "",
    tax: "",
    paymentMethod: "cash" as 'cash' | 'bank_transfer' | 'credit_card' | 'paypal',
    dueDate: "",
    items: [],
    notes: "",
  });

  const [qrData, setQrData] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch clients data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('https://ibos-system-backend.onrender.com/api/users?role=client', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.users) {
          setClients(data.data.users);
        } else {
          console.error('Invalid API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Fallback to empty array if API fails
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('https://ibos-system-backend.onrender.com/api/users?role=employee', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.users) {
          setEmployees(data.data.users);
        } else {
          console.error('Invalid API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        // Fallback to empty array if API fails
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch projects data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('https://ibos-system-backend.onrender.com/api/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.projects) {
          setProjects(data.data.projects);
        } else {
          console.error('Invalid API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to empty array if API fails
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch invoices data from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('https://ibos-system-backend.onrender.com/api/invoices', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.invoices) {
          setInvoices(data.data.invoices);
        } else {
          console.error('Invalid API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
        // Fallback to empty array if API fails
        setInvoices([]);
      }
    };

    fetchInvoices();
  }, []);

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch('https://ibos-system-backend.onrender.com/api/messages/conversations', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("messages: -> " , data)
        if (data.success && data.data && data.data.conversations) {
          setConversations(data.data.conversations);
        } else {
          console.error('Invalid API response structure:', data);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Fallback to empty array if API fails
        setConversations([]);
      }
    };

    fetchConversations();
  }, []);

  // // Mock data for other entities
  // useEffect(() => {
  //   setEvents([
  //     {
  //       _id: "1",
  //       sender: "1",
  //       receiver: "admin",
  //       content: "Project update needed",
  //       timestamp: "2024-02-05T10:00:00Z",
  //       type: "client",
  //     },
  //   ]);

  //   setEvents([
  //     {
  //       _id: "1",
  //       title: "New Client Registered",
  //       description: "John Doe joined the platform",
  //       type: "client",
  //       timestamp: "2024-02-05T09:00:00Z",
  //       user: "John Doe",
  //     },
  //   ]);
  // }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "clients", label: "View All Clients", icon: "👥" },
    { id: "employees", label: "View All Employees", icon: "👨‍💼" },
    { id: "create-user", label: "Create User", icon: "👨" },
    { id: "create-project", label: "Create Project", icon: "📁" },
    { id: "assign-employees", label: "Assign Employees", icon: "🔧" },
    { id: "invoices", label: "Generate Invoices", icon: "🧾" },
    { id: "qr-codes", label: "QR Codes", icon: "📱" },
    { id: "analytics", label: "Analytics Dashboard", icon: "📈" },
    { id: "chat", label: "Chat", icon: "💬" },
    // { id: "events", label: "Event Feed", icon: "📢" },
    { id: "reports", label: "Export Reports", icon: "📄" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h3 className="text-sm lg:text-lg font-semibold text-white mb-2">Total Clients</h3>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#7F77DD" }}>{clients.length}</p>
            </div>
            <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h3 className="text-sm lg:text-lg font-semibold text-white mb-2">Total Employees</h3>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#1D9E75" }}>{employees.length}</p>
            </div>
            <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h3 className="text-sm lg:text-lg font-semibold text-white mb-2">Active Projects</h3>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#F59E0B" }}>{projects.length}</p>
            </div>
            <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h3 className="text-sm lg:text-lg font-semibold text-white mb-2">Pending Invoices</h3>
              <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#E24B4A" }}>{invoices.filter(inv => inv.status === "Pending").length}</p>
            </div>
          </div>
        );

      case "clients":
        return (
          <div className="rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h2 className="text-xl font-semibold text-white">All Clients</h2>
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: "rgba(255,255,255,0.02)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {clients.map((client) => (
                    <tr key={client._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{client.department}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {clients.map((client) => (
                <div key={client._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Name</span>
                      <p className="text-sm text-white font-medium">{client.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Email</span>
                      <p className="text-sm text-white">{client.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Phone</span>
                      <p className="text-sm text-white">{client.phone}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Department</span>
                      <p className="text-sm text-white">{client.department}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "employees":
        return (
          <div className="rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h2 className="text-xl font-semibold text-white">All Employees</h2>
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: "rgba(255,255,255,0.02)" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{employee.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{employee.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{new Date(employee.createdAt).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {employees.map((employee) => (
                <div key={employee._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Name</span>
                      <p className="text-sm text-white font-medium">{employee.name}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Email</span>
                      <p className="text-sm text-white">{employee.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Phone</span>
                      <p className="text-sm text-white">{employee.phone}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Department</span>
                      <p className="text-sm text-white">{employee.department}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Role</span>
                      <p className="text-sm text-white">{employee.role}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Joined</span>
                      <p className="text-sm text-white">{new Date(employee.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "create-user":
        return (
          <div className="rounded-xl p-4 lg:p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Create New User</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="Enter password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                >
                  <option className="text-black" value="employee">Employee</option>
                  <option className="text-black" value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Department
                </label>
                <input
                  type="text"
                  value={userForm.department}
                  onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  placeholder="Enter department"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    
                    if (!token) {
                      console.error('No access token found');
                      showToast('Please login to create users', 'error');
                      return;
                    }

                    const userData = {
                      name: userForm.name,
                      email: userForm.email,
                      password: userForm.password,
                      role: userForm.role,
                      phone: userForm.phone,
                      department: userForm.department,
                    };

                    const response = await fetch('https://ibos-system-backend.onrender.com/api/users/create', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(userData)
                    });

                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    if (data.success) {
                      showToast('User created successfully!', 'success');
                      // Reset form
                      setUserForm({
                        name: "",
                        email: "",
                        password: "",
                        role: "employee",
                        phone: "",
                        department: "",
                      });
                      // Refresh employees list if it's an employee
                      if (userData.role === 'employee') {
                        // Re-fetch employees
                        const employeesResponse = await fetch('https://ibos-system-backend.onrender.com/api/users/employees', {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        if (employeesResponse.ok) {
                          const employeesData = await employeesResponse.json();
                          if (employeesData.success && employeesData.data) {
                            setEmployees(employeesData.data);
                          }
                        }
                      }
                    } else {
                      showToast(data.message || 'Failed to create user', 'error');
                    }
                  } catch (error) {
                    console.error('Error creating user:', error);
                    showToast('Failed to create user. Please try again.', 'error');
                  }
                }}
                className="px-6 py-2 rounded-lg text-white font-medium"
                style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
              >
                Create User
              </button>
            </div>
          </div>
        );
        
      case "create-project":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Create New Project</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Project Title</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter project title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Client</label>
                  <select
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option className="text-black" value="">Select Client</option>
                    {clients.map((client) => (
                      <option className="text-black" key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Budget</label>
                  <input
                    type="number"
                    value={projectForm.budget}
                    onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    placeholder="Enter budget"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Start Date</label>
                  <input
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Deadline</label>
                  <input
                    type="date"
                    value={projectForm.deadline}
                    onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Assign Employees</label>
                <div className="space-y-2">
                  {employees.map((employee) => (
                    <label key={employee._id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={projectForm.employees.includes(employee._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProjectForm({ ...projectForm, employees: [...projectForm.employees, employee._id] });
                          } else {
                            setProjectForm({ ...projectForm, employees: projectForm.employees.filter(id => id !== employee._id) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-white">{employee.name} - {employee.department}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Notes</label>
                <textarea
                  value={projectForm.notes}
                  onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter project notes"
                  rows={3}
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    
                    if (!token) {
                      console.error('No access token found');
                      return;
                    }

                    const projectData = {
                      title: projectForm.title,
                      description: projectForm.description,
                      client: projectForm.client,
                      employees: projectForm.employees,
                      budget: parseFloat(projectForm.budget),
                      startDate: projectForm.startDate,
                      deadline: projectForm.deadline,
                      notes: projectForm.notes,
                    };
                    console.log(projectData);
                    const response = await fetch('https://ibos-system-backend.onrender.com/api/projects', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(projectData)
                    });

                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    if (data.success) {
                      // Add new project to local state
                      // Find client object from clients array
                      const clientObj = clients.find(c => c._id === projectForm.client);
                      const newProject = {
                        _id: data.data._id,
                        title: projectForm.title,
                        description: projectForm.description,
                        client: clientObj ? {
                          _id: clientObj._id,
                          name: clientObj.name,
                          email: clientObj.email,
                          phone: clientObj.phone
                        } : {
                          _id: "",
                          name: "",
                          email: "",
                          phone: ""
                        },
                        employees: employees.filter(emp => projectForm.employees.includes(emp._id)),
                        budget: parseFloat(projectForm.budget),
                        startDate: projectForm.startDate,
                        deadline: projectForm.deadline,
                        notes: projectForm.notes,
                        status: "Active",
                        progress: 0,
                        attachments: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                      setProjects([...projects, newProject]);
                      
                      // Reset form
                      setProjectForm({ 
                        title: "", 
                        description: "", 
                        client: "", 
                        employees: [], 
                        budget: "", 
                        startDate: "", 
                        deadline: "", 
                        notes: "" 
                      });
                      
                      showToast('Project created successfully!', 'success');
                    } else {
                      console.error('Project creation failed:', data);
                      showToast('Failed to create project', 'error');
                    }
                  } catch (error) {
                    console.error('Error creating project:', error);
                    showToast('Error creating project', 'error');
                  }
                }}
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
              >
                Create Project
              </button>
            </form>
          </div>
        );

      case "assign-employees":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Assign Employees to Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => {
                // Get current employee IDs from project
                const currentEmployeeIds = project.employees.map(emp => emp._id);
                
                return (
                  <div key={project._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white mb-2">{project.title}</h3>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Client: {project.client.name} | Budget: ${project.budget}
                      </p>
                    </div>
                    <div className="space-y-2 mb-4">
                      {employees.map((employee) => (
                        <label key={employee._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={currentEmployeeIds.includes(employee._id)}
                            onChange={(e) => {
                              const updatedEmployeeIds = e.target.checked
                                ? [...currentEmployeeIds, employee._id]
                                : currentEmployeeIds.filter(id => id !== employee._id);
                              
                              // Convert IDs back to employee objects
                              const updatedEmployees = employees.filter(emp => 
                                updatedEmployeeIds.includes(emp._id)
                              );
                              
                              // Update only the current project in state
                              const updatedProjects = projects.map(p => {
                                if (p._id === project._id) {
                                  return {
                                    ...p,
                                    employees: updatedEmployees
                                  };
                                }
                                return p;
                              });
                              setProjects(updatedProjects);
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-white">{employee.name} - {employee.department}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('accessToken');
                          
                          if (!token) {
                            console.error('No access token found');
                            return;
                          }

                          // Get current project state
                          const currentProject = projects.find(p => p._id === project._id);
                          if (!currentProject) return;

                          const updateData = {
                            title: currentProject.title,
                            description: currentProject.description,
                            client: currentProject.client._id,
                            employees: currentProject.employees.map(emp => emp._id),
                            budget: currentProject.budget,
                            startDate: currentProject.startDate,
                            deadline: currentProject.deadline,
                            notes: currentProject.notes,
                          };

                          const response = await fetch(`https://ibos-system-backend.onrender.com/api/projects/${project._id}/`, {
                            method: 'PUT',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateData)
                          });

                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }

                          const data = await response.json();
                          
                          if (data.success) {
                            showToast('Employee assignments updated successfully!', 'success');
                            // Refresh projects data
                            const fetchProjects = async () => {
                              try {
                                const token = localStorage.getItem('accessToken');
                                if (!token) return;
                                
                                const response = await fetch('https://ibos-system-backend.onrender.com/api/projects', {
                                  method: 'GET',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  }
                                });

                                if (response.ok) {
                                  const data = await response.json();
                                  if (data.success && data.data && data.data.projects) {
                                    setProjects(data.data.projects);
                                  }
                                }
                              } catch (error) {
                                console.error('Error refreshing projects:', error);
                              }
                            };
                            fetchProjects();
                          } else {
                            console.error('Update failed:', data);
                            showToast('Failed to update employee assignments', 'error');
                          }
                        } catch (error) {
                          console.error('Error updating project:', error);
                          showToast('Error updating employee assignments', 'error');
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                      style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                    >
                      Update Assignments
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "invoices":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Generate Invoice</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Client</label>
                  <select
                    value={invoiceForm.client}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option className="text-black" value="">Select Client</option>
                    {clients.map((client) => (
                      <option className="text-black" key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Project</label>
                  <select
                    value={invoiceForm.project}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, project: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option className="text-black" value="">Select Project</option>
                    {projects.map((project) => (
                      <option className="text-black" key={project._id} value={project._id}>{project.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Amount</label>
                  <input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Tax</label>
                  <input
                    type="number"
                    value={invoiceForm.tax}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, tax: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                    placeholder="Enter tax amount"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Payment Method</label>
                  <select
                    value={invoiceForm.paymentMethod}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentMethod: e.target.value as 'cash' | 'bank_transfer' | 'credit_card' | 'paypal' })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <option className="text-black" value="">Select Payment Method</option>
                    <option className="text-black" value="cash">Cash</option>
                    <option className="text-black" value="bank_transfer">Bank Transfer</option>
                    <option className="text-black" value="credit_card">Credit Card</option>
                    <option className="text-black" value="paypal">PayPal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Due Date</label>
                  <input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Invoice Items</label>
                <div className="space-y-2">
                  {invoiceForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updatedItems = [...invoiceForm.items];
                          updatedItems[index] = { ...item, description: e.target.value };
                          setInvoiceForm({ ...invoiceForm, items: updatedItems });
                        }}
                        className="px-4 py-2 rounded-lg text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Item description"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...invoiceForm.items];
                          const quantity = parseInt(e.target.value) || 0;
                          updatedItems[index] = { 
                            ...item, 
                            quantity: quantity,
                            total: quantity * item.unitPrice
                          };
                          setInvoiceForm({ ...invoiceForm, items: updatedItems });
                        }}
                        className="px-4 py-2 rounded-lg text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Quantity"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updatedItems = [...invoiceForm.items];
                          const unitPrice = parseFloat(e.target.value) || 0;
                          updatedItems[index] = { 
                            ...item, 
                            unitPrice: unitPrice,
                            total: item.quantity * unitPrice
                          };
                          setInvoiceForm({ ...invoiceForm, items: updatedItems });
                        }}
                        className="px-4 py-2 rounded-lg text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Unit Price"
                      />
                      <input
                        type="number"
                        value={item.total}
                        readOnly
                        className="px-4 py-2 rounded-lg text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Total"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updatedItems = [...invoiceForm.items, {
                      description: "",
                      quantity: 1,
                      unitPrice: 0,
                      total: 0,
                    }];
                    setInvoiceForm({ ...invoiceForm, items: updatedItems });
                  }}
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm"
                  style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                >
                  Add Item
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Notes</label>
                <textarea
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter invoice notes"
                  rows={4}
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('accessToken');
                    
                    if (!token) {
                      console.error('No access token found');
                      return;
                    }

                    const invoiceData = {
                      project: invoiceForm.project,
                      client: invoiceForm.client,
                      amount: parseFloat(invoiceForm.amount),
                      tax: parseFloat(invoiceForm.tax),
                      paymentMethod: invoiceForm.paymentMethod,
                      dueDate: invoiceForm.dueDate,
                      items: invoiceForm.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total
                      })),
                      notes: invoiceForm.notes,
                    };
                    console.log(invoiceData)
                    const response = await fetch('https://ibos-system-backend.onrender.com/api/invoices', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(invoiceData)
                    });

                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    if (data.success) {
                      showToast('Invoice created successfully!', 'success');
                      // Add new invoice to local state
                      const newInvoice = {
                        _id: data.data._id,
                        project: invoiceForm.project,
                        client: invoiceForm.client,
                        amount: parseFloat(invoiceForm.amount),
                        tax: parseFloat(invoiceForm.tax),
                        paymentMethod: invoiceForm.paymentMethod,
                        dueDate: invoiceForm.dueDate,
                        items: invoiceForm.items,
                        notes: invoiceForm.notes,
                        status: "Pending",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      };
                      setInvoices([...invoices, newInvoice]);
                      
                      // Reset form
                      setInvoiceForm({ 
                        project: "", 
                        client: "", 
                        amount: "", 
                        tax: "", 
                        paymentMethod: "cash" as 'cash' | 'bank_transfer' | 'credit_card' | 'paypal', 
                        dueDate: "", 
                        items: [], 
                        notes: "" 
                      });
                    } else {
                      console.error('Invoice creation failed:', data);
                      showToast('Failed to create invoice', 'error');
                    }
                  } catch (error) {
                    console.error('Error creating invoice:', error);
                    showToast('Error creating invoice', 'error');
                  }
                }}
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
              >
                Generate Invoice
              </button>
            </form>
          </div>
        );

      case "qr-codes":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Invoice QR Codes</h2>
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white" style={{ color: "rgba(255,255,255,0.7)" }}>
                    No invoices found. Create invoices to see their QR codes.
                  </p>
                </div>
              ) : (
                invoices.map((invoice) => (
                  <div key={invoice._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-2">Invoice #{invoices.indexOf(invoice) + 1}</h3>
                        <div className="space-y-1">
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            Amount: <span className="font-medium text-white">${invoice.amount}</span>
                          </p>
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            Due Date: <span className="font-medium text-white">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                          </p>
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            Status: <span className="font-medium text-white">{invoice.status}</span>
                          </p>
                          <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            Payment Method: <span className="font-medium text-white">{invoice.paymentMethod}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        {invoice.qrCode ? (
                          <div className="text-center">
                            <div className="w-32 h-32 bg-white rounded-lg p-2 mb-2">
                              <img 
                                src={invoice.qrCode} 
                                alt="QR Code" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-xs text-white" style={{ color: "rgba(255,255,255,0.7)" }}>
                              Scan to pay
                            </p>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-center text-white" style={{ color: "rgba(255,255,255,0.7)" }}>
                              No QR Code Available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Total Revenue</span>
                    <span className="text-sm font-medium text-white">
                      ${invoices.reduce((total, invoice) => total + invoice.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Active</span>
                    <span className="text-sm font-medium" style={{ color: "#1D9E75" }}>
                      {projects.filter(p => p.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Completed</span>
                    <span className="text-sm font-medium" style={{ color: "#7F77DD" }}>
                      {projects.filter(p => p.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>On Hold</span>
                    <span className="text-sm font-medium" style={{ color: "#F59E0B" }}>
                      {projects.filter(p => p.status === 'on-hold').length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-lg font-semibold text-white mb-4">Team Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Total Employees</span>
                    <span className="text-sm font-medium text-white">{employees.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Active Projects</span>
                    <span className="text-sm font-medium" style={{ color: "#1D9E75" }}>
                      {projects.reduce((acc, p) => acc + p.employees.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Total Budget</span>
                    <span className="text-sm font-medium text-white">
                      ${projects.reduce((total, p) => total + p.budget, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <div className="p-4 lg:p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h2 className="text-lg lg:text-xl font-semibold text-white">Chat</h2>
            </div>
            <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
              {/* Conversations Sidebar */}
              <div className="w-full lg:w-1/3 border-b lg:border-r lg:border-b-0 overflow-hidden flex flex-col" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="p-3 lg:p-4 flex-shrink-0">
                  <h3 className="text-xs lg:text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-3 lg:pb-4">
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                        <button
                          key={conversation.user._id}
                          onClick={() => {
                            setSelectedChat(conversation.user._id);
                            // Fetch conversation messages
                            const fetchConversation = async () => {
                              try {
                                const token = localStorage.getItem('accessToken');
                                
                                if (!token) {
                                  console.error('No access token found');
                                  return;
                                }

                                const response = await fetch(`https://ibos-system-backend.onrender.com/api/messages/conversation/${conversation.user._id}`, {
                                  method: 'GET',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  }
                                });

                                if (!response.ok) {
                                  throw new Error(`HTTP error! status: ${response.status}`);
                                }

                                const data = await response.json();
                                
                                if (data.success && data.data && data.data.messages) {
                                  setCurrentMessages(data.data.messages);
                                } else {
                                  console.error('Invalid API response structure:', data);
                                }
                              } catch (error) {
                                console.error('Error fetching conversation:', error);
                                setCurrentMessages([]);
                              }
                            };

                            fetchConversation();
                          }}
                          className="w-full text-left p-2 lg:p-3 rounded-lg transition-colors truncate"
                          style={{
                            background: selectedChat === conversation.user._id ? "rgba(127,119,221,0.2)" : "transparent",
                          }}
                        >
                          <div className="font-medium text-white text-xs lg:text-sm truncate">{conversation.user.name}</div>
                          <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{conversation.user.email}</div>
                          {conversation.unreadCount > 0 && (
                            <div className="mt-1">
                              <span className="inline-block px-2 py-1 text-xs rounded-full" style={{ background: "#1D9E75", color: "white" }}>
                                {conversation.unreadCount} unread
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    
                    {/* Available users to start new conversations */}
                    <div className="mt-4 lg:mt-6">
                      <p className="text-xs lg:text-sm mb-2 lg:mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Start a new conversation:
                      </p>
                      <div className="space-y-2">
                        {[...clients, ...employees].map((contact) => (
                          <button
                            key={contact._id}
                            onClick={() => {
                              setSelectedChat(contact._id);
                              // Initialize empty conversation for new chat
                              setCurrentMessages([]);
                            }}
                            className="w-full text-left p-2 lg:p-3 rounded-lg transition-colors truncate"
                            style={{
                              background: selectedChat === contact._id ? "rgba(127,119,221,0.2)" : "transparent",
                            }}
                          >
                            <div className="font-medium text-white text-xs lg:text-sm truncate">{contact.name}</div>
                            <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{contact.email}</div>
                            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                              {contact.role === 'client' ? 'Client' : 'Employee'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: "300px" }}>
                <div className="flex-1 overflow-y-auto p-3 lg:p-4" style={{ minHeight: "200px" }}>
                  {selectedChat ? (
                    <div className="space-y-2 lg:space-y-3">
                      {currentMessages.map((msg) => {
                        // Check if the message is sent by admin (current user)
                        const isAdminSender = msg.sender._id === localStorage.getItem('id');
                        return (
                          <div 
                            key={msg._id} 
                            className={`flex ${isAdminSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`p-2 lg:p-3 rounded-lg max-w-[85%] lg:max-w-[70%] break-words ${
                                isAdminSender 
                                  ? 'bg-gradient-to-r from-[#534AB7] to-[#1D9E75]' 
                                  : 'bg-[rgba(255,255,255,0.05)]'
                              }`}
                            >
                              <p className="text-xs lg:text-sm text-white break-words">{msg.message}</p>
                              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Select a conversation to start chatting
                    </div>
                  )}
                </div>
                <div className="p-3 lg:p-4 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)" }}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg text-white outline-none text-sm"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                      placeholder="Type a message..."
                      disabled={!selectedChat}
                    />
                    <button
                      onClick={async () => {
                        if (messageInput && selectedChat) {
                          try {
                            const token = localStorage.getItem('accessToken');
                            
                            if (!token) {
                              console.error('No access token found');
                              return;
                            }

                            const response = await fetch('https://ibos-system-backend.onrender.com/api/messages/send', {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                receiver: selectedChat,
                                message: messageInput
                              })
                            });

                            if (!response.ok) {
                              throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const data = await response.json();
                            
                            if (data.success) {
                              // Add the new message to current messages
                              setCurrentMessages([...currentMessages, data.data.message]);
                              setMessageInput("");
                              
                              // Refresh conversations to update last message
                              const fetchConversations = async () => {
                                try {
                                  const token = localStorage.getItem('accessToken');
                                  if (!token) return;
                                  
                                  const response = await fetch('https://ibos-system-backend.onrender.com/api/messages/conversations', {
                                    method: 'GET',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                      'Content-Type': 'application/json'
                                    }
                                  });

                                  if (response.ok) {
                                    const data = await response.json();
                                    if (data.success && data.data && data.data.conversations) {
                                      setConversations(data.data.conversations);
                                    }
                                  }
                                } catch (error) {
                                  console.error('Error refreshing conversations:', error);
                                }
                              };
                              fetchConversations();
                            } else {
                              console.error('Send message failed:', data);
                              showToast('Failed to send message', 'error');
                            }
                          } catch (error) {
                            console.error('Error sending message:', error);
                            showToast('Error sending message', 'error');
                          }
                        }
                      }}
                      className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium text-sm"
                      style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                      disabled={!selectedChat}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // case "events":
      //   return (
      //     <div className="rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
      //       <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      //         <h2 className="text-xl font-semibold text-white">Event Feed</h2>
      //       </div>
      //       <div className="p-6">
      //         <div className="space-y-4">
      //           {events.map((event) => (
      //             <div key={event._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
      //               <div className="flex items-start gap-3">
      //                 <div className="w-2 h-2 rounded-full mt-2" style={{ background: event.type === "client" ? "#1D9E75" : "#7F77DD" }}></div>
      //                 <div className="flex-1">
      //                   <h3 className="font-medium text-white">{event.title}</h3>
      //                   <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{event.description}</p>
      //                   <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>{event.user} • {event.timestamp}</p>
      //                 </div>
      //               </div>
      //             </div>
      //           ))}
      //         </div>
      //       </div>
      //     </div>
      //   );

      case "reports":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Export Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Export clients report
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Name,Email,Phone,Department,Created At\n" +
                    clients.map(c => `${c.name},${c.email},${c.phone},${c.department},${c.createdAt}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "clients_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-4 rounded-lg text-left transition-colors hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h3 className="font-medium text-white mb-2">Export Clients Report</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Download all clients data as CSV</p>
              </button>
              <button
                onClick={() => {
                  // Export employees report
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Name,Email,Phone,Department,Role,Created At\n" +
                    employees.map(e => `${e.name},${e.email},${e.phone},${e.department},${e.role},${e.createdAt}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "employees_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-4 rounded-lg text-left transition-colors hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h3 className="font-medium text-white mb-2">Export Employees Report</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Download all employees data as CSV</p>
              </button>
              <button
                onClick={() => {
                  // Export projects report
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Title,Description,Status,Start Date,Deadline\n" +
                    projects.map(p => `${p.title},${p.description},${p.status},${p.startDate},${p.deadline}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "projects_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-4 rounded-lg text-left transition-colors hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h3 className="font-medium text-white mb-2">Export Projects Report</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Download all projects data as CSV</p>
              </button>
              <button
                onClick={() => {
                  // Export invoices report
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Client,Project,Amount,Status,Due Date,Created At\n" +
                    invoices.map(i => {
                      // Handle both nested objects and string IDs
                      let clientName = 'Unknown';
                      let projectTitle = 'Unknown';
                      
                      if (typeof i.client === 'object' && i.client.name) {
                        clientName = i.client.name;
                      } else if (typeof i.client === 'string') {
                        const client = clients.find(c => c._id === i.client);
                        clientName = client?.name || 'Unknown';
                      }
                      
                      if (typeof i.project === 'object' && i.project.title) {
                        projectTitle = i.project.title;
                      } else if (typeof i.project === 'string') {
                        const project = projects.find(p => p._id === i.project);
                        projectTitle = project?.title || 'Unknown';
                      }
                      
                      return `${clientName},${projectTitle},${i.amount},${i.status},${i.dueDate},${i.createdAt}`;
                    }).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "invoices_report.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="p-4 rounded-lg text-left transition-colors hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <h3 className="font-medium text-white mb-2">Export Invoices Report</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Download all invoices data as CSV</p>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0c0c12" }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
        w-64 h-full lg:h-auto p-4 border-r
        flex flex-col overflow-hidden
      `} style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)",
                boxShadow: "0 0 20px rgba(83,74,183,0.4), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="4" rx="1" />
                <rect x="3" y="10" width="18" height="4" rx="1" />
                <rect x="3" y="17" width="18" height="4" rx="1" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              IBO<span style={{ color: "#7F77DD" }}>S</span>
            </span>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                // Close mobile menu after selection
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200"
              style={{
                background: activeSection === item.id ? "rgba(127,119,221,0.2)" : "transparent",
                color: activeSection === item.id ? "#fff" : "rgba(255,255,255,0.6)",
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              handleLogout();
              // Close mobile menu after logout
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-white">
            {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
          </h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block p-8 pb-4">
          <h1 className="text-2xl font-bold text-white">
            {menuItems.find(item => item.id === activeSection)?.label || "Dashboard"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Manage your IBOS system
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {renderContent()}
        </div>
        
        {/* Toast */}
        {toast && (
          <div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl whitespace-nowrap animate-fade-in-up"
            style={{
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #1D9E75 0%, #1D9E75 100%)"
                  : "linear-gradient(135deg, #DC2626 0%, #DC2626 100%)",
              color: "white",
            }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
