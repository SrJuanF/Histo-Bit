"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import { useKYCProtection } from "../hooks/useKYCProtection";

export default function ActivitiesPage() {
  const { isKYCVerified, isLoading } = useKYCProtection();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

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

  const activities = [
    {
      id: 1,
      type: "medical_record",
      title: "Blood Test Results",
      description: "Complete blood count and metabolic panel",
      date: "2024-01-15",
      status: "completed",
      icon: "🩸"
    },
    {
      id: 2,
      type: "consultation",
      title: "Cardiology Consultation",
      description: "Follow-up appointment with Dr. Johnson",
      date: "2024-01-14",
      status: "scheduled",
      icon: "❤️"
    },
    {
      id: 3,
      type: "medication",
      title: "Prescription Renewal",
      description: "Blood pressure medication refill",
      date: "2024-01-13",
      status: "pending",
      icon: "💊"
    },
    {
      id: 4,
      type: "procedure",
      title: "MRI Scan",
      description: "Brain MRI for headache evaluation",
      date: "2024-01-12",
      status: "completed",
      icon: "🧠"
    },
    {
      id: 5,
      type: "vaccination",
      title: "Flu Shot",
      description: "Annual influenza vaccination",
      date: "2024-01-10",
      status: "completed",
      icon: "💉"
    }
  ];

  const activityTypes = [
    { id: "all", label: "All Activities" },
    { id: "medical_record", label: "Medical Records" },
    { id: "consultation", label: "Consultations" },
    { id: "medication", label: "Medications" },
    { id: "procedure", label: "Procedures" },
    { id: "vaccination", label: "Vaccinations" }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || activity.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-[#019863]";
      case "scheduled":
        return "text-blue-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Activities</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#214a3c] text-white text-sm font-medium leading-normal hover:bg-[#2f6a55] transition-colors"
              >
                <span className="truncate">Add Activity</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#8ecdb7] flex border-none bg-[#214a3c] items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search activities"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#214a3c] focus:border-none h-full placeholder:text-[#8ecdb7] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              {activityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 transition-colors ${
                    selectedType === type.id
                      ? 'bg-[#019863] text-white'
                      : 'bg-[#214a3c] text-white hover:bg-[#2f6a55]'
                  }`}
                >
                  <p className="text-sm font-medium leading-normal">{type.label}</p>
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Activities List */}
            <div className="px-4 py-3">
              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-4 hover:bg-[#214a3c] transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold text-lg">{activity.title}</h3>
                          <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-[#8ecdb7] text-sm mb-2">{activity.description}</p>
                        <p className="text-[#8ecdb7] text-xs">Date: {activity.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#17352b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2f6a55] relative">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Add New Activity</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Activity Type</label>
                <select className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]">
                  <option value="">Select type</option>
                  <option value="medical_record">Medical Record</option>
                  <option value="consultation">Consultation</option>
                  <option value="medication">Medication</option>
                  <option value="procedure">Procedure</option>
                  <option value="vaccination">Vaccination</option>
                </select>
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter activity title"
                />
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  rows={3}
                  placeholder="Enter activity description"
                ></textarea>
              </div>
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Date</label>
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
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
