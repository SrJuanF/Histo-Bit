"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import { useKYCProtection } from "../hooks/useKYCProtection";

interface Document {
  id: number;
  name: string;
  type: string;
  permissions: number;
  status: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  description?: string;
}

const initialDocuments: Document[] = [
  { 
    id: 1, 
    name: "Service Contract", 
    type: "Contract",
    permissions: 3, 
    status: "Active",
    createdBy: "John Smith",
    createdAt: "2024-01-15",
    lastModified: "2024-01-20",
    description: "Main service contract for the client"
  },
  { 
    id: 2, 
    name: "Monthly Invoice", 
    type: "Invoice",
    permissions: 1, 
    status: "Active",
    createdBy: "Mary Johnson",
    createdAt: "2024-01-18",
    lastModified: "2024-01-18",
    description: "Monthly service billing"
  },
  { 
    id: 3, 
    name: "Payment Receipt", 
    type: "Receipt",
    permissions: 2, 
    status: "Archived",
    createdBy: "Carl Lewis",
    createdAt: "2024-01-10",
    lastModified: "2024-01-12",
    description: "Payment confirmation received"
  },
  { 
    id: 4, 
    name: "User Manual", 
    type: "Manual",
    permissions: 5, 
    status: "Active",
    createdBy: "Anna Rodriguez",
    createdAt: "2024-01-05",
    lastModified: "2024-01-15",
    description: "System technical documentation"
  },
];

export default function DocumentsPage() {
  const { isKYCVerified, isLoading } = useKYCProtection();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    status: "Active"
  });

  if (isLoading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#10231c]">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="flex items-center justify-center flex-1">
            <div className="text-white text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isKYCVerified) {
    return null;
  }

  // Calculate statistics
  const totalDocuments = documents.length;
  const activeDocuments = documents.filter(doc => doc.status === "Active").length;
  const archivedDocuments = documents.filter(doc => doc.status === "Archived").length;
  const totalPermissions = documents.reduce((sum, doc) => sum + doc.permissions, 0);

  const handleAddDocument = () => {
    setEditingDocument(null);
    setFormData({
      name: "",
      type: "",
      description: "",
      status: "Active"
    });
    setShowModal(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setFormData({
      name: document.name,
      type: document.type,
      description: document.description || "",
      status: document.status
    });
    setShowModal(true);
  };

  const handleSaveDocument = () => {
    if (!formData.name.trim() || !formData.type.trim()) {
      alert("Please complete all required fields");
      return;
    }

    if (editingDocument) {
      // Edit existing document
      setDocuments(documents.map(doc => 
        doc.id === editingDocument.id 
          ? { 
              ...doc, 
              ...formData, 
              lastModified: new Date().toISOString().split('T')[0]
            }
          : doc
      ));
    } else {
      // Create new document
      const newDocument: Document = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        permissions: 0,
        status: formData.status,
        createdBy: "Current User",
        createdAt: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        description: formData.description
      };
      setDocuments([...documents, newDocument]);
    }

    setShowModal(false);
    setEditingDocument(null);
    setFormData({ name: "", type: "", description: "", status: "Active" });
  };

  const handleDeleteDocument = (id: number) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-[#019863]";
      case "Archived": return "text-[#8ecdb7]";
      case "Pending": return "text-[#ffa500]";
      default: return "text-white";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#019863]";
      case "Archived": return "bg-[#8ecdb7]";
      case "Pending": return "bg-[#ffa500]";
      default: return "bg-white";
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#10231c]"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            {/* Title and add button */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
                Document Management
              </p>
              <button
                onClick={handleAddDocument}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#019863] text-white text-sm font-medium leading-normal hover:bg-[#017a4f] transition-colors"
              >
                <span className="truncate">+ New Document</span>
              </button>
            </div>

            {/* Quick Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm font-medium">Total Documents</p>
                    <p className="text-white text-2xl font-bold">{totalDocuments}</p>
                  </div>
                  <div className="text-[#019863]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm font-medium">Active Documents</p>
                    <p className="text-white text-2xl font-bold">{activeDocuments}</p>
                  </div>
                  <div className="text-[#019863]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm font-medium">Archived</p>
                    <p className="text-white text-2xl font-bold">{archivedDocuments}</p>
                  </div>
                  <div className="text-[#8ecdb7]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224,48H160V40a24,24,0,0,0-24-24H120A24,24,0,0,0,96,40v8H32A16,16,0,0,0,16,64V208a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM112,40a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8v8H112Zm96,168H48V64H96v16a8,8,0,0,0,8,8h48a8,8,0,0,0,8-8V64h48Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm font-medium">Total Permissions</p>
                    <p className="text-white text-2xl font-bold">{totalPermissions}</p>
                  </div>
                  <div className="text-[#ffa500]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56A72,72,0,1,0,200,128,72.08,72.08,0,0,0,128,56Zm0,128a56,56,0,1,1,56-56A56.06,56.06,0,0,1,128,184Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
              {/* Documents List */}
              <div className="lg:col-span-2">
                <div className="bg-[#17352b] rounded-lg border border-[#2f6a55]">
                  <div className="p-4 border-b border-[#2f6a55]">
                    <h3 className="text-white text-lg font-semibold">Recent Documents</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="bg-[#214a3c] rounded-lg p-4 hover:bg-[#2f6a55] transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 ${getStatusBgColor(doc.status)} rounded-full`}></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-white font-medium">{doc.name}</p>
                                  <span className="text-[#8ecdb7] text-xs bg-[#17352b] px-2 py-1 rounded">
                                    {doc.type}
                                  </span>
                                </div>
                                <p className="text-[#8ecdb7] text-sm">
                                  {doc.createdBy} - {doc.lastModified}
                                </p>
                                {doc.description && (
                                  <p className="text-[#8ecdb7] text-xs mt-1">{doc.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-[#8ecdb7] text-xs">Permissions:</span>
                                <span className="text-white text-sm font-medium">{doc.permissions}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditDocument(doc)}
                                  className="bg-[#019863] hover:bg-[#017a4f] text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Document Types */}
                <div className="bg-[#17352b] rounded-lg border border-[#2f6a55]">
                  <div className="p-4 border-b border-[#2f6a55]">
                    <h3 className="text-white text-lg font-semibold">Document Types</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {Array.from(new Set(documents.map(doc => doc.type))).map((type) => {
                        const count = documents.filter(doc => doc.type === type).length;
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-white text-sm">{type}</span>
                            <span className="text-[#8ecdb7] text-sm font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Documents by Status */}
                <div className="bg-[#17352b] rounded-lg border border-[#2f6a55]">
                  <div className="p-4 border-b border-[#2f6a55]">
                    <h3 className="text-white text-lg font-semibold">By Status</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#019863] rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Active</p>
                        </div>
                        <span className="text-[#8ecdb7] text-sm font-medium">{activeDocuments}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#8ecdb7] rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm">Archived</p>
                        </div>
                        <span className="text-[#8ecdb7] text-sm font-medium">{archivedDocuments}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#17352b] rounded-lg border border-[#2f6a55]">
                  <div className="p-4 border-b border-[#2f6a55]">
                    <h3 className="text-white text-lg font-semibold">Quick Actions</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <button 
                        onClick={handleAddDocument}
                        className="w-full p-3 bg-[#019863] text-white rounded-lg hover:bg-[#017a4f] transition-colors text-sm font-medium"
                      >
                        New Document
                      </button>
                      <button className="w-full p-3 bg-[#214a3c] text-white rounded-lg hover:bg-[#2f6a55] transition-colors text-sm font-medium">
                        Export Data
                      </button>
                      <button className="w-full p-3 bg-[#214a3c] text-white rounded-lg hover:bg-[#2f6a55] transition-colors text-sm font-medium">
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for create/edit document */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#17352b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2f6a55]">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {editingDocument ? "Edit Document" : "New Document"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Document Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Document name"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Document Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                >
                  <option value="">Select type</option>
                  <option value="Contract">Contract</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Receipt">Receipt</option>
                  <option value="Manual">Manual</option>
                  <option value="Report">Report</option>
                  <option value="Policy">Policy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Document description"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDocument}
                className="flex-1 bg-[#019863] hover:bg-[#017a4f] text-white py-2 px-4 rounded-lg transition-colors"
              >
                {editingDocument ? "Save Changes" : "Create Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

