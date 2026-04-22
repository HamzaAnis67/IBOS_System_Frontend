import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Interfaces
interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  deadline: string;
  budget: number;
  client: string;
  employees: any[];
  attachments: any[];
  startDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFile {
  _id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Invoice {
  _id: string;
  project: string | any;
  client: string | any;
  amount: number;
  tax: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'paypal';
  dueDate: string;
  items: any[];
  notes: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  qrCode?: string;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
  fileName?: string;
  fileUrl?: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}


interface Toast {
  message: string;
  type: "success" | "error";
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // Menu items
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "invoices", label: "Invoices", icon: "🧾" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "files", label: "Files", icon: "📁" },
  ];

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const clientId = localStorage.getItem('id');
        
        if (!token) {
          showToast('Please login to continue', 'error');
          navigate('/login');
          return;
        }

        if (!clientId) {
          showToast('User ID not found', 'error');
          return;
        }

        // Fetch client dashboard overview
        const dashboardResponse = await fetch('https://ibos-system-backend.onrender.com/api/client/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('Dashboard API response:', dashboardData); // Debug log
          
          if (dashboardData.success && dashboardData.data) {
            // Set dashboard overview data
            setDashboardData(dashboardData.data);
            console.log('Dashboard data loaded:', dashboardData.data);
          } else {
            console.error('Invalid dashboard response structure:', dashboardData);
          }
        } else {
          console.error('Failed to fetch dashboard:', dashboardResponse.status);
        }

        // Fetch all projects and filter by client
        const projectsResponse = await fetch('https://ibos-system-backend.onrender.com/api/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          console.log('Projects API response:', projectsData); // Debug log
          
          // Check if response has the expected structure
          if (projectsData.success && projectsData.data) {
            let projectsArray = projectsData.data;
            
            // Handle different response structures
            if (projectsData.data.projects && Array.isArray(projectsData.data.projects)) {
              projectsArray = projectsData.data.projects;
            } else if (!Array.isArray(projectsData.data)) {
              console.error('Projects data is not an array:', projectsData.data);
              // Fallback to mock data
              setProjects([]);
              return;
            }
            
            // Filter projects by client ID
            const clientProjects = projectsArray.filter((project: any) => 
              project.client === clientId || 
              (project.client && project.client._id === clientId)
            );
            console.log('Filtered client projects:', clientProjects);
            setProjects(clientProjects);
          } else {
            console.error('Invalid projects response structure:', projectsData);
            // Fallback to mock data
            setProjects([]);
          }
        } else {
          console.error('Failed to fetch projects:', projectsResponse.status);
          // Fallback to mock data
          setProjects([]);
        }

        // Fetch invoices for current client
        const invoicesResponse = await fetch('https://ibos-system-backend.onrender.com/api/client/invoices', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          console.log('Invoices API response:', invoicesData); // Debug log
          
          if (invoicesData.success && invoicesData.data) {
            // Handle different response structures
            let invoicesArray = invoicesData.data;
            if (invoicesData.data.invoices && Array.isArray(invoicesData.data.invoices)) {
              invoicesArray = invoicesData.data.invoices;
            } else if (!Array.isArray(invoicesData.data)) {
              console.error('Invoices data is not an array:', invoicesData.data);
              setInvoices([]);
              return;
            }
            
            console.log('Setting invoices:', invoicesArray);
            setInvoices(invoicesArray);
          } else {
            console.error('Invalid invoices response structure:', invoicesData);
            setInvoices([]);
          }
        } else {
          console.error('Failed to fetch invoices:', invoicesResponse.status);
          setInvoices([]);
        }

        // Mock conversations data
        const mockConversations: Conversation[] = [
          {
            _id: "conv1",
            participants: ["client1", "admin"],
            messages: [
              {
                _id: "msg1",
                sender: "admin",
                receiver: "client1",
                content: "Hi! I've uploaded the project brief for the e-commerce website. Please review it.",
                timestamp: "2024-01-15T10:00:00Z",
                type: "text"
              },
              {
                _id: "msg2",
                sender: "client1",
                receiver: "admin",
                content: "Thanks! I'll review it and get back to you with feedback.",
                timestamp: "2024-01-15T11:30:00Z",
                type: "text"
              },
              {
                _id: "msg3",
                sender: "admin",
                receiver: "client1",
                content: "Great! I've also shared the initial design mockups in the files section.",
                timestamp: "2024-01-20T14:30:00Z",
                type: "text"
              }
            ],
            createdAt: "2024-01-15T09:00:00Z",
            updatedAt: "2024-01-20T14:30:00Z"
          }
        ];

        // Fetch admin users for chat
        const adminUsersResponse = await fetch('https://ibos-system-backend.onrender.com/api/client/users?role=admin', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (adminUsersResponse.ok) {
          const adminUsersData = await adminUsersResponse.json();
          console.log('Admin Users API response:', adminUsersData); // Debug log
          
          if (adminUsersData.success && adminUsersData.data && adminUsersData.data.users) {
            // Set admin users data
            setAdminUsers(adminUsersData.data.users);
            console.log('Admin users loaded:', adminUsersData.data.users);
          } else {
            console.error('Invalid admin users response structure:', adminUsersData);
            setAdminUsers([]);
          }
        } else {
          console.error('Failed to fetch admin users:', adminUsersResponse.status);
          setAdminUsers([]);
        }

        setConversations(mockConversations);
      } catch (error) {
        console.error('Error fetching client data:', error);
        showToast('Failed to load data', 'error');
      }
    };

    fetchClientData();
  }, [navigate, showToast]);

  // Fetch conversation history
  const fetchConversation = async (userId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Please login to continue', 'error');
        return;
      }

      const response = await fetch(`https://ibos-system-backend.onrender.com/api/messages/conversation/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Conversation fetched:', result); // Debug log
        
        if (result.success && result.data && result.data.messages) {
          // Convert API response to Message format
          const messages: Message[] = result.data.messages.map((msg: any) => ({
            _id: msg._id,
            sender: msg.sender._id,
            receiver: msg.receiver._id,
            content: msg.message,
            timestamp: msg.createdAt,
            type: "text"
          }));
          
          setCurrentMessages(messages);
          console.log('Conversation loaded:', messages);
        } else {
          console.error('Invalid conversation response structure:', result);
          setCurrentMessages([]);
        }
      } else {
        console.error('Failed to fetch conversation:', response.status);
        setCurrentMessages([]);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setCurrentMessages([]);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Please login to continue', 'error');
        return;
      }

      const response = await fetch('https://ibos-system-backend.onrender.com/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver: selectedConversation,
          message: messageInput
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Message sent:', result); // Debug log
        
        if (result.success) {
          // Add message to current conversation
          const newMessage: Message = {
            _id: result.data.message._id,
            sender: result.data.message.sender._id,
            receiver: result.data.message.receiver._id,
            content: result.data.message.message,
            timestamp: result.data.message.createdAt,
            type: "text"
          };

          setCurrentMessages([...currentMessages, newMessage]);
          setMessageInput('');
          showToast('Message sent successfully', 'success');
        } else {
          console.error('Failed to send message:', result);
          showToast('Failed to send message', 'error');
        }
      } else {
        console.error('Failed to send message:', response.status);
        showToast('Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  // Download invoice (mock)
  const downloadInvoice = (invoiceId: string) => {
    // Create a simple text file as mock invoice
    const invoice = invoices.find(inv => inv._id === invoiceId);
    if (!invoice) {
      showToast('Invoice not found', 'error');
      return;
    }

    const invoiceContent = `
INVOICE #${invoiceId.slice(-6)}
=====================================
Project: ${typeof invoice.project === 'object' ? invoice.project.title : 'Unknown'}
Amount: $${invoice.amount.toFixed(2)}
Tax: $${invoice.tax.toFixed(2)}
Total: $${(invoice.amount + invoice.tax).toFixed(2)}
Payment Method: ${invoice.paymentMethod}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Status: ${invoice.status.toUpperCase()}
Notes: ${invoice.notes}
=====================================
Generated on: ${new Date().toLocaleDateString()}
    `;

    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId.slice(-6)}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showToast('Invoice downloaded successfully', 'success');
  };

  
  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Pending Projects</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.projectStats?.pending || projects.filter(p => p.status === 'pending').length}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.projectStats?.pending || projects.filter(p => p.status === 'pending').length} pending
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">In Progress</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.projectStats?.in_progress || projects.filter(p => p.status === 'in_progress').length}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.projectStats?.in_progress || projects.filter(p => p.status === 'in_progress').length} ongoing
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Completed</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.projectStats?.completed || projects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Successfully delivered
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Unpaid Invoices</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  ${((dashboardData?.unpaidInvoices?.totalAmount || 0) / 1000).toFixed(0)}k
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.unpaidInvoices?.count || 0} pending
                </p>
              </div>
              
            </div>

            {/* Recent Projects */}
            <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h2 className="text-xl font-semibold text-white mb-6">Recent Projects</h2>
              <div className="space-y-4">
                {(dashboardData?.recentProjects || projects.slice(0, 5)).map((project) => (
                  <div key={project._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{project.title}</h3>
                        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{project.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2 py-1 rounded" 
                            style={{ 
                              background: project.status === 'completed' ? '#1D9E75' : 
                                         project.status === 'in_progress' ? '#7F77DD' : 
                                         project.status === 'cancelled' ? '#F59E0B' : '#1D9E75',
                              color: 'white'
                            }}>
                            {project.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                            Due: {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{project.progress}%</div>
                        <div className="w-20 h-2 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${project.progress}%`,
                              background: "linear-gradient(135deg, #1D9E75 0%, #1D9E75 100%)"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="rounded-xl p-4 lg:p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">My Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                    <div>
                      <h3 className="font-medium text-white text-base lg:text-lg">{project.title}</h3>
                      <p className="text-xs lg:text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{project.description}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded self-start sm:self-auto" 
                      style={{ 
                        background: project.status === 'completed' ? '#1D9E75' : 
                                   project.status === 'in_progress' ? '#7F77DD' : 
                                   project.status === 'cancelled' ? '#F59E0B' : '#6B7280',
                        color: 'white'
                      }}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Progress</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${project.progress}%`,
                              background: "linear-gradient(135deg, #1D9E75 0%, #1D9E75 100%)"
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Deadline</div>
                      <div className="text-sm font-medium text-white mt-1">
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Budget</div>
                      <div className="text-sm font-medium text-white mt-1">${project.budget}</div>
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Files</div>
                      <div className="text-sm font-medium text-white mt-1">{project.attachments?.length || 0} files</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "invoices":
        return (
          <div className="rounded-xl p-4 lg:p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">My Invoices</h2>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-base lg:text-lg">Invoice #{invoice._id.slice(-6)}</h3>
                      <p className="text-xs lg:text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                        Project: {typeof invoice.project === 'object' ? invoice.project.title : 'Unknown'}
                      </p>
                      
                      {/* Invoice Details - Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-4 mt-3">
                        <div className="flex flex-col sm:flex-col">
                          <span className="text-xs lg:text-sm font-medium text-white">${invoice.amount.toFixed(2)}</span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Amount</span>
                        </div>
                        <div className="flex flex-col sm:flex-col">
                          <span className="text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Due Date</span>
                        </div>
                        <div className="flex flex-col sm:flex-col">
                          <span className="text-xs px-2 py-1 rounded w-fit" 
                            style={{ 
                              background: invoice.status === 'paid' ? '#1D9E75' : 
                                         invoice.status === 'overdue' ? '#DC2626' : '#F59E0B',
                              color: 'white'
                            }}>
                            {invoice.status.toUpperCase()}
                          </span>
                          <span className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Status</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Download Button - Mobile and Desktop */}
                    <div className="flex sm:flex-col items-start sm:items-end gap-2">
                      <button
                        onClick={() => downloadInvoice(invoice._id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-white font-medium text-xs lg:text-sm"
                        style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <div className="p-4 lg:p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h2 className="text-lg lg:text-xl font-semibold text-white">Chat with Admin</h2>
            </div>
            <div className="flex flex-col lg:flex-row h-[60vh] lg:h-[70vh] max-h-[600px]">
              {/* Conversations Sidebar */}
              <div className="w-full lg:w-1/3 border-b lg:border-r lg:border-b-0 overflow-hidden flex flex-col" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="p-3 lg:p-4 flex-shrink-0">
                  <h3 className="text-xs lg:text-sm font-medium text-white">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-3 lg:pb-4">
                  <div className="space-y-2">
                    {adminUsers.length > 0 ? (
                      adminUsers.map((admin) => (
                        <div
                          key={admin._id}
                          onClick={() => {
                            setSelectedConversation(admin._id);
                            fetchConversation(admin._id);
                          }}
                          className="p-2 lg:p-3 rounded-lg cursor-pointer"
                          style={{ 
                            background: selectedConversation === admin._id ? 
                              "rgba(127,119,221,0.2)" : "rgba(255,255,255,0.02)"
                          }}
                        >
                          <div className="font-medium text-white text-xs lg:text-sm truncate">{admin.name}</div>
                          <div className="text-xs mt-1 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                        No admin users available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-3 lg:p-4">
                    <div className="space-y-2 lg:space-y-4">
                      {currentMessages.map((message) => (
                        <div key={message._id} className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] lg:max-w-xs px-3 lg:px-4 py-2 lg:py-2 rounded-lg break-words ${
                            message.sender === 'client' 
                              ? 'text-white' 
                              : 'text-gray-100'
                          }`}
                          style={{ 
                            background: message.sender === 'client' 
                              ? "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" 
                              : "rgba(255,255,255,0.1)"
                          }}>
                            <p className="text-xs lg:text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 lg:p-4 border-t flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-white outline-none text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                        placeholder="Type a message..."
                        disabled={!selectedConversation}
                      />
                      <button
                        onClick={sendMessage}
                        className="px-3 lg:px-4 py-2 rounded-lg text-white font-medium text-sm"
                        style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                        disabled={!selectedConversation}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "files":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Project Files</h2>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project._id}>
                  <h3 className="font-medium text-white mb-3">{project.title}</h3>
                  <div className="space-y-2">
                    {project.attachments?.map((file) => (
                      <div key={file._id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "rgba(127,119,221,0.2)" }}>
                            <span className="text-xs text-white">FILE</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{file.name}</div>
                            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded text-white text-sm"
                          style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                        >
                          View
                        </a>
                      </div>
                    ))}
                    {(!project.attachments || project.attachments.length === 0) && (
                      <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                        No files available for this project
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0F0F14" }}>
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
      `} style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", borderRight: "1px solid rgba(127,119,221,0.25)" }}>
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
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{
                background: activeSection === item.id ? "rgba(127,119,221,0.2)" : "transparent",
              }}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              navigate('/login');
              // Close mobile menu after logout
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="w-full px-4 py-3 rounded-lg text-gray-400 hover:text-white transition-all"
            style={{ background: "transparent" }}
          >
            Logout
          </button>
        </div>
        </div>

        {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(127,119,221,0.25)" }}>
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
            Manage your projects and communications
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

export default ClientDashboard;
