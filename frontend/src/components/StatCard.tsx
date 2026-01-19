import React from 'react'
import Card from './Card';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    colorClass: string;
    trend?: string;
}

const StatCard = ({ title, value, icon: Icon, colorClass }: {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass: string;
}) => (
  <Card className="p-4 flex flex-col justify-between hover:shadow-md dark:hover:shadow-purple-900/20 transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-3">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{title}</p>
    </div>
  </Card>
);

export default StatCard;
