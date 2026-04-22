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
  client: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  employees: string[];
  attachments: any[];
  startDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  project: string;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'project';
  status: 'pending' | 'submitted' | 'reviewed';
  project?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface File {
  _id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
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

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [projectProgress, setProjectProgress] = useState(0);
  const [selectedTask, setSelectedTask] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [taskProgress, setTaskProgress] = useState(0);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

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
    { id: "projects", label: "My Projects", icon: "📁" },
    { id: "tasks", label: "My Tasks", icon: "✅" },
    { id: "progress", label: "Update Progress", icon: "📈" },
    { id: "files", label: "Upload Files", icon: "📎" },
    { id: "chat", label: "Chat with Admin", icon: "💬" },
    // { id: "reports", label: "Submit Reports", icon: "📋" },
  ];

  // Set mock data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          showToast('Please login to continue', 'error');
          navigate('/login');
          return;
        }

        // Fetch employee dashboard overview
        const dashboardResponse = await fetch('https://ibos-system-backend.onrender.com/api/employee/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('Employee Dashboard API response:', dashboardData); // Debug log
          
          if (dashboardData.success && dashboardData.data) {
            // Set dashboard overview data
            setDashboardData(dashboardData.data);
            console.log('Employee dashboard data loaded:', dashboardData.data);
          } else {
            console.error('Invalid dashboard response structure:', dashboardData);
          }
        } else {
          console.error('Failed to fetch employee dashboard:', dashboardResponse.status);
        }

        // Fetch employee projects
        const projectsResponse = await fetch('https://ibos-system-backend.onrender.com/api/employee/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          console.log('Employee Projects API response:', projectsData); // Debug log
          
          if (projectsData.success && projectsData.data && projectsData.data.projects) {
            // Set projects data
            setProjects(projectsData.data.projects);
            console.log('Employee projects loaded:', projectsData.data.projects);
          } else {
            console.error('Invalid projects response structure:', projectsData);
            setProjects([]);
          }
        } else {
          console.error('Failed to fetch employee projects:', projectsResponse.status);
          setProjects([]);
        }

        // Fetch employee tasks
        const tasksResponse = await fetch('https://ibos-system-backend.onrender.com/api/employee/tasks', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          console.log('Employee Tasks API response:', tasksData); // Debug log
          
          if (tasksData.success && tasksData.data && tasksData.data.tasks) {
            // Set tasks data
            setTasks(tasksData.data.tasks);
            console.log('Employee tasks loaded:', tasksData.data.tasks);
          } else {
            console.error('Invalid tasks response structure:', tasksData);
            setTasks([]);
          }
        } else {
          console.error('Failed to fetch employee tasks:', tasksResponse.status);
          setTasks([]);
        }

        // Fetch admin users for chat
        const adminUsersResponse = await fetch('https://ibos-system-backend.onrender.com/api/employee/users?role=admin', {
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

        // Initialize empty arrays for other sections (they will have their own API calls later)
        setReports([]);
        setFiles([]);
        setConversations([]);

      } catch (error) {
        console.error('Error fetching employee data:', error);
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
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

  // Update project progress
  const updateProgress = async (projectId: string, newProgress: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Please login to continue', 'error');
        return;
      }

      // Find the current project to get all required data
      const currentProject = projects.find(p => p._id === projectId);
      if (!currentProject) {
        showToast('Project not found', 'error');
        return;
      }

      const response = await fetch(`https://ibos-system-backend.onrender.com/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: currentProject.title,
          description: currentProject.description,
          client: currentProject.client._id,
          employees: currentProject.employees,
          budget: currentProject.budget,
          startDate: currentProject.startDate,
          deadline: currentProject.deadline,
          status: currentProject.status,
          progress: newProgress,
          notes: currentProject.notes
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Project progress updated:', result); // Debug log
        
        if (result.success) {
          // Update local state with response data
          setProjects(projects.map(project => 
            project._id === projectId ? result.data.project : project
          ));
          showToast('Progress updated successfully', 'success');
        } else {
          console.error('Failed to update progress:', result);
          showToast('Failed to update progress', 'error');
        }
      } else {
        console.error('Failed to update project:', response.status);
        showToast('Failed to update progress', 'error');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      showToast('Failed to update progress', 'error');
    }
  };

  // Submit report
  const submitReport = async (taskId: string, report: string, progress: number, attachments: string[]) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        showToast('Please login to continue', 'error');
        return;
      }

      const response = await fetch('https://ibos-system-backend.onrender.com/api/employee/reports/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          report,
          progress,
          attachments
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Report submitted:', result); // Debug log
        
        if (result.success) {
          showToast('Report submitted successfully', 'success');
          // Update local state with new task data
          setTasks(tasks.map(task => 
            task._id === taskId ? result.data.task : task
          ));
        } else {
          console.error('Failed to submit report:', result);
          showToast('Failed to submit report', 'error');
        }
      } else {
        console.error('Failed to submit report:', response.status);
        showToast('Failed to submit report', 'error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showToast('Failed to submit report', 'error');
    }
  };

  // Upload file
  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock file upload
    const newFile: File = {
      _id: `file${Date.now()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString()
    };

    setFiles([...files, newFile]);
    showToast('File uploaded successfully', 'success');
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
                  {dashboardData?.projectStats?.pending || 0}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.projectStats?.pending || 0} pending
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">In Progress</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.projectStats?.in_progress || 0}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.projectStats?.in_progress || 0} ongoing
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Pending Tasks</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.taskStats?.pending || 0}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.taskStats?.pending || 0} to do
                </p>
              </div>
              
              <div className="p-4 lg:p-6 rounded-xl" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
                <h3 className="text-sm lg:text-lg font-semibold text-white mb-2 lg:mb-4">Completed Tasks</h3>
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {dashboardData?.taskStats?.completed || 0}
                </div>
                <p className="text-xs lg:text-sm mt-1 lg:mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {dashboardData?.taskStats?.completed || 0} done
                </p>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
              <h2 className="text-xl font-semibold text-white mb-6">Upcoming Deadlines</h2>
              <div className="space-y-4">
                {dashboardData?.upcomingDeadlines?.length > 0 ? (
                  dashboardData.upcomingDeadlines.map((deadline: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-white">{deadline.title || 'Task Deadline'}</h3>
                          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {deadline.description || 'Complete this task before the deadline'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            {new Date(deadline.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {deadline.daysLeft || 0} days left
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </div>

            </div>
        );

      case "projects":
        return (
          <div className="rounded-xl p-4 lg:p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">My Projects</h2>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Progress</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-sm font-medium text-white">{project.progress}%</div>
                          <div className="w-20 h-2 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.1)" }}>
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${project.progress}%`,
                                background: project.status === 'completed' ? '#1D9E75' : '#7F77DD'
                              }}
                            ></div>
                          </div>
                         
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Budget</div>
                        <div className="text-sm font-medium text-white mt-1">${project.budget}</div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Client</div>
                        <div className="text-sm font-medium text-white mt-1">{project.client?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Deadline</div>
                        <div className="text-sm font-medium text-white mt-1">{new Date(project.deadline).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    {project.notes && (
                      <div className="mt-4">
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Notes</div>
                        <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{project.notes}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                  No projects assigned
                </div>
              )}
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">My Tasks</h2>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{task.title}</h3>
                        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{task.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2 py-1 rounded" 
                            style={{ 
                              background: task.status === 'completed' ? '#1D9E75' : 
                                         task.status === 'in_progress' ? '#7F77DD' : 
                                         task.status === 'pending' ? '#F59E0B' : '#6B7280',
                              color: 'white'
                            }}>
                            {task.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded" 
                            style={{ 
                              background: task.priority === 'high' ? '#EF4444' : 
                                         task.priority === 'medium' ? '#F59E0B' : '#10B981',
                              color: 'white'
                            }}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                  No tasks assigned
                </div>
              )}
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="rounded-xl p-4 lg:p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">Update Project Progress</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                    <div>
                      <h3 className="font-medium text-white text-base lg:text-lg">{project.title}</h3>
                      <p className="text-xs lg:text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium text-white mb-2">Current Progress: {project.progress}%</div>
                    <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div 
                        className="h-3 rounded-full" 
                        style={{ 
                          width: `${project.progress}%`,
                          background: project.status === 'completed' ? '#1D9E75' : '#7F77DD'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      // value={project.progress}
                      value={projectProgress}
                      // onChange={(e) => updateProgress(project._id, parseInt(e.target.value))}
                       onChange={(e) => setProjectProgress(parseInt(e.target.value))}
                      className="flex-1"
                      style={{ 
                        background: "transparent",
                        outline: "none"
                      }}
                    />
                    <span className="text-sm font-medium text-white w-12">{projectProgress}%</span>
                  </div>
                   <button
                            onClick={() => updateProgress(project._id, projectProgress)}
                            className="px-3 py-1 rounded text-white text-sm"
                            style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
                          >
                            Update Progress
                          </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "files":
        return (
          <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
            <h2 className="text-xl font-semibold text-white mb-6">Submit Report</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Select Task</label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(127,119,221,0.25)"
                  }}
                >
                  <option value="">Select a task...</option>
                  {tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Report Details</label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Enter your report details..."
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(127,119,221,0.25)",
                    minHeight: "120px"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Task Progress</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={taskProgress}
                    onChange={(e) => setTaskProgress(parseInt(e.target.value))}
                    className="flex-1"
                    style={{ 
                      background: "transparent",
                      outline: "none"
                    }}
                  />
                  <span className="text-sm font-medium text-white w-12">{taskProgress}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Upload Files</label>
                <input
                  type="file"
                  onChange={uploadFile}
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(127,119,221,0.25)"
                  }}
                />
              </div>

              <button
                onClick={() => {
                  if (!selectedTask || !reportText) {
                    showToast('Please select a task and enter report details', 'error');
                    return;
                  }
                  const attachments = files.map(f => f.url);
                  submitReport(selectedTask, reportText, taskProgress, attachments);
                }}
                className="w-full px-4 py-3 rounded-lg text-white font-medium"
                style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
              >
                Submit Report
              </button>

              {files.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Uploaded Files</h3>
                  {files.map((file) => (
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
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              )}
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
              {/* Chat Messages Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 lg:p-4">
                  <div className="space-y-2 lg:space-y-4">
                    {currentMessages.map((message) => (
                      <div key={message._id} className={`flex ${message.sender === 'employee' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] lg:max-w-xs px-3 lg:px-4 py-2 lg:py-2 rounded-lg break-words ${
                          message.sender === 'employee' 
                            ? 'text-white' 
                            : 'text-gray-100'
                        }`}
                        style={{ 
                          background: message.sender === 'employee' 
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
        );

      // case "reports":
      //   return (
      //     <div className="rounded-xl p-6" style={{ background: "linear-gradient(145deg, #1a1a24 0%, #14141c 100%)", border: "1px solid rgba(127,119,221,0.25)" }}>
      //       <h2 className="text-xl font-semibold text-white mb-6">Submit Reports</h2>
            
      //       <div className="mb-6">
      //         <button
      //           onClick={submitReport}
      //           className="px-6 py-3 rounded-lg text-white"
      //           style={{ background: "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)" }}
      //         >
      //           Submit New Report
      //         </button>
      //       </div>

      //       <div className="space-y-4">
      //         <h3 className="text-lg font-semibold text-white mb-4">Report History</h3>
      //         {reports.map((report) => (
      //           <div key={report._id} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
      //             <div className="flex justify-between items-start">
      //               <div>
      //                 <h3 className="font-medium text-white">{report.title}</h3>
      //                 <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{report.description}</p>
      //                 <div className="flex items-center gap-4 mt-3">
      //                   <span className="text-xs px-2 py-1 rounded" 
      //                     style={{ 
      //                       background: report.type === 'weekly' ? '#7F77DD' : 
      //                                  report.type === 'monthly' ? '#1D9E75' : '#10B981',
      //                       color: 'white'
      //                     }}>
      //                     {report.type.toUpperCase()}
      //                   </span>
      //                   <span className="text-xs px-2 py-1 rounded" 
      //                     style={{ 
      //                       background: report.status === 'submitted' ? '#1D9E75' : 
      //                                  report.status === 'reviewed' ? '#F59E0B' : '#F59E0B',
      //                       color: 'white'
      //                     }}>
      //                     {report.status.replace('_', ' ').toUpperCase()}
      //                   </span>
      //                 </div>
      //               </div>
      //               <div className="text-right">
      //                 <div className="text-sm font-medium text-white">
      //                   {report.submittedAt ? new Date(report.submittedAt).toLocaleDateString() : 'Not submitted'}
      //                 </div>
      //               </div>
      //             </div>
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0F0F1E 0%, #1A1A2E 100%)" }}>
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
      `} style={{ borderColor: "rgba(127,119,221,0.25)" }}>
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
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{
                background: activeSection === item.id
                  ? "linear-gradient(135deg, #534AB7 0%, #1D9E75 100%)"
                  : "transparent"
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
            Manage your work and tasks
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

export default EmployeeDashboard;
