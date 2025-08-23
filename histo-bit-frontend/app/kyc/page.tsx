"use client";

import React from "react";
import Header from "../components/Header";
import KYCComponent from "../components/KYCComponent";

export default function KYCPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#10231c] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <KYCComponent />
        </div>
      </div>
    </div>
  );
}
