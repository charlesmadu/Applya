import React, { useState, useRef } from 'react';
import { Plus, Search, FileText, UploadCloud, Trash2, Download, X, File, AlertCircle } from 'lucide-react';
import Card from '../components/Card';

interface Document {
  id: number;
  name: string;
  type: 'Resume' | 'Cover Letter' | 'Certification' | 'Reference' | 'Other';
  size: string;
  date: string;
}

// Mock data for documents
const initialDocuments: Document[] = [
  { id: 1, name: 'My_Master_Resume_v4.pdf', type: 'Resume', size: '1.2 MB', date: 'Oct 24, 2025' },
  { id: 2, name: 'Cover_Letter_Google.docx', type: 'Cover Letter', size: '0.8 MB', date: 'Oct 25, 2025' },
  { id: 3, name: 'Cert_AWS_SAA.pdf', type: 'Certification', size: '0.5 MB', date: 'Oct 20, 2025' },
  { id: 4, name: 'Reference_Letter_Smith.pdf', type: 'Reference', size: '0.6 MB', date: 'Oct 18, 2025' },
];

const DOCUMENT_TYPES: Document['type'][] = ['Resume', 'Cover Letter', 'Certification', 'Reference', 'Other'];

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Form state for new document
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<Document['type']>('Resume');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleFileSelect = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, DOCX, or TXT files.');
      return;
    }
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
      if (!isUploadModalOpen) setIsUploadModalOpen(true);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newDoc: Document = {
      id: Date.now(),
      name: selectedFile.name,
      type: docType,
      size: formatFileSize(selectedFile.size),
      date: formatDate(new Date()),
    };

    setDocuments(prev => [newDoc, ...prev]);
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setDocType('Resume');
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setDeleteConfirm(null);
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setDocType('Resume');
    setIsUploadModalOpen(true);
  };

  const getTypeColor = (type: Document['type']) => {
    const colors: Record<Document['type'], string> = {
      'Resume': 'text-purple-600 bg-purple-50 border-purple-100',
      'Cover Letter': 'text-blue-600 bg-blue-50 border-blue-100',
      'Certification': 'text-emerald-600 bg-emerald-50 border-emerald-100',
      'Reference': 'text-amber-600 bg-amber-50 border-amber-100',
      'Other': 'text-slate-600 bg-slate-50 border-slate-100',
    };
    return colors[type];
  };

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
          <button 
            onClick={openUploadModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm shadow-purple-200 whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Upload New</span>
            <span className="sm:hidden">Upload</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openUploadModal}
        className={`p-8 border-2 border-dashed rounded-xl text-center bg-white cursor-pointer transition-all ${
          dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
        }`}
      >
        <UploadCloud size={32} className={`mx-auto mb-2 ${dragActive ? 'text-purple-500' : 'text-slate-400'}`} />
        <p className="font-semibold text-slate-700">Drag & drop your files here, or click to browse</p>
        <p className="text-sm text-slate-500">Max file size: 5MB. Supported formats: PDF, DOCX, TXT.</p>
      </div>

      {/* Documents Table */}
      <Card className="overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <File size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No documents found</h3>
            <p className="text-slate-500 text-sm">
              {searchTerm ? 'Try a different search term' : 'Upload your first document to get started'}
            </p>
          </div>
        ) : (
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-slate-400" />
                        <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                          {doc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{doc.size}</td>
                    <td className="px-6 py-4 text-slate-500">{doc.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50" 
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        {deleteConfirm === doc.id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-lg px-2">
                            <span className="text-xs text-red-600 font-medium">Delete?</span>
                            <button 
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-700 p-1 font-bold text-xs"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)}
                              className="text-slate-500 hover:text-slate-700 p-1 font-bold text-xs"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirm(doc.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Document count */}
      <p className="text-sm text-slate-500 text-center">
        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} 
        {searchTerm && ` matching "${searchTerm}"`}
      </p>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UploadCloud size={20} className="text-purple-600" /> Upload Document
              </h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4">
              {/* File Selection Area */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
                  >
                    <UploadCloud size={24} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600">Click to select a file</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or TXT (max 5MB)</p>
                  </button>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as Document['type'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Your documents are stored securely and only visible to you. They can be attached to job applications.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFile
                      ? 'bg-purple-700 text-white hover:bg-purple-800 shadow-sm shadow-purple-200'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <UploadCloud size={16} />
                  Upload Document
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Documents;