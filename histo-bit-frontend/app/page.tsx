"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "./components/Header";

export default function Home() {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isKYCVerified, setIsKYCVerified] = useState(false);

  useEffect(() => {
    const savedConnection = localStorage.getItem('isWalletConnected');
    const savedKYC = localStorage.getItem('isKYCVerified');
    
    if (savedConnection === 'true') {
      setIsWalletConnected(true);
    }
    
    if (savedKYC === 'true') {
      setIsKYCVerified(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isWalletConnected) {
      if (isKYCVerified) {
        router.push('/dashboard');
      } else {
        router.push('/kyc');
      }
    } else {
      alert('Please connect your wallet first');
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header showNavigation={false} />
        
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Banner Image */}
            <div className="mb-8 flex justify-center">
              <Image 
                src="/Logos/Banner.jpg" 
                alt="Histo Bit Banner" 
                width={800}
                height={400}
                className="max-w-full h-auto max-h-96 rounded-lg shadow-lg"
                priority
              />
            </div>
            
            <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
              Secure Medical Records
              <span className="text-[#019863] block">on Blockchain</span>
            </h1>
            <p className="text-[#8ecdb7] text-xl mb-8 max-w-2xl mx-auto">
              Take control of your sensitive data with our decentralized platform. 
              Secure, private, and accessible when you need it most.
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                disabled={!isWalletConnected}
                className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] transition-colors ${
                  isWalletConnected
                    ? 'bg-[#019863] hover:bg-[#017a4f]'
                    : 'bg-[#214a3c] opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="truncate">
                  {isWalletConnected 
                    ? (isKYCVerified ? 'Go to Dashboard' : 'Complete KYC') 
                    : 'Connect Wallet First'
                  }
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-white text-3xl font-bold text-center mb-12">
              Why Choose Histo Bit?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6 text-center">
                <div className="text-[#019863] text-4xl mb-4">🔒</div>
                <h3 className="text-white text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-[#8ecdb7]">
                  Your medical records are encrypted and stored securely on the blockchain, 
                  ensuring complete privacy and control.
                </p>
              </div>
              
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6 text-center">
                <div className="text-[#019863] text-4xl mb-4">⚡</div>
                <h3 className="text-white text-xl font-bold mb-3">Instant Access</h3>
                <p className="text-[#8ecdb7]">
                  Access your medical records instantly from anywhere in the world, 
                  with full control over who can view your data.
                </p>
              </div>
              
              <div className="bg-[#17352b] rounded-lg border border-[#2f6a55] p-6 text-center">
                <div className="text-[#019863] text-4xl mb-4">🌐</div>
                <h3 className="text-white text-xl font-bold mb-3">Decentralized</h3>
                <p className="text-[#8ecdb7]">
                  Built on blockchain technology, ensuring your data is never controlled 
                  by a single entity or vulnerable to centralized attacks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#214a3c] py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[#8ecdb7] text-sm">
              © 2024 Histo Bit. All rights reserved. Secure medical records on the blockchain.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
