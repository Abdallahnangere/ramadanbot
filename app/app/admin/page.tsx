'use client';

import React from 'react';
import AdminDashboardEnhanced from '../../../components/AdminDashboardEnhanced';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full bg-black">
      <AdminDashboardEnhanced onBack={() => router.push('/app')} />
    </div>
  );
}
