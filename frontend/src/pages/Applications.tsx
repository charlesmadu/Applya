import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, MapPin, Calendar, DollarSign, Edit2, X } from 'lucide-react';
import Card from '../components/Card';

// FIX: Correctly imports the components and types from @dnd-kit/core
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'; 

// Define Application type 
interface IApplication {
  id: UniqueIdentifier; // Changed to UniqueIdentifier for DND compatibility
  role: string;
  company: string;
  location: string;
  salary: string;
  date: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  logo: string;
}

// Mock Data
const initialAppsData: IApplication[] = [
  { id: 1, role: 'Senior Frontend Dev', company: 'Google', location: 'London, UK', salary: '£120k', date: 'Oct 24', status: 'Interview', logo: 'G' },
  { id: 2, role: 'UI Engineer', company: 'Netflix', location: 'Remote', salary: '£140k', date: 'Oct 22', status: 'Applied', logo: 'N' },
  { id: 3, role: 'Full Stack Dev', company: 'Amazon', location: 'Dublin, IE', salary: '£110k', date: 'Oct 20', status: 'Rejected', logo: 'A' },
  { id: 4, role: 'React Developer', company: 'Meta', location: 'London, UK', salary: '£130k', date: 'Oct 18', status: 'Offer', logo: 'M' },
  { id: 5, role: 'Software Engineer', company: 'Spotify', location: 'Stockholm, SE', salary: '£115k', date: 'Oct 25', status: 'Applied', logo: 'S' },
  { id: 6, role: 'Backend Engineer', company: 'Apple', location: 'Cupertino, US', salary: '£150k', date: 'Oct 26', status: 'Applied', logo: 'A' },
];

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'text-blue-700 border-blue-200 bg-blue-50' },
  { id: 'Interview', label: 'Interview', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  { id: 'Offer', label: 'Offer', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
  { id: 'Rejected', label: 'Rejected', color: 'text-slate-600 border-slate-200 bg-slate-50' },
];

// --- Sub-component for Draggable Card ---
// The component is wrapped in React.memo to prevent unnecessary re-renders
const DraggableApplicationCard: React.FC<{ app: IApplication, handleOpenEditModal: (app: IApplication) => void }> = React.memo(({ app, handleOpenEditModal }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: {
      type: 'Application',
      app: app,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 10,
    cursor: 'grabbing',
    opacity: isDragging ? 0.7 : 1,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`p-4 hover:shadow-lg transition-all cursor-grab border-slate-200 hover:border-purple-200 ${isDragging ? 'shadow-xl ring-2 ring-purple-500' : ''}`}
      {...listeners}
      {...attributes}
    >
        <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                {app.logo}
            </div>
            <button 
                onClick={(e) => { e.preventDefault(); handleOpenEditModal(app); }}
                className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-1 rounded transition-all"
            >
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
  );
});


// --- Sub-component for Droppable Column ---
const DroppableColumn: React.FC<{ columnId: IApplication['status'], label: string, color: string, children: React.ReactNode }> = ({ columnId, label, color, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      type: 'Column',
      columnId: columnId,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col gap-4 min-w-[260px] ${isOver ? 'bg-purple-100/50 rounded-xl' : ''}`}
    >
        {/* Column Header */}
        <div className={`flex items-center justify-between p-3 rounded-lg border border-b-4 ${color} bg-white`}>
            <span className="font-bold">{label}</span>
            <span className="bg-white bg-opacity-60 px-2 py-0.5 rounded text-xs font-bold">
                {React.Children.count(children)}
            </span>
        </div>
        
        {/* Cards Container */}
        <div className="flex flex-col gap-3 min-h-[100px] p-1">
            {children}
        </div>
    </div>
  );
};


// --- Main Applications Component ---
const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<IApplication[]>(initialAppsData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [editingApp, setEditingApp] = useState<IApplication | null>(null);

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEditModal = (app: IApplication) => {
    setEditingApp(app);
  };
  
  const handleEditApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    // FIX: Ensure we are updating state correctly after changes in the form.
    setApplications(prevApps => prevApps.map(app => app.id === editingApp.id ? editingApp : app));
    console.log("Application updated:", editingApp);
    setEditingApp(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingApp) return;
    const { name, value } = e.target;
    
    setEditingApp(prev => {
        if (!prev) return null;
        if (name === 'status') {
            return { ...prev, [name]: value as IApplication['status'] };
        }
        return { ...prev, [name]: value };
    });
  };

  const handleEditTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Assuming 'Notes' field in edit modal, which is not currently present in Application type but is a common extension.
      // We'll skip implementing this for IApplication fields but keep the pattern.
  };

  const handleSubmitNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, logic to add the new app to the state and backend API would go here.
    console.log("Mock application added!");
    setIsAddModalOpen(false);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    
    // Check if the item was dropped over a valid droppable area (a column)
    // and if the dropped item is an Application
    if (over && active.data.current?.type === 'Application') {
        const newStatus = over.id as IApplication['status'];
        const draggedAppId = active.id;

        // Prevent dropping on the same column
        const currentApp = applications.find(app => app.id === draggedAppId);
        if (currentApp && currentApp.status === newStatus) return;
        
        // Update the application status in the local state
        setApplications(prevApps => 
            prevApps.map(app => 
                app.id === draggedAppId ? { ...app, status: newStatus } : app
            )
        );
        console.log(`Application ${draggedAppId} moved to ${newStatus}`);
    }
  };


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
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200 whitespace-nowrap"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Application</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>
        </div>

        {/* Kanban Board Wrapper */}
        <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
                {COLUMNS.map(column => (
                    <DroppableColumn 
                        key={column.id}
                        columnId={column.id as IApplication['status']}
                        label={column.label}
                        color={column.color}
                    >
                        {filteredApps
                            .filter(app => app.status === column.id)
                            .map(app => (
                                <DraggableApplicationCard 
                                    key={app.id} 
                                    app={app} 
                                    handleOpenEditModal={handleOpenEditModal} 
                                />
                            ))
                        }
                        {filteredApps.filter(app => app.status === column.id).length === 0 && (
                             <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400 text-sm">
                                No applications
                             </div>
                        )}
                    </DroppableColumn>
                ))}
            </div>
        </DndContext>

        {/* --- Modals (Add New and Edit) --- */}
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-xl font-bold text-slate-800">Add New Application</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmitNewApp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Senior Frontend Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Google" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Remote or London, UK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary (Optional)</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., £120k" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Applied</label>
                        <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" defaultValue={new Date().toISOString().substring(0, 10)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm">
                            {COLUMNS.map(col => (
                                <option key={col.id} value={col.id}>{col.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Posting URL (Optional)</label>
                  <input type="url" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Paste the full job link here" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                  <textarea rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Key contacts, next steps, etc."></textarea>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200"
                  >
                    <Plus size={16} /> Save Application
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Edit2 size={20} className="text-purple-600" /> Edit Application
                </h3>
                <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditApp} className="space-y-4">
                {/* Form fields pre-filled with editingApp data */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input 
                      type="text" 
                      name="role"
                      required 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                      defaultValue={editingApp.role} 
                      onChange={handleEditFormChange}
                      placeholder="e.g., Senior Frontend Developer" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input 
                      type="text" 
                      name="company"
                      required 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                      defaultValue={editingApp.company} 
                      onChange={handleEditFormChange}
                      placeholder="e.g., Google" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                        type="text" 
                        name="location"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                        defaultValue={editingApp.location} 
                        onChange={handleEditFormChange}
                        placeholder="e.g., Remote or London, UK" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Salary (Optional)</label>
                    <input 
                        type="text" 
                        name="salary"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                        defaultValue={editingApp.salary} 
                        onChange={handleEditFormChange}
                        placeholder="e.g., £120k" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Applied</label>
                        <input 
                            type="text" 
                            name="date"
                            required 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                            defaultValue={editingApp.date} 
                            onChange={handleEditFormChange}
                            placeholder="e.g., Oct 24" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select 
                            name="status"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" 
                            defaultValue={editingApp.status}
                            onChange={handleEditFormChange}
                        >
                            {COLUMNS.map(col => (
                                <option key={col.id} value={col.id}>{col.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingApp(null)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200"
                  >
                    <Edit2 size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
    </div>
  );
};

export default Applications;