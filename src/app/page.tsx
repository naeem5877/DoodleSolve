'use client';
import DoodleSolve from '@/components/DoodleSolve';
import Header from '@/components/Header';
import { useState } from 'react';
import type { AppMode } from '@/components/DoodleSolve';

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('doodle');
  return (
    <>
      <Header appMode={appMode} setAppMode={setAppMode} />
      <main className="flex-grow p-4 sm:p-6 md:p-8 pt-0">
        <DoodleSolve appMode={appMode} />
      </main>
    </>
  );
}
