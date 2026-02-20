import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      <main className="max-w-md mx-auto px-4 pt-6">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
}
