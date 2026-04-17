"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Scissors, 
  Crop, 
  Music, 
  History, 
  Settings,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
    { icon: <Video size={20} />, label: 'VidiEditor', href: '/editor' },
    { icon: <History size={20} />, label: 'Recent Edits', href: '/recent' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
          <Zap size={24} fill="white" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>VidiEdit</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: pathname === item.href ? 'var(--sidebar-active)' : 'inherit',
              background: pathname === item.href ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
