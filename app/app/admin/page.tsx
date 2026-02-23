'use client';

import React from 'react';
import Admin100 from '../../../components/Admin100';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full">
      <Admin100 onBack={() => router.push('/app')} />
    </div>
  );
}
