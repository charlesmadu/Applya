import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import WeeklyTracker from '../components/WeeklyTracker';
import AICVTailor from '../components/AICVTailor';
import JobBoardWidget from '../components/JobBoardWidget';
import ApplicationTable from '../components/ApplicationTable';
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
  XCircle
} from 'lucide-react';




const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'cv-tailor', label: 'AI CV Tailor', icon: Sparkles },
    { id: 'documents', label: 'My Documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">

          <div className="h-16 flex items-center justify-start px-6 border-b border-slate-100">
            <img className="w-8 h-8 flex mr-1" src='/images/applyr-logo.svg'/>
            <span className="text-xl font-bold text-slate-800 tracking-tight">Applyr</span>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon size={18} className={`mr-3 ${activeTab === item.id ? 'text-purple-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                AJ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Alex Johnson</p>
                <p className="text-xs text-slate-500 truncate">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-slate-500">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-purple-500 w-64 outline-none transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* 2. Stats Grid Section */}
            {activeTab == 'dashboard' && (

              <div className='flex flex-col gap-8'>

              <section>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">At a Glance</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    title="Total Applied" 
                    value="24" 
                    icon={Briefcase} 
                    colorClass="bg-blue-50 text-blue-600"
                    trend="+4"
                  />
                  <StatCard 
                    title="In Progress" 
                    value="8" 
                    icon={Clock} 
                    colorClass="bg-amber-50 text-amber-600"
                  />
                  <StatCard 
                    title="Interviews" 
                    value="3" 
                    icon={CheckCircle} 
                    colorClass="bg-emerald-50 text-emerald-600"
                  />
                  <StatCard 
                    title="Rejected" 
                    value="12" 
                    icon={XCircle} 
                    colorClass="bg-slate-100 text-slate-600"
                  />
                </div>
              </section>

              {/* 3. Analytics & Tools Section (New) */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-96">
                <div className="lg:col-span-2 h-full">
                  <WeeklyTracker />
                </div>
                <div className="h-full">
                  <AICVTailor />
                </div>
              </section>

              {/* 4. Applications & Job Board Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
                <div className="lg:col-span-2">
                  <ApplicationTable />
                </div>
                <div className="lg:col-span-1">
                  <JobBoardWidget />
                </div>
              </section>

              </div>
            )}

            {activeTab === 'applications' && (
              <Applications/>
            )}

            {activeTab === 'cv-tailor' && (
              <CVTailor />
            )}

            {activeTab === 'documents' && (
              <Documents />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;