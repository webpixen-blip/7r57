"use client";

import React, { useState } from 'react';
import { Video, Download, Languages, Music, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (!url) return;
    setLoading(true);
    router.push(`/editor?url=${encodeURIComponent(url)}`);
  };

  const stats = [
    { label: 'Videos Processed', value: '0', icon: <Video />, color: '#dbeafe' },
    { label: 'Space Saved', value: '0 MB', icon: <Download />, color: '#dcfce7' },
    { label: 'Languages Supported', value: '2', icon: <Languages />, color: '#f3e8ff' },
    { label: 'Cloud Storage', value: '2 GB', icon: <Music />, color: '#ffe4e6' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome back 👋</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Ready to create something amazing today?</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: stat.color, padding: '1rem', borderRadius: '12px' }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card glass-effect" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>New Video Project</h3>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="input-group" style={{ background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}><LinkIcon size={20} /></div>
            <input type="text" placeholder="Paste YouTube link here..." className="input-main" style={{ border: 'none' }} value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="btn btn-primary" onClick={handleStart} disabled={loading}>{loading ? 'Loading...' : 'Start Editing'} <ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
