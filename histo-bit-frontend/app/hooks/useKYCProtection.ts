"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useKYCProtection() {
  const router = useRouter();
  const [isKYCVerified, setIsKYCVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKYCStatus = () => {
      const kycStatus = localStorage.getItem("isKYCVerified");
      const isVerified = kycStatus === "true";

      setIsKYCVerified(isVerified);
      setIsLoading(false);

      // If not verified, redirect to KYC page
      if (!isVerified) {
        router.push("/kyc");
      }
    };

    checkKYCStatus();
  }, [router]);

  return { isKYCVerified, isLoading };
}
