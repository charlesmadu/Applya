import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, MapPin, Calendar, DollarSign } from 'lucide-react';

import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core'; 
import type { IApplication } from '../types';

interface ApplicationsProps {
  applications: IApplication[];
  setApplications: React.Dispatch<React.SetStateAction<IApplication[]>>;
  onViewApp: (app: IApplication) => void;
  onEditApp: (app: IApplication) => void;
  onAddApp: () => void;
  onStatusChange: (appId: number, newStatus: IApplication['status']) => Promise<void>;
  isLoading: boolean;
}

const COLUMNS = [
  { id: 'Applied', label: 'Applied', color: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30' },
  { id: 'Interview', label: 'Interview', color: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30' },
  { id: 'Offer', label: 'Offer', color: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30' },
  { id: 'Rejected', label: 'Rejected', color: 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700' },
];

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
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-all hover:border-purple-200 dark:hover:border-purple-700 cursor-pointer ${isDragging ? 'shadow-xl ring-2 ring-purple-500 cursor-grabbing' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-sm">
          {app.logo}
        </div>
        <button 
          onClick={handleEditClick}
          className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 p-1 rounded transition-all"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <h4 className="font-bold text-slate-800 dark:text-white mb-0.5 text-base">{app.role}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">{app.company}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
          <MapPin size={12} className="text-slate-400 dark:text-slate-500" /> {app.location}
        </div>
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
          <DollarSign size={12} className="text-slate-400 dark:text-slate-500" /> {app.salary}
        </div>
        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 gap-2 pt-3 border-t border-slate-50 dark:border-slate-700 mt-3">
          <Calendar size={12} /> Applied {app.date}
        </div>
      </div>
    </div>
  );
});

const DroppableColumn: React.FC<{ columnId: IApplication['status'], label: string, color: string, children: React.ReactNode }> = ({ columnId, label, color, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: 'Column', columnId },
  });

  return (
    <div ref={setNodeRef} className={`flex flex-col gap-4 min-w-[260px] ${isOver ? 'bg-purple-100/50 dark:bg-purple-900/20 rounded-xl' : ''}`}>
      <div className={`flex items-center justify-between p-3 rounded-lg border border-b-4 ${color}`}>
        <span className="font-bold">{label}</span>
        <span className="bg-white/60 dark:bg-slate-800/60 px-2 py-0.5 rounded text-xs font-bold">
          {React.Children.count(children)}
        </span>
      </div>
      <div className="flex flex-col gap-3 min-h-[100px] p-1">
        {children}
      </div>
    </div>
  );
};

const Applications = ({ applications, setApplications, onViewApp, onEditApp, onAddApp, onStatusChange, isLoading }: ApplicationsProps) => {
  const [searchTerm, setSearchTerm] = useState('');

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
      const draggedAppId = active.id as number;
      const currentApp = applications.find(app => app.id === draggedAppId);
      if (currentApp && currentApp.status === newStatus) return;
      
      onStatusChange(draggedAppId, newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 dark:border-purple-800 border-t-purple-700 dark:border-t-purple-400 rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Applications</h2>
          <p className="text-slate-500 dark:text-slate-400">Track your job search pipeline</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={onAddApp}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Application</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-4">
            <Plus size={32} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No applications yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
            Start tracking your job search by adding your first application. Click the button below to get started!
          </p>
          <button 
            onClick={onAddApp}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Your First Application
          </button>
        </div>
      ) : (
        /* Kanban Board */
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
            {COLUMNS.map(column => (
              <DroppableColumn key={column.id} columnId={column.id as IApplication['status']} label={column.label} color={column.color}>
                {filteredApps.filter(app => app.status === column.id).map(app => (
                  <DraggableApplicationCard key={app.id} app={app} onOpenDetail={onViewApp} onOpenEdit={onEditApp} />
                ))}
                {filteredApps.filter(app => app.status === column.id).length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center text-slate-400 dark:text-slate-500 text-sm">No applications</div>
                )}
              </DroppableColumn>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
};

export default Applications;