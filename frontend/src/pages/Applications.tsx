import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, MapPin, Calendar, DollarSign } from 'lucide-react';

import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'; 

interface IApplication {
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

interface ApplicationsProps {
  applications: IApplication[];
  setApplications: React.Dispatch<React.SetStateAction<IApplication[]>>;
  onViewApp: (app: IApplication) => void;
  onEditApp: (app: IApplication) => void;
  onAddApp: () => void;
}

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'text-blue-700 border-blue-200 bg-blue-50' },
  { id: 'Interview', label: 'Interview', color: 'text-amber-700 border-amber-200 bg-amber-50' },
  { id: 'Offer', label: 'Offer', color: 'text-emerald-700 border-emerald-200 bg-emerald-50' },
  { id: 'Rejected', label: 'Rejected', color: 'text-slate-600 border-slate-200 bg-slate-50' },
];

// --- Draggable Card Component ---
const DraggableApplicationCard: React.FC<{ 
  app: IApplication, 
  onOpenDetail: (app: IApplication) => void,
  onOpenEdit: (app: IApplication) => void 
}> = React.memo(({ app, onOpenDetail, onOpenEdit }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { type: 'Application', app },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleCardClick = () => {
    // Only open detail if not dragging
    if (!isDragging) {
      onOpenDetail(app);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenEdit(app);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all hover:border-purple-200 cursor-pointer ${isDragging ? 'shadow-xl ring-2 ring-purple-500 cursor-grabbing' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
          {app.logo}
        </div>
        <button 
          onClick={handleEditClick}
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
    </div>
  );
});

// --- Droppable Column Component ---
const DroppableColumn: React.FC<{ columnId: IApplication['status'], label: string, color: string, children: React.ReactNode }> = ({ columnId, label, color, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: 'Column', columnId },
  });

  return (
    <div ref={setNodeRef} className={`flex flex-col gap-4 min-w-[260px] ${isOver ? 'bg-purple-100/50 rounded-xl' : ''}`}>
      <div className={`flex items-center justify-between p-3 rounded-lg border border-b-4 ${color} bg-white`}>
        <span className="font-bold">{label}</span>
        <span className="bg-white bg-opacity-60 px-2 py-0.5 rounded text-xs font-bold">
          {React.Children.count(children)}
        </span>
      </div>
      <div className="flex flex-col gap-3 min-h-[100px] p-1">
        {children}
      </div>
    </div>
  );
};

// --- Main Applications Component ---
const Applications = ({ applications, setApplications, onViewApp, onEditApp, onAddApp }: ApplicationsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Configure sensors - drag only activates after moving 8px
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active.data.current?.type === 'Application') {
      const newStatus = over.id as IApplication['status'];
      const draggedAppId = active.id;
      const currentApp = applications.find(app => app.id === draggedAppId);
      if (currentApp && currentApp.status === newStatus) return;
      setApplications(prev => prev.map(app => app.id === draggedAppId ? { ...app, status: newStatus } : app));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
            onClick={onAddApp}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200 whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
          {COLUMNS.map(column => (
            <DroppableColumn key={column.id} columnId={column.id as IApplication['status']} label={column.label} color={column.color}>
              {filteredApps.filter(app => app.status === column.id).map(app => (
                <DraggableApplicationCard key={app.id} app={app} onOpenDetail={onViewApp} onOpenEdit={onEditApp} />
              ))}
              {filteredApps.filter(app => app.status === column.id).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-slate-400 text-sm">No applications</div>
              )}
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      {/* --- Application Detail Modal --- */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                  {viewingApp.logo}
                </div>
                {viewingApp.role}
              </h3>
              <button onClick={() => setViewingApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
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
                  <a href={viewingApp.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors">
                    <ExternalLink size={14} /> {viewingApp.jobUrl}
                  </a>
                ) : (
                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400">No URL provided</div>
                )}
              </div>

              {(viewingApp.contactName || viewingApp.contactEmail) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                    <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800">{viewingApp.contactName || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                    {viewingApp.contactEmail ? (
                      <a href={`mailto:${viewingApp.contactEmail}`} className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-purple-600 hover:text-purple-700">{viewingApp.contactEmail}</a>
                    ) : (
                      <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400">—</div>
                    )}
                  </div>
                </div>
              )}
              
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
                  <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium">
                    <Trash2 size={14} /> Delete
                  </button>
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

      {/* --- Add Modal --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add New Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X size={20} /></button>
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
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="e.g., Remote" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
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
                    {COLUMNS.map(col => (<option key={col.id} value={col.id}>{col.label}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job URL</label>
                <input type="url" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm" placeholder="Key contacts, next steps..."></textarea>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 text-sm font-medium shadow-sm shadow-purple-200">
                  <Plus size={16} /> Save Application
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- Edit Modal --- */}
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
    </div>
  );
};

export default Applications;