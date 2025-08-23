"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useKYCProtection } from "../hooks/useKYCProtection";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  userType?: string;
  kycStatus?: string;
  joinDate?: string;
  lastAccess?: string;
  walletAddress?: string;
}

export default function ProfilePage() {
  const { isKYCVerified, isLoading } = useKYCProtection();
  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    email: "user@email.com",
    phone: "",
    address: "",
    userType: "Patient",
    kycStatus: "Pending",
    joinDate: "January 2024",
    lastAccess: "Today",
    walletAddress: "0x1234...5678"
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatarType, setSelectedAvatarType] = useState<string>("");
  const [uploadedImageData, setUploadedImageData] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const savedUser = localStorage.getItem('histoBitUser');
    const kycData = localStorage.getItem('kycData');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const kyc = kycData ? JSON.parse(kycData) : {};
      
      // Prioritize KYC data over user data
      const displayName = kyc.fullName || user.name || 'User';
      const displayEmail = kyc.email || user.email || 'user@email.com';
      
      const userProfile: UserProfile = {
        name: displayName,
        email: displayEmail,
        phone: kyc.phone || "",
        address: kyc.address || "",
        avatar: user.avatar,
        userType: kyc.userType ? kyc.userType.charAt(0).toUpperCase() + kyc.userType.slice(1) : 'Patient',
        kycStatus: kyc.status ? kyc.status.charAt(0).toUpperCase() + kyc.status.slice(1) : 'Pending',
        joinDate: kyc.completedAt ? new Date(kyc.completedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
        lastAccess: 'Today',
        walletAddress: user.address || '0x1234...5678'
      };
      
      setProfile(userProfile);
      
      // Fill form data
      setFormData({
        fullName: kyc.fullName || user.name || "",
        email: kyc.email || user.email || "",
        phone: kyc.phone || "",
        address: kyc.address || ""
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email) {
      showNotification('Please complete all required fields', 'error');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update data in localStorage
      const savedUser = JSON.parse(localStorage.getItem('histoBitUser') || '{}');
      const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
      
      // Update user
      savedUser.name = formData.fullName;
      savedUser.email = formData.email;
      localStorage.setItem('histoBitUser', JSON.stringify(savedUser));
      
      // Update KYC
      const updatedKycData = { ...kycData, ...formData };
      localStorage.setItem('kycData', JSON.stringify(updatedKycData));
      
      showNotification('Profile updated successfully', 'success');
      loadUserProfile();
    } catch (error) {
      showNotification('Error updating profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // Simple notification implementation
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleAvatarOptionChange = (type: string) => {
    setSelectedAvatarType(type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageData(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = () => {
    if (!selectedAvatarType) {
      showNotification('Please select an option', 'error');
      return;
    }

    let avatarData: string | null = null;

    switch (selectedAvatarType) {
      case 'upload':
        if (!uploadedImageData) {
          showNotification('Please select an image', 'error');
          return;
        }
        avatarData = uploadedImageData;
        break;
        
      case 'default':
        avatarData = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAz7gM0xCpxzWf74uwiR-1dzbNhk03GF0X83BMrR44gXpM0CZVlLgB2QepoB7vlpNIdz5ufJOjui-l5Tc4YhzDiyxAKYxSFsbjmXvmjPNStWUjQ4W4c3ScKKwCe80iVqcgmNop3StDLj3g3hYv1ytmejHcB2zP8R6sR-cbp-kkyXOtploHbxKZ6J3JKB9E2vuGKijvflSc1gWG0IFWmUONvJtoT6DXdwfizrbts-FUWF-fEp3V6dRYN7oMZID-8vX8cL1_k8_TZJI';
        break;
        
      case 'initials':
        // Create avatar with initials using Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Circular background
          ctx.fillStyle = '#019863';
          ctx.beginPath();
          ctx.arc(100, 100, 100, 0, 2 * Math.PI);
          ctx.fill();
          
          // Text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 80px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const initials = profile.name.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
          ctx.fillText(initials, 100, 100);
          
          avatarData = canvas.toDataURL();
        }
        break;
    }

    if (avatarData) {
      // Save to localStorage
      const savedUser = JSON.parse(localStorage.getItem('histoBitUser') || '{}');
      savedUser.avatar = avatarData;
      localStorage.setItem('histoBitUser', JSON.stringify(savedUser));
      
      // Also update in KYC data if exists
      const kycData = JSON.parse(localStorage.getItem('kycData') || '{}');
      if (!kycData.photos) {
        kycData.photos = {};
      }
      kycData.photos.profilePhoto = avatarData;
      localStorage.setItem('kycData', JSON.stringify(kycData));

      // Update profile state
      setProfile(prev => ({ ...prev, avatar: avatarData }));
      
      showNotification('Avatar updated successfully', 'success');
      setShowAvatarModal(false);
    }
  };

  const getInitials = () => {
    return profile.name.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
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

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">My Profile</h2>
            
            {/* User Information */}
            <div className="bg-[#214a3c] rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20"
                    style={{ 
                      backgroundImage: profile.avatar 
                        ? `url("${profile.avatar}")` 
                        : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAz7gM0xCpxzWf74uwiR-1dzbNhk03GF0X83BMrR44gXpM0CZVlLgB2QepoB7vlpNIdz5ufJOjui-l5Tc4YhzDiyxAKYxSFsbjmXvmjPNStWUjQ4W4c3ScKKwCe80iVqcgmNop3StDLj3g3hYv1ytmejHcB2zP8R6sR-cbp-kkyXOtploHbxKZ6J3JKB9E2vuGKijvflSc1gWG0IFWmUONvJtoT6DXdwfizrbts-FUWF-fEp3V6dRYN7oMZID-8vX8cL1_k8_TZJI")'
                    }}
                  />
                  <button
                    className="absolute -bottom-1 -right-1 bg-[#019863] hover:bg-[#017a4f] text-white rounded-full p-1.5 transition-colors"
                    onClick={() => setShowAvatarModal(true)}
                    title="Change avatar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M144,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H184v16a8,8,0,0,1-16,0V64H152A8,8,0,0,1,144,56ZM230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                    </svg>
                  </button>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold">{profile.name}</h3>
                  <p className="text-[#8ecdb7] text-sm">{profile.email}</p>
                  <p className="text-[#8ecdb7] text-xs">{profile.walletAddress}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[#8ecdb7]">User Type</p>
                  <p className="text-white font-medium">{profile.userType}</p>
                </div>
                <div>
                  <p className="text-[#8ecdb7]">KYC Status</p>
                  <p className="text-white font-medium">{profile.kycStatus}</p>
                </div>
                <div>
                  <p className="text-[#8ecdb7]">Member since</p>
                  <p className="text-white font-medium">{profile.joinDate}</p>
                </div>
                <div>
                  <p className="text-[#8ecdb7]">Last access</p>
                  <p className="text-white font-medium">{profile.lastAccess}</p>
                </div>
              </div>
            </div>
            
            {/* Edit Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Full Name</p>
                  <input
                    name="fullName"
                    placeholder="Your full name"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#2f6a55] bg-[#17352b] focus:border-[#019863] h-14 placeholder:text-[#8ecdb7] p-[15px] text-base font-normal leading-normal"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#2f6a55] bg-[#17352b] focus:border-[#019863] h-14 placeholder:text-[#8ecdb7] p-[15px] text-base font-normal leading-normal"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Phone</p>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#2f6a55] bg-[#17352b] focus:border-[#019863] h-14 placeholder:text-[#8ecdb7] p-[15px] text-base font-normal leading-normal"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Address</p>
                  <input
                    name="address"
                    placeholder="Your address"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#2f6a55] bg-[#17352b] focus:border-[#019863] h-14 placeholder:text-[#8ecdb7] p-[15px] text-base font-normal leading-normal"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </label>
              </div>
              
              <div className="flex px-4 py-3 gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#019863] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#017a4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#214a3c] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2f6a55] transition-colors"
                  onClick={() => window.history.back()}
                >
                  <span className="truncate">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#214a3c] rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">Change Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-[#8ecdb7] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-[#8ecdb7] text-sm mb-3">Select an option:</p>
              
              {/* Option 1: Upload image */}
              <div className="mb-4">
                <label className="flex items-center gap-3 p-3 border border-[#2f6a55] rounded-lg hover:bg-[#2f6a55] transition-colors cursor-pointer">
                  <input 
                    type="radio" 
                    name="avatarOption" 
                    value="upload" 
                    className="text-[#019863]"
                    checked={selectedAvatarType === 'upload'}
                    onChange={() => handleAvatarOptionChange('upload')}
                  />
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M144,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H184v16a8,8,0,0,1-16,0V64H152A8,8,0,0,1,144,56ZM230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm">Upload image</span>
                </label>
                
                {selectedAvatarType === 'upload' && (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      id="avatarFile"
                    />
                    <label
                      htmlFor="avatarFile"
                      className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#2f6a55] rounded-lg hover:border-[#019863] transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M144,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H184v16a8,8,0,0,1-16,0V64H152A8,8,0,0,1,144,56ZM230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                      </svg>
                      <span className="text-[#8ecdb7] text-sm">Click to select image</span>
                    </label>
                    
                    {uploadedImageData && (
                      <div className="mt-3 text-center">
                        <img src={uploadedImageData} className="w-20 h-20 rounded-full mx-auto mb-2" alt="Preview" />
                        <p className="text-[#8ecdb7] text-xs">Preview</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Option 2: Default avatar */}
              <div className="mb-4">
                <label className="flex items-center gap-3 p-3 border border-[#2f6a55] rounded-lg hover:bg-[#2f6a55] transition-colors cursor-pointer">
                  <input 
                    type="radio" 
                    name="avatarOption" 
                    value="default" 
                    className="text-[#019863]"
                    checked={selectedAvatarType === 'default'}
                    onChange={() => handleAvatarOptionChange('default')}
                  />
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm">Use default avatar</span>
                </label>
              </div>
              
              {/* Option 3: Generate avatar with initials */}
              <div className="mb-4">
                <label className="flex items-center gap-3 p-3 border border-[#2f6a55] rounded-lg hover:bg-[#2f6a55] transition-colors cursor-pointer">
                  <input 
                    type="radio" 
                    name="avatarOption" 
                    value="initials" 
                    className="text-[#019863]"
                    checked={selectedAvatarType === 'initials'}
                    onChange={() => handleAvatarOptionChange('initials')}
                  />
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M128,56A48,48,0,1,0,176,104,48.05,48.05,0,0,0,128,56Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,136Zm47.85-67.73a8,8,0,0,1,2.86,10.91,8.14,8.14,0,0,1-.54,1.13,87.62,87.62,0,0,1-18.12,22.33A87.62,87.62,0,0,1,140,140.23a8,8,0,0,1-15.47,4.54,8.14,8.14,0,0,1-.54-1.13,87.62,87.62,0,0,1-18.12-22.33A87.62,87.62,0,0,1,84.83,105.64a8,8,0,0,1,.54-1.13,8,8,0,0,1,10.91-2.86,8.14,8.14,0,0,1,1.13.54A71.74,71.74,0,0,0,120,104a71.74,71.74,0,0,0,22.72-2.65,8.14,8.14,0,0,1,1.13-.54A8,8,0,0,1,175.85,92.27ZM232,128a104,104,0,1,1-104-104A104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm">Generate with initials</span>
                </label>
                
                {selectedAvatarType === 'initials' && (
                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-[#019863] flex items-center justify-center text-white text-xl font-bold">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="text-[#8ecdb7] text-xs mb-1">Will be generated automatically with your initials</p>
                        <p className="text-white text-sm">{profile.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={saveAvatar}
                className="flex-1 bg-[#019863] hover:bg-[#017a4f] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="flex-1 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
