import React, { useState } from 'react';
import { Plus, Search, FileText, UploadCloud, Trash2, Download } from 'lucide-react';
import Card from '../components/Card';

// Mock data for documents
const initialDocuments = [
  { id: 1, name: 'My_Master_Resume_v4.pdf', type: 'Resume', size: '1.2 MB', date: 'Oct 24, 2025' },
  { id: 2, name: 'Cover_Letter_Google.docx', type: 'Cover Letter', size: '0.8 MB', date: 'Oct 25, 2025' },
  { id: 3, name: 'Cert_AWS_SAA.pdf', type: 'Certification', size: '0.5 MB', date: 'Oct 20, 2025' },
  { id: 4, name: 'Reference_Letter_Smith.pdf', type: 'Reference', size: '0.6 MB', date: 'Oct 18, 2025' },
];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = initialDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-purple-600" /> My Documents
          </h2>
          <p className="text-slate-500">Manage your resumes, cover letters, and certifications in one place.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200 whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden sm:inline">Upload New</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone Placeholder */}
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center bg-white hover:border-purple-500 transition-colors cursor-pointer">
        <UploadCloud size={32} className="mx-auto mb-2 text-slate-400" />
        <p className="font-semibold text-slate-700">Drag & drop your files here, or click to browse</p>
        <p className="text-sm text-slate-500">Max file size: 5MB. Supported formats: PDF, DOCX, TXT.</p>
      </div>

      {/* Documents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 font-medium">File Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium">Date Uploaded</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 whitespace-nowrap">{doc.type}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.size}</td>
                  <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100" title="Download">
                            <Download size={18} />
                        </button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-slate-100" title="Delete">
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Documents;