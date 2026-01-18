import React, { useState } from 'react';
import Card from '../components/Card';
import Applications from './Applications';
import CVTailor from './CVTailor';
import Documents from './Documents';
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
  Calendar
} from 'lucide-react';

// Shared Application Type
export interface IApplication {
  id: number;
  role: string;
  company: string;
  location: string;
  salary: string;
  date: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  logo: string;
  jobUrl?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
}

// Initial data
const initialAppsData: IApplication[] = [
  { id: 1, role: 'Senior Frontend Dev', company: 'Google', location: 'London, UK', salary: '£120k', date: 'Oct 24', status: 'Interview', logo: 'G', jobUrl: 'https://careers.google.com/jobs/123', notes: 'Had initial phone screen. Technical interview scheduled for next week.', contactName: 'Sarah Chen', contactEmail: 'sarah.chen@google.com' },
  { id: 2, role: 'UI Engineer', company: 'Netflix', location: 'Remote', salary: '£140k', date: 'Oct 22', status: 'Applied', logo: 'N', jobUrl: 'https://jobs.netflix.com/456', notes: 'Applied through referral from John.' },
  { id: 3, role: 'Full Stack Dev', company: 'Amazon', location: 'Dublin, IE', salary: '£110k', date: 'Oct 20', status: 'Rejected', logo: 'A', notes: 'Rejected after final round. Feedback: need more system design experience.' },
  { id: 4, role: 'React Developer', company: 'Meta', location: 'London, UK', salary: '£130k', date: 'Oct 18', status: 'Offer', logo: 'M', jobUrl: 'https://metacareers.com/789', notes: 'Offer received! £130k base + equity. Need to respond by Nov 1.', contactName: 'Mike Johnson', contactEmail: 'mike.j@meta.com' },
  { id: 5, role: 'Software Engineer', company: 'Spotify', location: 'Stockholm, SE', salary: '£115k', date: 'Oct 25', status: 'Applied', logo: 'S' },
  { id: 6, role: 'Backend Engineer', company: 'Apple', location: 'Cupertino, US', salary: '£150k', date: 'Oct 26', status: 'Applied', logo: 'A', jobUrl: 'https://apple.com/careers' },
];

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
const WeeklyTracker = () => {
  const data = [
    { day: 'Mon', count: 2 },
    { day: 'Tue', count: 5 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 4 },
    { day: 'Sat', count: 1 },
    { day: 'Sun', count: 0 },
  ];
  const max = Math.max(...data.map(d => d.count));

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Weekly Activity</h3>
          <p className="text-sm text-slate-500">Applications sent last 7 days</p>
        </div>
        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
          <TrendingUp size={14} className="mr-1" /> +12%
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState<IApplication[]>(initialAppsData);
  const [viewingApp, setViewingApp] = useState<IApplication | null>(null);
  const [editingApp, setEditingApp] = useState<IApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Calculate stats from applications
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'cv-tailor', label: 'AI CV Tailor', icon: Sparkles },
    { id: 'documents', label: 'My Documents', icon: FileText },
  ];

  const handleNavigateToDocuments = () => setActiveTab('documents');
  const handleNavigateToCVTailor = () => setActiveTab('cv-tailor');

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingApp) return;
    const { name, value } = e.target;
    setEditingApp(prev => {
      if (!prev) return null;
      if (name === 'status') return { ...prev, [name]: value as IApplication['status'] };
      return { ...prev, [name]: value };
    });
  };

  const handleEditApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    setApplications(prev => prev.map(app => app.id === editingApp.id ? editingApp : app));
    setEditingApp(null);
  };

  const handleDeleteApplication = () => {
    if (!viewingApp) return;
    setApplications(prev => prev.filter(app => app.id !== viewingApp.id));
    setViewingApp(null);
    setDeleteConfirm(false);
  };

  const handleAddApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApp: IApplication = {
      id: Date.now(),
      role: formData.get('role') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string || 'Remote',
      salary: formData.get('salary') as string || 'Not specified',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: formData.get('status') as IApplication['status'] || 'Applied',
      logo: (formData.get('company') as string)?.[0]?.toUpperCase() || 'C',
      jobUrl: formData.get('jobUrl') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    };
    setApplications(prev => [newApp, ...prev]);
    setIsAddModalOpen(false);
  };

  // Recent applications for the table (last 4)
  const recentApps = [...applications].slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-start px-6 border-b border-slate-100">
            <img className="w-8 h-8 flex mr-1" src='/images/applyr-logo.svg'/>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Applyr</span>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
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
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">AJ</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Alex Johnson</p>
                <p className="text-xs text-slate-500 truncate">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
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
                {/* Stats */}
                <section>
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">At a Glance</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Applied" value={String(stats.total)} icon={Briefcase} colorClass="bg-blue-50 text-blue-600" trend="+4" />
                    <StatCard title="In Progress" value={String(stats.applied + stats.interview)} icon={Clock} colorClass="bg-amber-50 text-amber-600" />
                    <StatCard title="Interviews" value={String(stats.interview)} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" />
                    <StatCard title="Rejected" value={String(stats.rejected)} icon={XCircle} colorClass="bg-slate-100 text-slate-600" />
                  </div>
                </section>

                {/* Charts & AI Tool */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">
                  <div className="lg:col-span-2 h-full"><WeeklyTracker /></div>
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
              </div>
            )}

            {activeTab === 'applications' && (
              <Applications 
                applications={applications} 
                setApplications={setApplications}
                onViewApp={setViewingApp}
                onEditApp={setEditingApp}
                onAddApp={() => setIsAddModalOpen(true)}
              />
            )}

            {activeTab === 'cv-tailor' && <CVTailor onNavigateToDocuments={handleNavigateToDocuments} />}
            {activeTab === 'documents' && <Documents />}
          </div>
        </main>
      </div>

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