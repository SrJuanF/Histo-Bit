"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import { useKYCProtection } from "../hooks/useKYCProtection";

export default function PermissionsPage() {
  const { isKYCVerified, isLoading } = useKYCProtection();
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      entity: "Dr. Sarah Johnson",
      entityType: "doctor",
      entityAddress: "0x1234...5678",
      permissions: ["read", "write"],
      status: "active",
      grantedDate: "2024-01-10",
      expiresDate: "2024-12-31",
      icon: "👨‍⚕️"
    },
    {
      id: 2,
      entity: "City General Hospital",
      entityType: "hospital",
      entityAddress: "0x8765...4321",
      permissions: ["read"],
      status: "active",
      grantedDate: "2024-01-05",
      expiresDate: "2024-12-31",
      icon: "🏥"
    },
    {
      id: 3,
      entity: "Blue Cross Insurance",
      entityType: "insurance",
      entityAddress: "0xabcd...efgh",
      permissions: ["read"],
      status: "pending",
      grantedDate: "2024-01-15",
      expiresDate: "2024-12-31",
      icon: "🛡️"
    },
    {
      id: 4,
      entity: "Medical Research Institute",
      entityType: "research",
      entityAddress: "0x9876...5432",
      permissions: ["read"],
      status: "expired",
      grantedDate: "2023-06-01",
      expiresDate: "2023-12-31",
      icon: "🔬"
    },
    {
      id: 5,
      entity: "Dr. Michael Chen",
      entityType: "doctor",
      entityAddress: "0x1234...5678", // Duplicate address
      permissions: ["read"],
      status: "active",
      grantedDate: "2024-01-20",
      expiresDate: "2024-02-15", // Expiring soon
      icon: "👨‍⚕️"
    },
    {
      id: 6,
      entity: "Central Pharmacy",
      entityType: "pharmacy",
      entityAddress: "0xfedc...ba98",
      permissions: ["read", "write"],
      status: "active",
      grantedDate: "2024-01-08",
      expiresDate: "2024-02-20", // Expiring soon
      icon: "💊"
    },
    {
      id: 7,
      entity: "LabCorp Diagnostics",
      entityType: "laboratory",
      entityAddress: "0x1111...2222",
      permissions: ["read"],
      status: "expired",
      grantedDate: "2023-08-15",
      expiresDate: "2023-11-30",
      icon: "🧪"
    },
    {
      id: 8,
      entity: "Dr. Emily Rodriguez",
      entityType: "doctor",
      entityAddress: "0x3333...4444",
      permissions: ["read", "write", "share"],
      status: "active",
      grantedDate: "2024-01-12",
      expiresDate: "2024-12-31",
      icon: "👩‍⚕️"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("entity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Calculate permission statistics
  const permissionStats = {
    active: permissions.filter(p => p.status === 'active').length,
    expired: permissions.filter(p => p.status === 'expired').length,
    expiringSoon: permissions.filter(p => {
      if (p.status !== 'active') return false;
      const expiryDate = new Date(p.expiresDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    duplicates: permissions.filter(p => {
      // Check for duplicate entity addresses
      const sameAddress = permissions.filter(perm => perm.entityAddress === p.entityAddress);
      return sameAddress.length > 1;
    }).length
  };

  // Show loading while checking KYC status
  if (isLoading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="flex items-center justify-center flex-1">
            <div className="text-white text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if KYC is not verified (will be redirected by the hook)
  if (!isKYCVerified) {
    return null;
  }

  const permissionTypes = [
    { id: "read", label: "Read Access", description: "Can view medical records" },
    { id: "write", label: "Write Access", description: "Can modify medical records" },
    { id: "delete", label: "Delete Access", description: "Can delete medical records" },
    { id: "share", label: "Share Access", description: "Can share records with others" }
  ];

  const entityTypes = [
    { id: "doctor", label: "Doctor", icon: "👨‍⚕️" },
    { id: "hospital", label: "Hospital", icon: "🏥" },
    { id: "insurance", label: "Insurance", icon: "🛡️" },
    { id: "research", label: "Research", icon: "🔬" },
    { id: "pharmacy", label: "Pharmacy", icon: "💊" },
    { id: "laboratory", label: "Laboratory", icon: "🧪" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-[#019863]";
      case "pending":
        return "text-yellow-400";
      case "expired":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "✅";
      case "pending":
        return "⏳";
      case "expired":
        return "❌";
      default:
        return "❓";
    }
  };

  const revokePermission = (id: number) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, status: 'expired' } : p
    ));
  };

  const approvePermission = (id: number) => {
    setPermissions(permissions.map(p => 
      p.id === id ? { ...p, status: 'active' } : p
    ));
  };

  // Filter and sort permissions
  const filteredAndSortedPermissions = permissions
    .filter(permission => {
      // Search filter
      const matchesSearch = permission.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           permission.entityAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || permission.status === statusFilter;
      
      // Entity type filter
      const matchesEntityType = entityTypeFilter === "all" || permission.entityType === entityTypeFilter;
      
      return matchesSearch && matchesStatus && matchesEntityType;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "entity":
          aValue = a.entity.toLowerCase();
          bValue = b.entity.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "expiresDate":
          aValue = new Date(a.expiresDate);
          bValue = new Date(b.expiresDate);
          break;
        case "grantedDate":
          aValue = new Date(a.grantedDate);
          bValue = new Date(b.grantedDate);
          break;
        default:
          aValue = a.entity.toLowerCase();
          bValue = b.entity.toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setEntityTypeFilter("all");
    setSortBy("entity");
    setSortOrder("asc");
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Permissions</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#214a3c] text-white text-sm font-medium leading-normal hover:bg-[#2f6a55] transition-colors"
              >
                <span className="truncate">Grant Permission</span>
              </button>
            </div>

            {/* Permission Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Active Permissions</p>
                    <p className="text-white text-2xl font-bold">{permissionStats.active}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">✅</div>
                </div>
              </div>

              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Expired Permissions</p>
                    <p className="text-white text-2xl font-bold">{permissionStats.expired}</p>
                  </div>
                  <div className="text-red-500 text-2xl">❌</div>
                </div>
              </div>

              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Expiring Soon</p>
                    <p className="text-white text-2xl font-bold">{permissionStats.expiringSoon}</p>
                  </div>
                  <div className="text-yellow-400 text-2xl">⚠️</div>
                </div>
              </div>

              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Duplicates Detected</p>
                    <p className="text-white text-2xl font-bold">{permissionStats.duplicates}</p>
                  </div>
                  <div className="text-orange-500 text-2xl">🔄</div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="px-4 py-3">
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4 mb-4">
                <div className="flex flex-wrap gap-4 items-end">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search by entity name or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="min-w-40">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {/* Entity Type Filter */}
                  <div className="min-w-40">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Entity Type</label>
                    <select
                      value={entityTypeFilter}
                      onChange={(e) => setEntityTypeFilter(e.target.value)}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                    >
                      <option value="all">All Types</option>
                      {entityTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="min-w-40">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                    >
                      <option value="entity">Entity Name</option>
                      <option value="status">Status</option>
                      <option value="expiresDate">Expiration Date</option>
                      <option value="grantedDate">Granted Date</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div className="min-w-32">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Order</label>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] hover:bg-[#2f6a55] transition-colors flex items-center justify-center gap-2"
                    >
                      {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                    </button>
                  </div>

                  {/* Clear Filters */}
                  <div className="min-w-32">
                    <label className="block text-[#8ecdb7] text-sm font-medium mb-2">&nbsp;</label>
                    <button
                      onClick={clearFilters}
                      className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] hover:bg-[#2f6a55] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-[#2f6a55]">
                  <p className="text-[#8ecdb7] text-sm">
                    Showing {filteredAndSortedPermissions.length} of {permissions.length} permissions
                    {(searchTerm || statusFilter !== "all" || entityTypeFilter !== "all") && (
                      <span className="text-white"> (filtered)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Permissions List */}
              <div className="space-y-4">
                {filteredAndSortedPermissions.length === 0 ? (
                  <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-8 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-white text-lg font-bold mb-2">No permissions found</h3>
                    <p className="text-[#8ecdb7] text-sm mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-[#019863] hover:bg-[#017a4f] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredAndSortedPermissions.map((permission) => (
                    <div key={permission.id} className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4 hover:bg-[#214a3c] transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{permission.icon}</div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{permission.entity}</h3>
                            <p className="text-[#8ecdb7] text-sm">{permission.entityAddress}</p>
                            <p className="text-[#8ecdb7] text-xs capitalize">{permission.entityType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getStatusColor(permission.status)}`}>
                            {getStatusIcon(permission.status)} {permission.status.charAt(0).toUpperCase() + permission.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {permission.permissions.map((perm) => (
                          <span key={perm} className="bg-[#214a3c] text-[#8ecdb7] px-3 py-1 rounded-full text-sm">
                            {perm.charAt(0).toUpperCase() + perm.slice(1)}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-[#8ecdb7] mb-4">
                        <span>Granted: {permission.grantedDate}</span>
                        <span>Expires: {permission.expiresDate}</span>
                      </div>

                      <div className="flex gap-2">
                        {permission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approvePermission(permission.id)}
                              className="bg-[#019863] hover:bg-[#017a4f] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => revokePermission(permission.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {permission.status === 'active' && (
                          <button
                            onClick={() => revokePermission(permission.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPermission(permission)}
                          className="bg-[#214a3c] hover:bg-[#2f6a55] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Permission Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#17352b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2f6a55] relative">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Grant Permission</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Entity Type</label>
                <select className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]">
                  <option value="">Select entity type</option>
                  {entityTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Entity Name</label>
                <input
                  type="text"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter entity name"
                />
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Wallet Address</label>
                <input
                  type="text"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter wallet address"
                />
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2">
                  {permissionTypes.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-[#2f6a55] bg-[#214a3c] text-[#019863] focus:ring-[#019863]" />
                      <div>
                        <p className="text-white text-sm font-medium">{perm.label}</p>
                        <p className="text-[#8ecdb7] text-xs">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Expiration Date</label>
                <input
                  type="date"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-[#019863] hover:bg-[#017a4f] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Grant Permission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Details Modal */}
      {selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#17352b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2f6a55] relative">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Permission Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[#8ecdb7] text-sm">Entity</p>
                <p className="text-white font-medium">{selectedPermission.entity}</p>
              </div>
              <div>
                <p className="text-[#8ecdb7] text-sm">Address</p>
                <p className="text-white font-mono text-sm">{selectedPermission.entityAddress}</p>
              </div>
              <div>
                <p className="text-[#8ecdb7] text-sm">Status</p>
                <p className={`font-medium ${getStatusColor(selectedPermission.status)}`}>
                  {selectedPermission.status.charAt(0).toUpperCase() + selectedPermission.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-[#8ecdb7] text-sm">Permissions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedPermission.permissions.map((perm: string) => (
                    <span key={perm} className="bg-[#214a3c] text-[#8ecdb7] px-3 py-1 rounded-full text-sm">
                      {perm.charAt(0).toUpperCase() + perm.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#8ecdb7] text-sm">Granted Date</p>
                <p className="text-white">{selectedPermission.grantedDate}</p>
              </div>
              <div>
                <p className="text-[#8ecdb7] text-sm">Expiration Date</p>
                <p className="text-white">{selectedPermission.expiresDate}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPermission(null)}
              className="w-full bg-[#214a3c] hover:bg-[#2f6a55] text-white py-2 px-4 rounded-lg transition-colors mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
