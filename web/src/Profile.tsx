import React, { useState } from 'react';
import { User, Wallet, Ticket, PenTool, ArrowRight, Coins, Zap, AlertCircle, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { RaffleCard } from './RaffleCard';

export function Profile({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'vault' | 'tickets' | 'created'>('vault');

  // --- MOCK DATA ---
  // 1. CLAIMS (Matches contract claimableFunds / claimableNative)
  const vaultData = {
    usdc: 1550, // USDC to claim (e.g. from winnings or refunds)
    xtz: 4.2    // XTZ to claim (e.g. from gas refunds or native surplus)
  };

  // 2. MY TICKETS
  const myTickets = [
    { id: 1, title: "Whale Watcher", prize: 5000, price: 20, sold: 12, total: 200, deadline: Date.now() + 86400000 * 6, color: "gold", myCount: 5 },
    { id: 4, title: "Quickfire Draw", prize: 100, price: 1, sold: 48, total: 50, deadline: Date.now() + 1800000, color: "pink", myCount: 10 },
  ];

  // 3. CREATED RAFFLES
  const myRaffles = [
    { id: 99, title: "My First Raffle", prize: 500, price: 5, sold: 20, total: 100, deadline: Date.now() - 100000, color: "purple", status: "Ended" },
    { id: 100, title: "Community Event", prize: 1000, price: 2, sold: 85, total: 200, deadline: Date.now() + 86400000 * 2, color: "blue", status: "Active" },
  ];

  const handleClaim = (asset: 'USDC' | 'XTZ') => {
    alert(`Triggering contract: withdraw${asset === 'USDC' ? 'Funds' : 'Native'}()`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Player ...8821</h1>
            <p className="text-gray-500 font-bold text-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Connected via MetaMask
            </p>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 mb-8 no-scrollbar">
          <button 
            onClick={() => setActiveTab('vault')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'vault' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <Wallet size={18} /> The Vault {vaultData.usdc > 0 && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'tickets' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <Ticket size={18} /> My Tickets <span className="bg-white/20 px-1.5 rounded text-xs">{myTickets.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('created')}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === 'created' ? 'bg-purple-500 text-white shadow-lg shadow-purple-200 scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <PenTool size={18} /> Created <span className="bg-white/20 px-1.5 rounded text-xs">{myRaffles.length}</span>
          </button>
        </div>

        {/* --- CONTENT AREA --- */}
        
        {/* 1. THE VAULT */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* USDC CARD */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <Coins size={120} className="text-amber-500" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Coins size={20} /></div>
                   <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Claimable Winnings</span>
                 </div>
                 <div className="text-5xl font-black text-gray-800 mb-1">{vaultData.usdc}</div>
                 <div className="text-amber-600 font-bold mb-8">USDC</div>
                 
                 {vaultData.usdc > 0 ? (
                   <button 
                     onClick={() => handleClaim('USDC')}
                     className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl shadow-[0_4px_0_0_#b45309] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                   >
                     WITHDRAW FUNDS
                   </button>
                 ) : (
                   <div className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                     Nothing to Claim
                   </div>
                 )}
               </div>
            </div>

            {/* XTZ CARD */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                 <Zap size={120} className="text-green-500" />
               </div>
               <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="bg-green-100 p-2 rounded-xl text-green-600"><Zap size={20} /></div>
                   <span className="font-bold text-gray-400 uppercase text-xs tracking-wider">Gas Refunds</span>
                 </div>
                 <div className="text-5xl font-black text-gray-800 mb-1">{vaultData.xtz}</div>
                 <div className="text-green-600 font-bold mb-8">XTZ</div>

                 {vaultData.xtz > 0 ? (
                   <button 
                     onClick={() => handleClaim('XTZ')}
                     className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-[0_4px_0_0_#15803d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                   >
                     WITHDRAW NATIVE
                   </button>
                 ) : (
                   <div className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                     Nothing to Claim
                   </div>
                 )}
               </div>
            </div>

            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
               <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1"><AlertCircle size={18} /></div>
               <div>
                 <h4 className="font-bold text-blue-900 text-sm">How claims work</h4>
                 <p className="text-blue-700/80 text-xs mt-1 leading-relaxed">
                   When you win a raffle or receive a refund (from a cancelled raffle), the funds are stored in the Smart Contract. You must manually withdraw them here to send them to your wallet.
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* 2. MY TICKETS */}
        {activeTab === 'tickets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {myTickets.map(ticket => (
               <div key={ticket.id} className="relative group">
                 {/* Badge */}
                 <div className="absolute top-2 right-2 z-20 bg-black/80 text-white px-3 py-1 rounded-full font-bold text-xs shadow-md border border-white/20">
                   You own {ticket.myCount}
                 </div>
                 <div onClick={() => onNavigate(ticket.id.toString())} className="cursor-pointer transform hover:-translate-y-1 transition-transform">
                   <RaffleCard 
                     {...ticket} 
                     ticketPrice={`${ticket.price} USDC`} 
                     prize={`${ticket.prize} USDC`}
                     endsIn="06d 12h" // Mock
                     color={ticket.color as any}
                   />
                 </div>
               </div>
             ))}
             {myTickets.length === 0 && (
               <div className="col-span-full text-center py-20 text-gray-400 font-bold">
                 You haven't entered any raffles yet.
               </div>
             )}
          </div>
        )}

        {/* 3. CREATED RAFFLES */}
        {activeTab === 'created' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {myRaffles.map(raffle => (
               <div key={raffle.id} className="relative group">
                 <div className={`absolute top-2 right-2 z-20 px-3 py-1 rounded-full font-bold text-xs shadow-md border border-white/20 ${raffle.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                   {raffle.status}
                 </div>
                 <div onClick={() => onNavigate(raffle.id.toString())} className="cursor-pointer transform hover:-translate-y-1 transition-transform">
                   <RaffleCard 
                     {...raffle} 
                     ticketPrice={`${raffle.price} USDC`} 
                     prize={`${raffle.prize} USDC`}
                     endsIn={raffle.status === 'Active' ? "02d 05h" : "Ended"}
                     color={raffle.color as any}
                     creator="You"
                   />
                 </div>
                 {raffle.status === 'Active' && (
                   <button className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-100 hover:bg-red-200 text-red-600 border border-red-200 px-4 py-1.5 rounded-full font-bold text-xs shadow-sm transition-colors opacity-0 group-hover:opacity-100">
                     Cancel Raffle
                   </button>
                 )}
               </div>
             ))}
          </div>
        )}

      </div>
    </div>
  );
}