"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useKYCProtection } from "../hooks/useKYCProtection";

interface ClinicalData {
  name: string;
  bloodType: string;
  birthDate: string;
  allergies: string[];
  medications: Array<{ name: string; dosage: string }>;
  lastReview: string;
  nextAppointment?: string;
  status: string;
  photo?: string;
  id: string;
}

interface InsuranceData {
  name: string;
  policyNumber: string;
  insuranceType: string;
  coverage: string;
  riskLevel: string;
  lastAssessment: string;
  nextReview?: string;
  status: string;
  photo?: string;
  id: string;
}

export default function DashboardPage() {
  const { isKYCVerified, isLoading } = useKYCProtection();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSector, setActiveSector] = useState<'health' | 'insurance'>('health');
  
  const [clinicalData, setClinicalData] = useState<ClinicalData>({
    name: "María González López",
    bloodType: "O+",
    birthDate: "15/03/1985",
    allergies: ["Penicilina", "Polen"],
    medications: [
      { name: "Omeprazol 20mg", dosage: "1x día" },
      { name: "Vitamina D3", dosage: "1x día" },
      { name: "Omega 3", dosage: "1x día" }
    ],
    lastReview: "15/01/2024",
    nextAppointment: "15/02/2024",
    status: "Estable",
    id: "HB-2024-001234"
  });

  const [insuranceData, setInsuranceData] = useState<InsuranceData>({
    name: "María González López",
    policyNumber: "INS-2024-567890",
    insuranceType: "Seguro de Salud Integral",
    coverage: "Cobertura Completa",
    riskLevel: "Bajo",
    lastAssessment: "10/01/2024",
    nextReview: "10/04/2024",
    status: "Activo",
    id: "INS-2024-567890"
  });

  const [metrics, setMetrics] = useState({
    activeDocuments: 120,
    activePermissions: 35,
    requestForPermits: 8,
    pendingTransactions: 5,
    recentTransactions: 156
  });

  const [showPermitsModal, setShowPermitsModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);

  const permitRequests = [
    {
      id: 1,
      requester: "Dr. María García",
      entity: "Hospital San José",
      type: "Medical Records Access",
      status: "Pending",
      date: "2024-01-22",
      priority: "High"
    },
    {
      id: 2,
      requester: "Auditor Carlos López",
      entity: "Health Insurance Co.",
      type: "Audit Review",
      status: "Pending",
      date: "2024-01-21",
      priority: "Medium"
    },
    {
      id: 3,
      requester: "Dr. Ana Martínez",
      entity: "Clínica Santa María",
      type: "Patient History",
      status: "Pending",
      date: "2024-01-20",
      priority: "High"
    },
    {
      id: 4,
      requester: "Insurance Agent Juan Pérez",
      entity: "Seguros Unidos",
      type: "Risk Assessment",
      status: "Pending",
      date: "2024-01-19",
      priority: "Low"
    }
  ];

  const pendingTransactions = [
    {
      id: 1,
      entity: "Hospital San José",
      description: "Medical Records Access Fee",
      amount: 150.00,
      currency: "USD",
      dueDate: "2024-01-25",
      status: "Pending"
    },
    {
      id: 2,
      entity: "Health Insurance Co.",
      description: "Data Processing Service",
      amount: 75.50,
      currency: "USD",
      dueDate: "2024-01-28",
      status: "Pending"
    },
    {
      id: 3,
      entity: "Clínica Santa María",
      description: "Patient History Review",
      amount: 200.00,
      currency: "USD",
      dueDate: "2024-01-30",
      status: "Pending"
    },
    {
      id: 4,
      entity: "Seguros Unidos",
      description: "Risk Assessment Report",
      amount: 125.75,
      currency: "USD",
      dueDate: "2024-02-02",
      status: "Pending"
    },
    {
      id: 5,
      entity: "Medical Center ABC",
      description: "Emergency Access Fee",
      amount: 300.00,
      currency: "USD",
      dueDate: "2024-02-05",
      status: "Pending"
    }
  ];

  useEffect(() => {
    // Get user from localStorage
    const savedUser = localStorage.getItem('histoBitUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load KYC data and update names
    const kycData = localStorage.getItem('kycData');
    if (kycData) {
      try {
        const kyc = JSON.parse(kycData);
        if (kyc.fullName) {
          setClinicalData(prev => ({ ...prev, name: kyc.fullName }));
          setInsuranceData(prev => ({ ...prev, name: kyc.fullName }));
        }
      } catch (error) {
        console.error('Error parsing KYC data:', error);
      }
    }
  }, []);

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

  const renderClinicalCard = () => (
    <div className="bg-gradient-to-br from-[#214a3c] to-[#17352b] rounded-xl p-6 border-2 border-[#2f6a55] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">Clinical Card</h3>
        <button 
          onClick={() => expandClinicalCard()}
          className="text-[#8ecdb7] hover:text-white text-sm font-medium transition-colors"
        >
          View Complete →
        </button>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-inner">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-24 bg-gradient-to-b from-[#8ecdb7] to-[#019863] rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="w-16 h-20 bg-white rounded-md flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#019863" viewBox="0 0 256 256">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                </svg>
              </div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-[#019863] rounded-full border-2 border-white"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-xs font-medium">NAME</p>
                <p className="text-gray-900 text-sm font-bold">{clinicalData.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">BLOOD TYPE</p>
                <p className="text-red-600 text-lg font-bold">{clinicalData.bloodType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">BIRTH DATE</p>
                <p className="text-gray-900 text-sm">{clinicalData.birthDate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">ALLERGIES</p>
                <p className="text-orange-600 text-sm font-semibold">{clinicalData.allergies.length} (View Details)</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">MEDICATIONS</p>
                <p className="text-blue-600 text-sm font-semibold">{clinicalData.medications.length} Active</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">LAST REVIEW</p>
                <p className="text-gray-900 text-sm">{clinicalData.lastReview}</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <span className="bg-[#019863] text-white text-xs px-2 py-1 rounded-full font-medium">{clinicalData.status.toUpperCase()}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">NO URGENCIES</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-gray-500 text-xs">
            ID: {clinicalData.id}
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 256 256">
              <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM224,192H32V64H224V192ZM48,80V176H208V80H48ZM64,96H192V160H64V96Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsuranceCard = () => (
    <div className="bg-gradient-to-br from-[#214a3c] to-[#17352b] rounded-xl p-6 border-2 border-[#2f6a55] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">Risk Assessment Card</h3>
        <button 
          onClick={() => expandInsuranceCard()}
          className="text-[#8ecdb7] hover:text-white text-sm font-medium transition-colors"
        >
          View Complete →
        </button>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-inner">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-20 h-24 bg-gradient-to-b from-[#8ecdb7] to-[#019863] rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="w-16 h-20 bg-white rounded-md flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#019863" viewBox="0 0 256 256">
                  <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                </svg>
              </div>
              <div className="absolute top-1 right-1 w-3 h-3 bg-[#019863] rounded-full border-2 border-white"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-xs font-medium">NAME</p>
                <p className="text-gray-900 text-sm font-bold">{insuranceData.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">RISK LEVEL</p>
                <p className="text-green-600 text-lg font-bold">{insuranceData.riskLevel}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">POLICY NUMBER</p>
                <p className="text-gray-900 text-sm">{insuranceData.policyNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">COVERAGE</p>
                <p className="text-blue-600 text-sm font-semibold">{insuranceData.coverage}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">INSURANCE TYPE</p>
                <p className="text-purple-600 text-sm font-semibold">{insuranceData.insuranceType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs font-medium">LAST ASSESSMENT</p>
                <p className="text-gray-900 text-sm">{insuranceData.lastAssessment}</p>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <span className="bg-[#019863] text-white text-xs px-2 py-1 rounded-full font-medium">{insuranceData.status.toUpperCase()}</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">LOW RISK</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="text-gray-500 text-xs">
            ID: {insuranceData.id}
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 256 256">
              <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM224,192H32V64H224V192ZM48,80V176H208V80H48ZM64,96H192V160H64V96Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const expandClinicalCard = () => {
    alert('Clinical card expanded - Full implementation would show detailed modal with complete patient information');
  };

  const expandInsuranceCard = () => {
    alert('Insurance card expanded - Full implementation would show detailed modal with complete risk assessment');
  };

  const recentActivities = [
    {
      id: 1,
      type: 'access',
      description: activeSector === 'health' ? 'Dr. Smith accessed your medical records' : 'Risk assessment updated by Insurance Co.',
      timestamp: '2 hours ago',
      icon: activeSector === 'health' ? '👨‍⚕️' : '📊'
    },
    {
      id: 2,
      type: 'update',
      description: activeSector === 'health' ? 'New lab results uploaded' : 'Policy coverage modified',
      timestamp: '1 day ago',
      icon: activeSector === 'health' ? '📋' : '📄'
    },
    {
      id: 3,
      type: 'permission',
      description: activeSector === 'health' ? 'Permission granted to Insurance Co.' : 'Risk level re-evaluated',
      timestamp: '3 days ago',
      icon: activeSector === 'health' ? '🔐' : '📈'
    },
    {
      id: 4,
      type: 'verification',
      description: 'KYC verification completed',
      timestamp: '1 week ago',
      icon: '✅'
    }
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Welcome Section */}
            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center gap-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChlk-btlRNpgNg-z8T51q402ptG40lJQvlDeG1hjNdGYW9-bKJ0mNVCHEKJ_4V7cFMs4YWHO1rLBziqn_y0AD4IvzOqGyPSEgBD4tNeLoumL6cDSB9Xs8v45njnPv1a9jXVPDCjg_XNFUC3aB1DxGE-fM38kfe3cveRtuU2SJEe7KiSaZy6OvKWS_5qz7hcJpKC29yAT4YunaNpvHclcEjx36NJjgPvtP1P9OgHhVu1laiE8DsmWxvVp4HDLrWeBESWRr9mcSUtQ0")' }}
                ></div>
                <div>
                  <h1 className="text-white text-2xl font-bold leading-tight">
                    Welcome back, {currentUser?.name || 'User'}!
                  </h1>
                  <p className="text-[#8ecdb7] text-sm">
                    Address: {currentUser?.address || 'Not connected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Sector Selection */}
            <div className="p-4">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveSector('health')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSector === 'health'
                      ? 'bg-[#019863] text-white'
                      : 'bg-[#214a3c] text-[#8ecdb7] hover:bg-[#2f6a55]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                  </svg>
                  Health Sector
                </button>
                <button
                  onClick={() => setActiveSector('insurance')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSector === 'insurance'
                      ? 'bg-[#019863] text-white'
                      : 'bg-[#214a3c] text-[#8ecdb7] hover:bg-[#2f6a55]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"/>
                  </svg>
                  Insurance Sector
                </button>
              </div>

              {/* Dynamic Card based on Sector */}
              {activeSector === 'health' ? renderClinicalCard() : renderInsuranceCard()}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Active Documents</p>
                    <p className="text-white text-2xl font-bold">{metrics.activeDocuments}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">📊</div>
                </div>
              </div>

              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Active Permissions</p>
                    <p className="text-white text-2xl font-bold">{metrics.activePermissions}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">🔐</div>
                </div>
              </div>

              <div 
                className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4 cursor-pointer hover:bg-[#214a3c] transition-colors"
                onClick={() => setShowPermitsModal(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Request For Permits</p>
                    <p className="text-white text-2xl font-bold">{metrics.requestForPermits}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">📋</div>
                </div>
              </div>

              <div 
                className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4 cursor-pointer hover:bg-[#214a3c] transition-colors"
                onClick={() => setShowTransactionsModal(true)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Pending Transactions</p>
                    <p className="text-white text-2xl font-bold">{metrics.pendingTransactions}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">💰</div>
                </div>
              </div>

              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8ecdb7] text-sm">Recent Transactions</p>
                    <p className="text-white text-2xl font-bold">{metrics.recentTransactions}</p>
                  </div>
                  <div className="text-[#019863] text-2xl">📈</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4">
              <h2 className="text-white text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-[#17352b] hover:bg-[#214a3c] rounded-lg border border-[#2f6a55] p-4 text-left transition-colors">
                  <div className="text-[#019863] text-2xl mb-2">📋</div>
                  <h3 className="text-white font-bold">View Records</h3>
                  <p className="text-[#8ecdb7] text-sm">Access your {activeSector === 'health' ? 'medical' : 'insurance'} records</p>
                </button>

                <button className="bg-[#17352b] hover:bg-[#214a3c] rounded-lg border border-[#2f6a55] p-4 text-left transition-colors">
                  <div className="text-[#019863] text-2xl mb-2">🔐</div>
                  <h3 className="text-white font-bold">Manage Permissions</h3>
                  <p className="text-[#8ecdb7] text-sm">Control who can access your data</p>
                </button>

                <button className="bg-[#17352b] hover:bg-[#214a3c] rounded-lg border border-[#2f6a55] p-4 text-left transition-colors">
                  <div className="text-[#019863] text-2xl mb-2">📊</div>
                  <h3 className="text-white font-bold">View Analytics</h3>
                  <p className="text-[#8ecdb7] text-sm">Track access and usage statistics</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-4">
              <h2 className="text-white text-xl font-bold mb-4">Recent Activity</h2>
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-[#214a3c] rounded-lg">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{activity.description}</p>
                        <p className="text-[#8ecdb7] text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permits Modal */}
      {showPermitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#214a3c] rounded-lg p-6 max-w-2xl w-full mx-4 border border-[#2f6a55] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Request For Permits</h3>
              <button 
                onClick={() => setShowPermitsModal(false)}
                className="text-[#8ecdb7] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {permitRequests.map((request) => (
                <div key={request.id} className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-bold">{request.requester}</h4>
                      <p className="text-[#8ecdb7] text-sm">{request.entity}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.priority === 'High' ? 'bg-red-500 text-white' :
                      request.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                      'bg-green-500 text-white'
                    }`}>
                      {request.priority}
                    </span>
                  </div>
                  <p className="text-white text-sm mb-2">{request.type}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8ecdb7] text-xs">{request.date}</span>
                    <div className="flex gap-2">
                      <button className="bg-[#019863] text-white text-xs px-3 py-1 rounded hover:bg-[#017a4f] transition-colors">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition-colors">
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {showTransactionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#214a3c] rounded-lg p-6 max-w-2xl w-full mx-4 border border-[#2f6a55] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-xl font-bold">Pending Transactions</h3>
              <button 
                onClick={() => setShowTransactionsModal(false)}
                className="text-[#8ecdb7] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {pendingTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-[#17352b] rounded-lg p-4 border border-[#2f6a55]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-bold">{transaction.entity}</h4>
                      <p className="text-[#8ecdb7] text-sm">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                      <p className="text-[#8ecdb7] text-xs">{transaction.currency}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8ecdb7] text-xs">Due: {transaction.dueDate}</span>
                    <div className="flex gap-2">
                      <button className="bg-[#019863] text-white text-xs px-3 py-1 rounded hover:bg-[#017a4f] transition-colors">
                        Mark Paid
                      </button>
                      <button className="bg-[#214a3c] text-white text-xs px-3 py-1 rounded hover:bg-[#2f6a55] transition-colors">
                        Remind
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-[#17352b] rounded-lg border border-[#2f6a55]">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total Pending:</span>
                  <span className="text-[#019863] font-bold text-xl">
                    ${pendingTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
