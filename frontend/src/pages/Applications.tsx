import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, MapPin, Calendar, DollarSign } from 'lucide-react';
import Card from '../components/Card';

// Mock data mimicking your backend structure
const initialApps = [
  { id: 1, role: 'Senior Frontend Dev', company: 'Google', location: 'London, UK', salary: '$120k', date: 'Oct 24', status: 'Interview', logo: 'G' },
  { id: 2, role: 'UI Engineer', company: 'Netflix', location: 'Remote', salary: '$140k', date: 'Oct 22', status: 'Applied', logo: 'N' },
  { id: 3, role: 'Full Stack Dev', company: 'Amazon', location: 'Dublin, IE', salary: '$110k', date: 'Oct 20', status: 'Rejected', logo: 'A' },
  { id: 4, role: 'React Developer', company: 'Meta', location: 'London, UK', salary: '$130k', date: 'Oct 18', status: 'Offer', logo: 'M' },
  { id: 5, role: 'Software Engineer', company: 'Spotify', location: 'Stockholm, SE', salary: '$115k', date: 'Oct 25', status: 'Applied', logo: 'S' },
];

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'text-blue-700 border-blue-200 bg-blue-50' },
  { id: 'Interview', label: 'Interview', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  { id: 'Offer', label: 'Offer', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
  { id: 'Rejected', label: 'Rejected', color: 'text-slate-600 border-slate-200 bg-slate-50' },
];

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = initialApps.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">My Applications</h2>
                <p className="text-slate-500">Track your job search pipeline</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:flex-initial">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search jobs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200 whitespace-nowrap">
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Application</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map(column => (
                <div key={column.id} className="flex flex-col gap-4 min-w-[260px]">
                    {/* Column Header */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border border-b-4 ${column.color} bg-white`}>
                        <span className="font-bold">{column.label}</span>
                        <span className="bg-white bg-opacity-60 px-2 py-0.5 rounded text-xs font-bold">
                            {filteredApps.filter(app => app.status === column.id).length}
                        </span>
                    </div>
                    
                    {/* Cards Container */}
                    <div className="flex flex-col gap-3">
                        {filteredApps
                            .filter(app => app.status === column.id)
                            .map(app => (
                                <Card key={app.id} className="p-4 hover:shadow-md transition-all cursor-pointer group border-slate-200 hover:border-purple-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                                            {app.logo}
                                        </div>
                                        <button className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-all">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-slate-800 mb-0.5 text-base">{app.role}</h4>
                                    <p className="text-sm text-slate-500 font-medium mb-3">{app.company}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-xs text-slate-500 gap-2">
                                            <MapPin size={12} className="text-slate-400" /> {app.location}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500 gap-2">
                                            <DollarSign size={12} className="text-slate-400" /> {app.salary}
                                        </div>
                                        <div className="flex items-center text-xs text-slate-400 gap-2 pt-3 border-t border-slate-50 mt-3">
                                            <Calendar size={12} /> Applied {app.date}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        }
                        {filteredApps.filter(app => app.status === column.id).length === 0 && (
                             <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400 text-sm">
                                No applications
                             </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Applications;