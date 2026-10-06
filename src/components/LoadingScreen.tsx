import { useState, useEffect } from 'react';

import obaolLogo from '@/assets/OBAOL-Supreme-Logo.png';

const MESSAGES = [
  'Loading your talent pipeline…',
  'Fetching candidate profiles…',
  'Checking interview schedules…',
  'Syncing recruitment data…',
  'Preparing your dashboard…',
  'Warming up Chitragupta…',
  'Crunching pipeline metrics…',
  'Almost there…',
];

export function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.12),transparent_46%),hsl(var(--background))] gap-8 px-4">
      <div className="rounded-2xl bg-[#0E0D0A] px-7 py-2 shadow-xl ring-1 ring-primary/30">
        <img
          src={obaolLogo}
          alt="OBAOL Supreme"
          className="h-20 w-52 object-contain select-none"
        />
      </div>

      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p
        className="text-sm text-muted-foreground transition-opacity duration-300 h-5 text-center"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
}
