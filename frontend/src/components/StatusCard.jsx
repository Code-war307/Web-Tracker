import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Clock, Trash2, ExternalLink, Activity } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export const StatusCard = ({ website, latestCheck, onDelete }) => {
  const status = latestCheck?.status || 'UNKNOWN';

  const theme = {
    UP: { color: '#10b981', label: 'Operational' },
    SLOW: { color: '#f59e0b', label: 'Degraded' },
    DOWN: { color: '#f43f5e', label: 'Outage' },
    UNKNOWN: { color: '#64748b', label: 'Pending' },
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="group relative w-full"
    >
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -inset-1 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"
        style={{ background: `radial-gradient(circle, ${theme.color}15 0%, transparent 70%)` }}
      />

      <div className="relative flex flex-col bg-[#0B0F1A] border border-white/5 rounded-[1.2rem] overflow-hidden backdrop-blur-3xl shadow-xl">
        
        {/* Header Section */}
        <div className="p-5 pb-3 flex justify-between items-start border-b border-white/[0.03]">
          <div className="min-w-0 z-20">
            <Link to={`/websites/${website.id}`}>
              <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300 truncate">
                {website.name}
              </h3>
            </Link>
            <a
              href={website.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 mt-1 text-slate-500 hover:text-white transition-colors w-fit"
            >
              <Globe className="w-3 h-3" />
              <span className="text-xs font-mono tracking-tighter truncate max-w-[200px]">
                {new URL(website.url).hostname}
              </span>
              <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(website.id); }}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Plasma & Info Row */}
        <div className="flex items-center gap-6 p-5 py-4">
          {/* Plasma Orb - Slightly Scaled for bigger text balance */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <motion.div
              animate={{ opacity: [0.4, 0, 0.4], scale: [0.9, 1.4, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border border-current"
              style={{ color: `${theme.color}33` }}
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-1 rounded-full border-2 border-transparent border-t-current"
              style={{ color: theme.color }}
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2.5 rounded-full border border-transparent border-b-current opacity-40"
              style={{ color: theme.color }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-7 h-7 rounded-full flex items-center justify-center relative shadow-lg"
              style={{ 
                backgroundColor: theme.color, 
                boxShadow: `0 0 20px 4px ${theme.color}44` 
              }}
            >
              <Activity className="w-3.5 h-3.5 text-white relative z-10" />
            </motion.div>
          </div>

          {/* Right Side Stats */}
          <div className="flex-1 min-w-0">
             <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold mb-1">Live Status</div>
             <div className="text-base font-black text-white italic tracking-tighter uppercase leading-none mb-3" style={{ color: theme.color }}>
               {theme.label}
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Latency</span>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {latestCheck?.response_time ? `${latestCheck.response_time}ms` : '--'}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Uptime</span>
                  <span className="text-xs font-mono text-slate-400">
                    {latestCheck?.checked_at ? formatDistanceToNow(new Date(latestCheck.checked_at)) : 'N/A'}
                  </span>
                </div>
             </div>
          </div>
        </div>

        {/* Global Navigation Link (Layered underneath buttons/external links) */}
        <Link to={`/websites/${website.id}`} className="absolute inset-0 z-10" aria-label="View Details" />
      </div>
    </motion.div>
  );
};