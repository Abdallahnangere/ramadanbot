'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/app/admin');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <p className="text-slate-700">Redirecting to admin...</p>
    </div>
  );
}