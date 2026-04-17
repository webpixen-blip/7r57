"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Scissors, Music, Type, Download, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function EditorPage() {
  const [loaded, setLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const searchParams = useSearchParams();
  const ytUrl = searchParams.get('url');

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [text, setText] = useState('');

  useEffect(() => {
    load();
    if (ytUrl) fetchMetadata(ytUrl);
  }, [ytUrl]);

  const fetchMetadata = async (url: string) => {
    try {
      const res = await fetch(`/api/video?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.streamUrl) {
        setVideoUrl(data.streamUrl);
        setEndTime(data.duration || 10);
      }
    } catch (err) { console.error(err); }
  };

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('progress', ({ progress }) => setProgress(Math.round(progress * 100)));
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  };

  const handleProcess = async () => {
    setProcessing(true);
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoUrl!));
    await ffmpeg.exec(['-i', 'input.mp4', '-ss', startTime.toString(), '-to', endTime.toString(), 'output.mp4']);
    const data = await ffmpeg.readFile('output.mp4');
    const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'video/mp4' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'edited_video.mp4'; a.click();
    setProcessing(false); setFinished(true);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 4rem)', display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="card glass-effect" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
          {videoUrl ? <video src={videoUrl} controls style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <p style={{ color: 'white' }}>Select a video</p>}
          {!loaded && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="var(--primary)" /></div>}
        </div>
      </div>

      <div className="card" style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h4 style={{ fontWeight: 800 }}>Editor Tools</h4>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>TRIM</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input type="number" value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} className="input-main" />
            <input type="number" value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} className="input-main" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleProcess} disabled={!videoUrl || processing}>
          {processing ? `Processing ${progress}%` : <><Download size={20} /> Export</>}
        </button>
        {finished && <p style={{ color: 'green' }}><CheckCircle2 size={16} /> Done!</p>}
      </div>
    </div>
  );
}
