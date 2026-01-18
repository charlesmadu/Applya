import React, { useState } from 'react';
import { Sparkles, FileText, Clock, Download, Copy, AlertCircle, ChevronDown, Check, Trash2, Eye, X } from 'lucide-react';
import Card from '../components/Card';

// Types
interface Document {
  id: number;
  name: string;
  type: 'Resume' | 'Cover Letter' | 'Certification' | 'Reference' | 'Other';
  size: string;
  date: string;
}

interface GeneratedCV {
  id: number;
  role: string;
  company: string;
  date: string;
  status: 'Ready' | 'Processing';
  baseResume: string;
  jobDescriptionPreview: string;
}

interface CVTailorProps {
  onNavigateToDocuments?: () => void;
}

// Mock uploaded resumes (in real app, this would come from shared state/context)
const uploadedResumes: Document[] = [
  { id: 1, name: 'My_Master_Resume_v4.pdf', type: 'Resume', size: '1.2 MB', date: 'Oct 24, 2025' },
  { id: 5, name: 'Software_Engineer_Resume.pdf', type: 'Resume', size: '0.9 MB', date: 'Oct 20, 2025' },
  { id: 6, name: 'Frontend_Dev_Resume.docx', type: 'Resume', size: '1.1 MB', date: 'Oct 15, 2025' },
];

const CVTailor = ({ onNavigateToDocuments }: CVTailorProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Document>(uploadedResumes[0]);
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewingCV, setViewingCV] = useState<GeneratedCV | null>(null);

  // Generated CVs history
  const [generatedCVs, setGeneratedCVs] = useState<GeneratedCV[]>([
    { id: 1, role: 'Senior Frontend Dev', company: 'Google', date: '2 mins ago', status: 'Ready', baseResume: 'My_Master_Resume_v4.pdf', jobDescriptionPreview: 'We are looking for a Senior Frontend Developer with 5+ years of experience in React...' },
    { id: 2, role: 'Product Designer', company: 'Spotify', date: '2 days ago', status: 'Ready', baseResume: 'My_Master_Resume_v4.pdf', jobDescriptionPreview: 'Join our design team to create beautiful user experiences...' },
    { id: 3, role: 'Full Stack Engineer', company: 'Netflix', date: '5 days ago', status: 'Ready', baseResume: 'Software_Engineer_Resume.pdf', jobDescriptionPreview: 'Netflix is seeking a Full Stack Engineer to help build the future of streaming...' },
  ]);

  // Extract role and company from job description (simple mock parsing)
  const parseJobDescription = (text: string): { role: string; company: string } => {
    const lines = text.split('\n').filter(l => l.trim());
    let role = 'Custom Role';
    let company = 'Company';

    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length < 50) {
        role = firstLine;
      }
    }

    const companyMatch = text.match(/(?:at|@|for)\s+([A-Z][a-zA-Z\s]+?)(?:\.|,|\n|$)/);
    if (companyMatch) {
      company = companyMatch[1].trim();
    }

    return { role: role.substring(0, 40), company: company.substring(0, 30) };
  };

  const handleGenerate = () => {
    if (!jobDescription || isGenerating) return;
    
    setIsGenerating(true);
    
    const { role, company } = parseJobDescription(jobDescription);
    
    setTimeout(() => {
      const newCV: GeneratedCV = {
        id: Date.now(),
        role: role || 'Tailored Resume',
        company: company || 'Target Company',
        date: 'Just now',
        status: 'Ready',
        baseResume: selectedResume.name,
        jobDescriptionPreview: jobDescription.substring(0, 150) + '...',
      };

      setGeneratedCVs(prev => [newCV, ...prev]);
      setIsGenerating(false);
      setJobDescription('');
    }, 2500);
  };

  const handleDeleteCV = (id: number) => {
    setGeneratedCVs(prev => prev.filter(cv => cv.id !== id));
    setDeleteConfirm(null);
  };

  const handleDownload = (cv: GeneratedCV) => {
    console.log('Downloading:', cv.role);
    alert(`Downloading: ${cv.role} - Tailored CV.pdf`);
  };

  const handleDuplicate = (cv: GeneratedCV) => {
    const duplicate: GeneratedCV = {
      ...cv,
      id: Date.now(),
      date: 'Just now',
      role: cv.role + ' (Copy)',
    };
    setGeneratedCVs(prev => [duplicate, ...prev]);
  };

  const handleUploadNewResume = () => {
    setIsResumeDropdownOpen(false);
    if (onNavigateToDocuments) {
      onNavigateToDocuments();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" /> AI CV Tailor
        </h2>
        <p className="text-slate-500">Customize your resume for specific job descriptions to increase your match score.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Main Input Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 flex flex-col">
            <div className="space-y-6 flex-1">
              
              {/* Resume Selection Dropdown */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1. Select Base Resume</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                    className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:border-purple-300 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-purple-600 group-hover:border-purple-200 transition-colors">
                        <FileText size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-slate-900">{selectedResume.name}</p>
                        <p className="text-xs text-slate-500">Updated {selectedResume.date} • {selectedResume.size}</p>
                      </div>
                    </div>
                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${isResumeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isResumeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-slate-100 bg-slate-50">
                        <p className="text-xs font-medium text-slate-500 uppercase">Your Resumes</p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {uploadedResumes.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 text-sm">
                            No resumes uploaded yet. Go to Documents to upload one.
                          </div>
                        ) : (
                          uploadedResumes.map(resume => (
                            <button
                              key={resume.id}
                              onClick={() => {
                                setSelectedResume(resume);
                                setIsResumeDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-3 hover:bg-purple-50 transition-colors ${
                                selectedResume.id === resume.id ? 'bg-purple-50' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={18} className="text-slate-400" />
                                <div className="text-left">
                                  <p className="font-medium text-slate-800 text-sm">{resume.name}</p>
                                  <p className="text-xs text-slate-500">{resume.size} • {resume.date}</p>
                                </div>
                              </div>
                              {selectedResume.id === resume.id && (
                                <Check size={18} className="text-purple-600" />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                      <div className="p-2 border-t border-slate-100 bg-slate-50">
                        <button 
                          onClick={handleUploadNewResume}
                          className="text-xs font-medium text-purple-600 hover:text-purple-700 w-full text-left"
                        >
                          + Upload new resume
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Input */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700">2. Job Description</label>
                  {jobDescription && (
                    <button 
                      className="text-xs text-slate-400 hover:text-purple-600 transition-colors"
                      onClick={() => setJobDescription('')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (Responsibilities, Requirements, etc.)..."
                  className="w-full h-64 flex-1 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-slate-50 outline-none transition-all placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {jobDescription.length} characters • Tip: Include the full job posting for best results
                </p>
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
                    Optimizing your CV...
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
          <Card className="p-0 overflow-hidden flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Recent History
              </h3>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                {generatedCVs.length} generated
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {generatedCVs.length === 0 ? (
                <div className="p-8 text-center">
                  <Sparkles size={32} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm text-slate-500">No CVs generated yet</p>
                  <p className="text-xs text-slate-400 mt-1">Your tailored CVs will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {generatedCVs.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-slate-800 text-sm group-hover:text-purple-700 transition-colors truncate pr-2">
                          {item.role}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${
                          item.status === 'Ready' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1 font-medium">{item.company}</p>
                      <p className="text-[10px] text-slate-400 mb-3">Base: {item.baseResume}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setViewingCV(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors" 
                            title="Preview"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDownload(item)}
                            className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" 
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => handleDuplicate(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          {deleteConfirm === item.id ? (
                            <div className="flex items-center gap-1 bg-red-50 rounded px-1">
                              <button 
                                onClick={() => handleDeleteCV(item.id)}
                                className="text-red-600 text-[10px] font-bold p-1"
                              >
                                Yes
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="text-slate-500 text-[10px] font-bold p-1"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setDeleteConfirm(item.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* Preview Modal */}
      {viewingCV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl p-6 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingCV.role}</h3>
                <p className="text-sm text-slate-500">{viewingCV.company} • Generated {viewingCV.date}</p>
              </div>
              <button 
                onClick={() => setViewingCV(null)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Base Resume Used</h4>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <FileText size={16} className="text-purple-600" />
                  <span className="text-sm text-slate-700">{viewingCV.baseResume}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Job Description Preview</h4>
                <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                  {viewingCV.jobDescriptionPreview}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-700">
                  <strong>Note:</strong> This is a preview. In the full version, you would see the complete tailored CV with highlighted changes and match score.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setViewingCV(null)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(viewingCV);
                    setViewingCV(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CVTailor;