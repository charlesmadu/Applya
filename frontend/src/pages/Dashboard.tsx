import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import Card from '../components/Card';
import Applications from './Applications';
import CVTailor from './CVTailor';
import Documents from './Documents';
import type { IApplication } from '../types';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Bell, 
  Search, 
  Menu,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  DollarSign,
  X,
  Edit2,
  ExternalLink,
  Trash2,
  LogOut
} from 'lucide-react';

// Shared Application Type (matches backend response)
export type { IApplication } from '../types';

// Map backend status (APPLIED) to frontend status (Applied)
const mapStatus = (status: string): IApplication['status'] => {
  const statusMap: Record<string, IApplication['status']> = {
    'APPLIED': 'Applied',
    'INTERVIEW': 'Interview',
    'OFFER': 'Offer',
    'REJECTED': 'Rejected',
  };
  return statusMap[status] || 'Applied';
};

// Map frontend status (Applied) to backend status (APPLIED)
const mapStatusToBackend = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Applied': 'APPLIED',
    'Interview': 'INTERVIEW',
    'Offer': 'OFFER',
    'Rejected': 'REJECTED',
  };
  return statusMap[status] || 'APPLIED';
};

// Transform backend response to frontend format
const transformApplication = (app: any): IApplication => ({
  id: app.id,
  jobId: app.jobId,
  role: app.title,
  company: app.company,
  location: app.location || 'Not specified',
  salary: app.salary || 'Not specified',
  date: app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A',
  status: mapStatus(app.status),
  logo: app.company?.[0]?.toUpperCase() || 'C',
  jobUrl: app.url,
  url: app.url,
  description: app.description,
  notes: app.notes,
  contactName: app.contactName,
  contactEmail: app.contactEmail,
  appliedDate: app.appliedDate,
  createdAt: app.createdAt,
  updatedAt: app.updatedAt,
});

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'text-blue-700 border-blue-200 bg-blue-50' },
  { id: 'Interview', label: 'Interview', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  { id: 'Offer', label: 'Offer', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
  { id: 'Rejected', label: 'Rejected', color: 'text-slate-600 border-slate-200 bg-slate-50' },
];

const getStatusColor = (status: IApplication['status']) => {
  const colors = {
    Applied: 'bg-blue-50 text-blue-700 border-blue-100',
    Interview: 'bg-amber-50 text-amber-700 border-amber-100',
    Offer: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Rejected: 'bg-slate-50 text-slate-600 border-slate-100',
  };
  return colors[status];
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, colorClass, trend }: {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass: string;
  trend?: string;
}) => (
  <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="mt-3">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{title}</p>
    </div>
  </Card>
);

// WeeklyTracker Component
const WeeklyTracker = ({ data }: { data: { day: string; count: number }[] }) => {
  const max = Math.max(...data.map(d => d.count), 1); // Minimum 1 to avoid division by zero
  const totalThisWeek = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Weekly Activity</h3>
          <p className="text-sm text-slate-500">Applications sent last 7 days</p>
        </div>
        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          {totalThisWeek} total
        </div>
      </div>
      <div className="flex-1 flex items-end justify-between gap-2 mt-2">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center w-full group cursor-pointer">
            <div className="relative w-full max-w-[32px] bg-purple-50 rounded-t-md h-32 overflow-hidden flex items-end">
              <div 
                style={{ height: `${(item.count / max) * 100}%` }} 
                className={`w-full rounded-t-md transition-all duration-700 ease-out ${item.count > 0 ? 'bg-purple-500 group-hover:bg-purple-600' : 'bg-transparent'}`}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {item.count} apps
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// AICVTailor Widget Component
const AICVTailorWidget = ({ onNavigate }: { onNavigate: () => void }) => {
  return (
    <Card className="p-0 overflow-hidden h-full flex flex-col">
      <div className="p-6 bg-gradient-to-br from-purple-700 to-indigo-800 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-yellow-300" />
          <h3 className="font-bold text-lg">AI CV Optimizer</h3>
        </div>
        <p className="text-purple-100 text-sm">Paste a job description to tailor your CV instantly.</p>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">Job Description</label>
          <textarea 
            placeholder="Paste the job description here..." 
            className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-slate-50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center justify-between p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-purple-50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md border border-slate-200 text-purple-600 group-hover:border-purple-200">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">My_Resume_v1.pdf</p>
              <p className="text-xs text-slate-400">1.2 MB • PDF</p>
            </div>
          </div>
          <button className="text-xs font-medium text-slate-400 hover:text-purple-600 transition-colors">Change</button>
        </div>
        <button 
          onClick={onNavigate}
          className="w-full mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white shadow-sm shadow-purple-200 transition-colors"
        >
          <Sparkles size={16} className="mr-2" />
          Generate Tailored CV
        </button>
      </div>
    </Card>
  );
};

// JobBoardWidget Component
const JobBoardWidget = () => {
  const jobs = [
    { id: 1, role: 'Frontend Developer', company: 'TechFlow', logo: 'TF', salary: '$90k - $120k', type: 'Remote' },
    { id: 2, role: 'Product Designer', company: 'Creatives Inc', logo: 'CI', salary: '$100k - $140k', type: 'Hybrid' },
    { id: 3, role: 'React Engineer', company: 'WebScale', logo: 'WS', salary: '$110k - $130k', type: 'Remote' },
  ];

  return (
    <Card className="h-full">
      <div className="p-6 border-b border-purple-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Recommended Jobs</h3>
        <a href="#" className="text-sm text-purple-600 hover:text-purple-800 font-medium">View All</a>
      </div>
      <div className="divide-y divide-slate-50">
        {jobs.map(job => (
          <div key={job.id} className="p-4 hover:bg-purple-50/50 transition-colors flex items-start justify-between group cursor-pointer">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                {job.logo}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{job.role}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building2 size={10} /> {job.company}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {job.type}</span>
                  <span className="flex items-center gap-1"><DollarSign size={10} /> {job.salary}</span>
                </div>
              </div>
            </div>
            <button className="text-xs font-medium px-3 py-1.5 rounded-md border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white transition-all">
              Apply
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Badge Component
const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Applied: "bg-blue-50 text-blue-700 border-blue-100",
    Interview: "bg-amber-50 text-amber-700 border-amber-100",
    Offer: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Rejected: "bg-slate-50 text-slate-600 border-slate-100", 
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Applied}`}>
      {status}
    </span>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingApp, setViewingApp] = useState<IApplication | null>(null);
  const [editingApp, setEditingApp] = useState<IApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await applicationsAPI.getAll();
      const transformedData = data.map(transformApplication);
      setApplications(transformedData);
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from applications
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  // Calculate weekly activity (applications in last 7 days)
  const getWeeklyActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      const count = applications.filter(app => {
        if (!app.appliedDate) return false;
        const appDate = new Date(app.appliedDate);
        return appDate.toDateString() === date.toDateString();
      }).length;

      weekData.push({ day: dayName, count });
    }

    return weekData;
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'cv-tailor', label: 'AI CV Tailor', icon: Sparkles },
    { id: 'documents', label: 'My Documents', icon: FileText },
  ];

  // Handle status change from drag and drop
  const handleStatusChange = async (appId: number, newStatus: IApplication['status']): Promise<void> => {
    try {
      await applicationsAPI.updateStatus(appId, mapStatusToBackend(newStatus) as any);
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert on error by refetching
      fetchApplications();
    }
  };

  const handleNavigateToDocuments = () => setActiveTab('documents');
  const handleNavigateToCVTailor = () => setActiveTab('cv-tailor');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingApp) return;
    const { name, value } = e.target;
    setEditingApp(prev => {
      if (!prev) return null;
      if (name === 'status') return { ...prev, [name]: value as IApplication['status'] };
      return { ...prev, [name]: value };
    });
  };

  const handleEditApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    
    try {
      setIsSaving(true);
      const updateData = {
        title: editingApp.role,
        company: editingApp.company,
        location: editingApp.location,
        salary: editingApp.salary,
        url: editingApp.jobUrl,
        notes: editingApp.notes,
        status: mapStatusToBackend(editingApp.status) as any,
      };
      
      const updatedApp = await applicationsAPI.update(editingApp.id, updateData);
      const transformedApp = transformApplication(updatedApp);
      setApplications(prev => prev.map(app => app.id === editingApp.id ? transformedApp : app));
      setEditingApp(null);
    } catch (err) {
      console.error('Failed to update application:', err);
      alert('Failed to update application');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApplication = async () => {
    if (!viewingApp) return;
    try {
      setIsSaving(true);
      await applicationsAPI.delete(viewingApp.id);
      setApplications(prev => prev.filter(app => app.id !== viewingApp.id));
      setViewingApp(null);
      setDeleteConfirm(false);
    } catch (err) {
      console.error('Failed to delete application:', err);
      alert('Failed to delete application');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddApp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setIsSaving(true);
      const newAppData = {
        title: formData.get('role') as string,
        company: formData.get('company') as string,
        location: formData.get('location') as string || 'Remote',
        salary: formData.get('salary') as string || 'Not specified',
        url: formData.get('jobUrl') as string || undefined,
        notes: formData.get('notes') as string || undefined,
        status: mapStatusToBackend(formData.get('status') as string || 'Applied') as any,
        appliedDate: new Date().toISOString().split('T')[0],
      };
      
      const savedApp = await applicationsAPI.create(newAppData);
      const transformedApp = transformApplication(savedApp);
      setApplications(prev => [transformedApp, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add application:', err);
      alert('Failed to add application');
    } finally {
      setIsSaving(false);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    return 'U';
  };

  // Recent applications for the table (last 4)
  const recentApps = [...applications].slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-screen flex flex-col sticky top-0">
          <div className="h-16 flex items-center justify-start px-6 border-b border-slate-100 flex-shrink-0">
            <img className="w-8 h-8 flex mr-1" src='/images/applyr-logo.svg'/>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Applya</span>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <item.icon size={18} className={`mr-3 ${activeTab === item.id ? 'text-purple-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* User Section with Logout - Always at bottom */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0 mt-auto bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'Free Plan'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-slate-500"><Menu size={24} /></button>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">
              {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search applications..." className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-purple-500 w-64 outline-none transition-all" />
            </div>
            <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            
            {/* Overview Tab */}
            {activeTab === 'dashboard' && (
              <div className='flex flex-col gap-8'>
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Loading your data...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <p className="text-red-500 mb-4">{error}</p>
                      <button onClick={fetchApplications} className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <section>
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">At a Glance</h2>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Applied" value={String(stats.total)} icon={Briefcase} colorClass="bg-blue-50 text-blue-600" />
                        <StatCard title="In Progress" value={String(stats.applied + stats.interview)} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
                        <StatCard title="Interviews" value={String(stats.interview)} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
                        <StatCard title="Offers" value={String(stats.offer)} icon={TrendingUp} colorClass="bg-purple-50 text-purple-600" />
                      </div>
                    </section>

                {/* Charts & AI Tool */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">
                  <div className="lg:col-span-2 h-full"><WeeklyTracker data={getWeeklyActivity()} /></div>
                  <div className="h-full"><AICVTailorWidget onNavigate={handleNavigateToCVTailor} /></div>
                </section>

                {/* Applications Table & Job Board */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden h-full">
                      <div className="p-6 border-b border-purple-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Recent Applications</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setActiveTab('applications')} className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                            View All
                          </button>
                          <button onClick={() => setIsAddModalOpen(true)} className="text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white shadow-sm shadow-purple-200 rounded-lg transition-colors font-medium inline-flex items-center">
                            <Plus size={14} className="mr-1" /> Add New
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                              <th className="px-6 py-3 font-medium">Role & Company</th>
                              <th className="px-6 py-3 font-medium">Date Applied</th>
                              <th className="px-6 py-3 font-medium">Status</th>
                              <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {recentApps.map((app) => (
                              <tr key={app.id} onClick={() => setViewingApp(app)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4">
                                  <p className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">{app.role}</p>
                                  <p className="text-xs text-slate-500">{app.company}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{app.date}</td>
                                <td className="px-6 py-4"><Badge status={app.status} /></td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={(e) => { e.stopPropagation(); setEditingApp(app); }} className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                                    <MoreHorizontal size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                  <div className="lg:col-span-1"><JobBoardWidget /></div>
                </section>
                  </>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <Applications 
                applications={applications} 
                setApplications={setApplications}
                onViewApp={setViewingApp}
                onEditApp={setEditingApp}
                onAddApp={() => setIsAddModalOpen(true)}
                onStatusChange={handleStatusChange}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'cv-tailor' && <CVTailor onNavigateToDocuments={handleNavigateToDocuments} />}
            {activeTab === 'documents' && <Documents />}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 mx-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sign Out</h3>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* View Application Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">{viewingApp.logo}</div>
                {viewingApp.role}
              </h3>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">{viewingApp.company}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">{viewingApp.location || '—'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">{viewingApp.salary || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Applied</label>
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">{viewingApp.date}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <div className={`w-full px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(viewingApp.status)}`}>{viewingApp.status}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                {viewingApp.jobUrl ? (
                  <a href={viewingApp.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors truncate">
                    <ExternalLink size={14} className="flex-shrink-0" /> <span className="truncate">{viewingApp.jobUrl}</span>
                  </a>
                ) : (
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400">No URL provided</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 min-h-[80px] whitespace-pre-wrap">
                  {viewingApp.notes || <span className="text-slate-400 italic">No notes added</span>}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {deleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600 font-medium">Delete?</span>
                    <button onClick={handleDeleteApplication} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Yes</button>
                    <button onClick={() => setDeleteConfirm(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-300">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium"><Trash2 size={14} /> Delete</button>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setViewingApp(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium">Close</button>
                  <button onClick={() => { setEditingApp(viewingApp); setViewingApp(null); }} className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium shadow-sm shadow-purple-200">
                    <Edit2 size={16} /> Edit
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Application Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Edit2 size={20} className="text-purple-600" /> Edit Application</h3>
              <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditApp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input type="text" name="role" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.role} onChange={handleEditFormChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input type="text" name="company" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.company} onChange={handleEditFormChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" name="location" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.location} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input type="text" name="salary" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.salary} onChange={handleEditFormChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date Applied</label>
                  <input type="text" name="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.date} onChange={handleEditFormChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.status} onChange={handleEditFormChange}>
                    {COLUMNS.map(col => (<option key={col.id} value={col.id}>{col.label}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input type="url" name="jobUrl" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.jobUrl || ''} onChange={handleEditFormChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={editingApp.notes || ''} onChange={handleEditFormChange}></textarea>
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => setEditingApp(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium shadow-sm shadow-purple-200">
                  <Edit2 size={16} /> Save Changes
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add New Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddApp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <input type="text" name="role" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Senior Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
                <input type="text" name="company" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Google" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input type="text" name="location" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Remote" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                  <input type="text" name="salary" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., £120k" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select name="status" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm">
                  {COLUMNS.map(col => (<option key={col.id} value={col.id}>{col.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input type="url" name="jobUrl" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea name="notes" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Any notes about this application..."></textarea>
              </div>
              <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium shadow-sm shadow-purple-200">
                  <Plus size={16} /> Add Application
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;