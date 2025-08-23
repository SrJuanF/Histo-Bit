"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { countries, getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";

export default function KYCComponent() {
  const router = useRouter();
  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId, setUserId] = useState("0xc060DbB08Cd8980479bFfe829236Bcb9a1D9bD06");
  const [activeTab, setActiveTab] = useState('patient');
  const [verificationStep, setVerificationStep] = useState<'choose' | 'qr' | 'facial' | 'register'>('choose');
  const [isVerifying, setIsVerifying] = useState(false);
  const [facialVerificationProgress, setFacialVerificationProgress] = useState(0);
  
  // Registration form states
  const [selectedEntityType, setSelectedEntityType] = useState('patient');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [nationalId, setNationalId] = useState('');
  
  // Use useMemo to cache the array to avoid creating a new array on each render
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA], []);

  // Use useEffect to ensure code only executes on the client side
  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
        logoBase64:
          "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_celo",
        userIdType: "hex",
        userDefinedData: "Bonjour Cannes!",
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
        }
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, []);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        displayToast("Failed to copy link");
      });
  };

  const openSelfApp = () => {
    if (!universalLink) return;
    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const handleSuccessfulVerification = () => {
    displayToast("Verification successful! Redirecting to dashboard...");
    // Mark user as verified in localStorage
    localStorage.setItem('isKYCVerified', 'true');
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleFacialVerification = () => {
    setIsVerifying(true);
    setFacialVerificationProgress(0);
    
    // Simulate facial recognition process
    const interval = setInterval(() => {
      setFacialVerificationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          displayToast("Facial verification successful! Redirecting to dashboard...");
          localStorage.setItem('isKYCVerified', 'true');
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRegisterAccount = () => {
    setVerificationStep('register');
  };

  const handleBackToChoose = () => {
    setVerificationStep('choose');
  };

  const tabs = [
    {
      id: 'patient',
      label: 'Patient',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136ZM144,157.68a68,68,0,1,0-71.9,0c-20.65,6.76-39.23,19.39-54.17,37.17A8,8,0,0,0,24,208H192a8,8,0,0,0,6.13-13.15C183.18,177.07,164.6,164.44,144,157.68Z"></path>
        </svg>
      )
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
        </svg>
      )
    },
    {
      id: 'insurance',
      label: 'Insurance Company',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"></path>
        </svg>
      )
    },
    {
      id: 'auditor',
      label: 'Auditor',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
        </svg>
      )
    }
  ];

  // Choose verification method step
  if (verificationStep === 'choose') {
    return (
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
          Identity Verification (KYC)
        </h2>
        <p className="text-[#8ecdb7] text-center px-4 pb-6">
          Choose your verification method to access the platform
        </p>
        
        <div className="pb-3">
          <div className="flex border-b border-[#2f6a55] px-4 gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center border-b-[3px] gap-1 pb-[7px] pt-2.5 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-[#019863] text-white'
                    : 'border-b-transparent text-[#8ecdb7]'
                }`}
              >
                <div className={activeTab === tab.id ? 'text-white' : 'text-[#8ecdb7]'}>
                  {tab.icon}
                </div>
                <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                  activeTab === tab.id ? 'text-white' : 'text-[#8ecdb7]'
                }`}>
                  {tab.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Choose Verification Method
            </h3>
            
            <div className="space-y-4">
              {/* QR Code Verification Option */}
              <button
                onClick={() => setVerificationStep('qr')}
                className="w-full bg-[#214a3c] hover:bg-[#2f6a55] text-white p-4 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h4 className="font-bold text-lg">QR Code Verification</h4>
                    <p className="text-[#8ecdb7] text-sm">Scan QR code with Self Protocol App</p>
                  </div>
                </div>
              </button>

              {/* Facial Recognition Option */}
              <button
                onClick={() => setVerificationStep('facial')}
                className="w-full bg-[#214a3c] hover:bg-[#2f6a55] text-white p-4 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">👤</div>
                  <div>
                    <h4 className="font-bold text-lg">Facial Recognition</h4>
                    <p className="text-[#8ecdb7] text-sm">Biometric verification using your camera</p>
                  </div>
                </div>
              </button>

              {/* Register Account Option */}
              <button
                onClick={handleRegisterAccount}
                className="w-full bg-[#019863] hover:bg-[#017a4f] text-white p-4 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="font-bold text-lg">Register New Account</h4>
                    <p className="text-white text-sm">Create a new account with your information</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // QR Code Verification step
  if (verificationStep === 'qr') {
    return (
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <div className="flex items-center gap-4 px-4 pb-3">
          <button
            onClick={handleBackToChoose}
            className="text-[#8ecdb7] hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight">
            QR Code Verification
          </h2>
        </div>
        
        <div className="px-4 py-6">
          <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              {process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop"}
            </h3>
            <p className="text-[#8ecdb7] text-center mb-6">
              Scan QR code with Self Protocol App to verify your identity
            </p>

            <div className="flex justify-center mb-6">
              {selfApp ? (
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccessfulVerification}
                  onError={() => {
                    displayToast("Error: Failed to verify identity");
                  }}
                />
              ) : (
                <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Loading QR Code...</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <button
                type="button"
                onClick={copyToClipboard}
                disabled={!universalLink}
                className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors text-white p-2 rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {linkCopied ? "Copied!" : "Copy Universal Link"}
              </button>

              <button
                type="button"
                onClick={openSelfApp}
                disabled={!universalLink}
                className="flex-1 bg-blue-600 hover:bg-blue-500 transition-colors text-white p-2 rounded-md text-sm mt-2 sm:mt-0 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Open Self App
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-wide">User Address</span>
              <div className="bg-gray-100 rounded-md px-3 py-2 w-full text-center break-all text-sm font-mono text-gray-800 border border-gray-200">
                {userId ? userId : <span className="text-gray-400">Not connected</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Facial Recognition step
  if (verificationStep === 'facial') {
    return (
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <div className="flex items-center gap-4 px-4 pb-3">
          <button
            onClick={handleBackToChoose}
            className="text-[#8ecdb7] hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight">
            Facial Recognition
          </h2>
        </div>
        
        <div className="px-4 py-6">
          <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6">
            <h3 className="text-white text-xl font-bold mb-4 text-center">
              Biometric Verification
            </h3>
            <p className="text-[#8ecdb7] text-center mb-6">
              Position your face in the camera for verification
            </p>

            <div className="flex justify-center mb-6">
              <div className="w-[256px] h-[256px] bg-[#214a3c] rounded-lg border-2 border-dashed border-[#2f6a55] flex items-center justify-center relative">
                {isVerifying ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">👤</div>
                    <div className="text-white text-sm">Verifying...</div>
                    <div className="w-full bg-[#2f6a55] rounded-full h-2 mt-4">
                      <div 
                        className="bg-[#019863] h-2 rounded-full transition-all duration-200"
                        style={{ width: `${facialVerificationProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-[#8ecdb7] text-xs mt-2">{facialVerificationProgress}%</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-white text-sm">Camera Ready</div>
                    <div className="text-[#8ecdb7] text-xs">Click start to begin</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleFacialVerification}
                disabled={isVerifying}
                className="bg-[#019863] hover:bg-[#017a4f] disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-bold"
              >
                {isVerifying ? 'Verifying...' : 'Start Facial Recognition'}
              </button>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Registration step
  if (verificationStep === 'register') {
    const entityTypes = [
      { id: 'patient', label: 'Patient', icon: '👤' },
      { id: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
      { id: 'insurance', label: 'Insurance Company', icon: '🛡️' },
      { id: 'auditor', label: 'Auditor', icon: '🔍' }
    ];

    const isProfessional = selectedEntityType !== 'patient';

    return (
      <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
        <div className="flex items-center gap-4 px-4 pb-3">
          <button
            onClick={handleBackToChoose}
            className="text-[#8ecdb7] hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h2 className="text-white tracking-light text-[28px] font-bold leading-tight">
            Register Account
          </h2>
        </div>
        
        <div className="px-4 py-6">
          <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Create New Account
            </h3>
            
            <form className="space-y-4">
              {/* Entity Type Selection */}
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-3">Entity Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {entityTypes.map((entity) => (
                    <button
                      key={entity.id}
                      type="button"
                      onClick={() => setSelectedEntityType(entity.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedEntityType === entity.id
                          ? 'bg-[#019863] border-[#019863] text-white'
                          : 'bg-[#214a3c] border-[#2f6a55] text-[#8ecdb7] hover:bg-[#2f6a55]'
                      }`}
                    >
                      <span className="text-xl">{entity.icon}</span>
                      <span className="text-sm font-medium">{entity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                />
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Nationality</label>
                <select className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]">
                  <option value="">Select nationality</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                  <option value="ES">Spain</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Gender</label>
                <select className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#8ecdb7] text-sm font-medium mb-2">Address</label>
                <textarea
                  className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                  rows={3}
                  placeholder="Enter your address"
                ></textarea>
              </div>

              {/* Conditional Fields based on Entity Type */}
              {isProfessional ? (
                <div>
                  <label className="block text-[#8ecdb7] text-sm font-medium mb-2">
                    {selectedEntityType === 'doctor' ? 'Medical License' : 
                     selectedEntityType === 'insurance' ? 'Insurance License' : 
                     'Auditor License'}
                  </label>
                  <div className="border-2 border-dashed border-[#2f6a55] rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="license-upload"
                    />
                    <label htmlFor="license-upload" className="cursor-pointer">
                      <div className="text-[#8ecdb7] mb-2">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-[#8ecdb7] text-sm">
                        {licenseFile ? (
                          <span className="text-[#019863]">✓ {licenseFile.name}</span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span> or drag and drop
                            <br />
                            PDF, JPG, PNG up to 10MB
                          </>
                        )}
                      </p>
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[#8ecdb7] text-sm font-medium mb-2">National ID Number</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-[#214a3c] text-white rounded-lg p-3 border border-[#2f6a55] focus:outline-none focus:border-[#019863]"
                    placeholder="Enter your national identification number"
                  />
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBackToChoose}
                  className="flex-1 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    displayToast("Account registered successfully! Redirecting to dashboard...");
                    localStorage.setItem('isKYCVerified', 'true');
                    setTimeout(() => {
                      router.push("/dashboard");
                    }, 1500);
                  }}
                  className="flex-1 bg-[#019863] hover:bg-[#017a4f] text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Toast notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  return null;
}
