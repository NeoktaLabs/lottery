import React, { useState } from 'react';
import { User, Wallet, Ticket, PenTool, Coins, Zap, AlertCircle } from 'lucide-react';
import { RaffleCard } from '../components/RaffleCard';

export function Profile({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'vault' | 'tickets' | 'created'>('vault');
  const vaultData = { usdc: 1550, xtz: 4.2 };
  const myTickets = [{ id: 1, title: "Whale Watcher", prize: "5000", ticketPrice: "20", sold: 12, minTickets: 200, maxTickets: 0, endsIn: "06d 12h", color: "gold", myCount: 5 }];
  
  // Note: Real "My Tickets" requires an indexer (TheGraph). This is currently a placeholder UI.
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"><User size={32} /></div>
          <div><h1 className="text-3xl font-black text-white uppercase tracking-tight drop-shadow-md">Player Dashboard</h1><p className="text-white/80 font-bold text-sm flex items-center gap-1 drop-shadow-sm">Welcome back</p></div>
        </div>
        
        {/* (Rest of Profile UI code is identical to previous versions, just visual tabs) */}
        {/* Placeholder for brevity - logic doesn't change here until Indexer is added */}
        <div className="p-8 bg-white/80 rounded-3xl text-center"><p className="text-gray-500">History tracking requires an active Indexer.</p></div>
      </div>
    </div>
  );
}
