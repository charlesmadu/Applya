import React, { useState } from 'react';
import { Sparkles, FileText, Clock, Download, Copy, AlertCircle } from 'lucide-react';
import Card from '../components/Card';

const CVTailor = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock function to simulate generation
  const handleGenerate = () => {
    if (!jobDescription) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2500);
  };

  const recentGenerations = [
    { id: 1, role: 'Senior Frontend Dev', company: 'Google', date: '2 mins ago', status: 'Ready' },
    { id: 2, role: 'Product Designer', company: 'Spotify', date: '2 days ago', status: 'Ready' },
    { id: 3, role: 'Full Stack Engineer', company: 'Netflix', date: '5 days ago', status: 'Ready' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" /> AI CV Tailor
        </h2>
        <p className="text-slate-500">Customize your resume for specific job descriptions to increase your match score.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Left Column: Main Input Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 h-full flex flex-col">
            <div className="space-y-6 flex-1">
              
              {/* Resume Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Select Base Resume</label>
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600 group-hover:border-purple-200 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">My_Master_Resume_v4.pdf</p>
                      <p className="text-xs text-slate-500">Updated Oct 24, 2023 • 1.2 MB</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline">Change</button>
                </div>
              </div>

              {/* Job Description Input */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-slate-700">2. Job Description</label>
                    <button 
                        className="text-xs text-slate-400 hover:text-purple-600 transition-colors"
                        onClick={() => setJobDescription('')}
                    >
                        Clear
                    </button>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (Responsibilities, Requirements, etc.)..."
                  className="w-full h-64 flex-1 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Action Button */}
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !jobDescription}
                className={`w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isGenerating || !jobDescription 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-purple-700 hover:bg-purple-800 shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate Tailored CV
                  </>
                )}
              </button>

            </div>
          </Card>
        </div>

        {/* Right Column: History & Tips */}
        <div className="space-y-6 flex flex-col">
          
          {/* Recent History Widget */}
          <Card className="p-0 overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Recent History
              </h3>
            </div>
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
              {recentGenerations.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-slate-800 text-sm group-hover:text-purple-700 transition-colors">{item.role}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-bold border border-green-100">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 font-medium">{item.company}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Download PDF">
                        <Download size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Duplicate">
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 text-center bg-white">
              <button className="text-xs font-medium text-slate-500 hover:text-purple-600 transition-colors">View All History</button>
            </div>
          </Card>

          {/* Pro Tip Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wide opacity-90">
              <AlertCircle size={16} className="text-yellow-300" /> Pro Tip
            </h3>
            <p className="text-sm text-indigo-50 leading-relaxed">
              Copying the <strong>"About Us"</strong> section from the company website into the job description often improves the cultural fit score of your generated CV.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CVTailor;