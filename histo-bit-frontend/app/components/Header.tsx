"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../hooks/useTheme';
import VerticalDarkModeLogo from '@/Logos/VerticalDarkMode.png';

interface HeaderProps {
  showNavigation?: boolean;
  currentPage?: string;
}

export default function Header({ showNavigation = true, currentPage }: HeaderProps) {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if wallet is connected from localStorage
    const savedUser = localStorage.getItem('histoBitUser');
    const savedConnection = localStorage.getItem('isWalletConnected');
    
    if (savedUser && savedConnection === 'true') {
      setCurrentUser(JSON.parse(savedUser));
      setIsWalletConnected(true);
    }
  }, []);

  const connectWallet = (walletType: string) => {
    // Simulate wallet connection process
    const user = {
      address: '0x1234...5678',
      walletType: walletType,
      name: 'Demo User'
    };
    
    localStorage.setItem('histoBitUser', JSON.stringify(user));
    localStorage.setItem('isWalletConnected', 'true');
    
    setCurrentUser(user);
    setIsWalletConnected(true);
    setShowWalletModal(false);

    // Redirect to KYC page if Demo Mode is selected
    if (walletType === 'Demo') {
      router.push('/kyc');
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('histoBitUser');
    localStorage.removeItem('isWalletConnected');
    setCurrentUser(null);
    setIsWalletConnected(false);
  };

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#214a3c] px-10 py-3">
        <div className="flex items-center gap-4 text-white">
          <img src={VerticalDarkModeLogo.src ? VerticalDarkModeLogo.src : VerticalDarkModeLogo}
            alt="Histo Bit Logo"
            className="w-25 h-10"
          />
          {/*<h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Histo Bit</h2>*/}
        </div>
        
        <div className="flex flex-1 justify-end gap-8">
          {showNavigation && (
            <div className="flex items-center gap-9">
              <Link href="/dashboard" className="text-white text-sm font-medium leading-normal hover:text-[#8ecdb7] transition-colors">
                Dashboard
              </Link>
              <Link href="/documents" className="text-white text-sm font-medium leading-normal hover:text-[#8ecdb7] transition-colors">
                Documents
              </Link>
              <Link href="/permissions" className="text-white text-sm font-medium leading-normal hover:text-[#8ecdb7] transition-colors">
                Permissions
              </Link>
              <Link href="/kyc" className="text-white text-sm font-medium leading-normal hover:text-[#8ecdb7] transition-colors">
                KYC
              </Link>
              <Link href="/profile" className="text-white text-sm font-medium leading-normal hover:text-[#8ecdb7] transition-colors">
                Profile
              </Link>
            </div>
          )}
          
          <button
            id="themeToggle"
            onClick={toggleTheme}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#214a3c] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#2f6a55] transition-colors"
          >
            <div className="text-white" id="themeIcon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" id="sunIcon">
                <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256" id="moonIcon" style={{ display: 'none' }}>
                <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37.65A104.73,104.73,0,0,0,136,224a103.09,103.09,0,0,0,62.36-20.88,104.84,104.84,0,0,0,37.65-52.91A8,8,0,0,0,233.54,142.23ZM188.9,193.08A88.9,88.9,0,0,1,128,208a88.64,88.64,0,0,1-42.92-10.81,8,8,0,0,0-4.59-1.23,8,8,0,0,0-1.66.18,104.87,104.87,0,0,0,75.05-75.05,8,8,0,0,0,.52-4.43,8,8,0,0,0-1.85-4.61A88.12,88.12,0,0,1,188.9,193.08Z"></path>
              </svg>
            </div>
          </button>
          
          {isWalletConnected ? (
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChlk-btlRNpgNg-z8T51q402ptG40lJQvlDeG1hjNdGYW9-bKJ0mNVCHEKJ_4V7cFMs4YWHO1rLBziqn_y0AD4IvzOqGyPSEgBD4tNeLoumL6cDSB9Xs8v45njnPv1a9jXVPDCjg_XNFUC3aB1DxGE-fM38kfe3cveRtuU2SJEe7KiSaZy6OvKWS_5qz7hcJpKC29yAT4YunaNpvHclcEjx36NJjgPvtP1P9OgHhVu1laiE8DsmWxvVp4HDLrWeBESWRr9mcSUtQ0")' }}
              ></div>
              <button
                onClick={disconnectWallet}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#214a3c] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2f6a55] transition-colors"
              >
                <span className="truncate">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#019863] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#017a4f] transition-colors"
            >
              <span className="truncate">Connect Wallet</span>
            </button>
          )}
        </div>
      </header>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#17352b] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2f6a55] relative">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Connect Wallet</h3>
            <div className="space-y-3">
              <button 
                onClick={() => connectWallet('MetaMask')}
                className="w-full flex items-center justify-center gap-3 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-3 px-4 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.49 1L13.5 8.99L15.51 11L21.49 1Z"/>
                  <path d="M2.51 1L10.5 8.99L8.49 11L2.51 1Z"/>
                  <path d="M21.49 23L13.5 15.01L15.51 13L21.49 23Z"/>
                  <path d="M2.51 23L10.5 15.01L8.49 13L2.51 23Z"/>
                </svg>
                MetaMask
              </button>
              <button 
                onClick={() => connectWallet('Core Wallet')}
                className="w-full flex items-center justify-center gap-3 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-3 px-4 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="10" fill="#000000"/>
                  <rect x="4" y="4" width="16" height="16" rx="8" fill="#ffffff"/>
                  <text x="12" y="15" textAnchor="middle" fill="#000000" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="900">CORE</text>
                </svg>
                Core Wallet
              </button>
              <button 
                onClick={() => connectWallet('WalletConnect')}
                className="w-full flex items-center justify-center gap-3 bg-[#214a3c] hover:bg-[#2f6a55] text-white py-3 px-4 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
                </svg>
                WalletConnect
              </button>
              <button 
                onClick={() => connectWallet('Demo')}
                className="w-full flex items-center justify-center gap-3 bg-[#019863] hover:bg-[#017a4f] text-white py-3 px-4 rounded-lg transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
                </svg>
                Demo Mode
              </button>
            </div>
            <button 
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 text-[#8ecdb7] hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
