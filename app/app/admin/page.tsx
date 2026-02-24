'use client';

import React from 'react';
import AdminPanelPremium from '../../../components/AdminPanelPremium';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full">
      <AdminPanelPremium onBack={() => router.push('/app')} />
    </div>
  );
}
