import React, { useState } from 'react';
import { Ticket, Timer, Coins, ArrowRight, User, ShieldCheck, History, Trophy, Share2, Info } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function RaffleDetails({ onBack }: { onBack: () => void }) {
  const [ticketCount, setTicketCount] = useState(1);
  const ticketPrice = 5; // USDC
  const userBalance = 1250; // USDC (Mock)

  // Calculate total cost
  const totalCost = ticketCount * ticketPrice;
  const canAfford = userBalance >= totalCost;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 animate-fade-in-up">
      
      {/* NAVIGATION HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="bg-white/50 hover:bg-white/80 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-sm"
        >
          <ArrowRight size={20} className="rotate-180 text-gray-700" />
        </button>
        <span className="text-white font-bold text-lg drop-shadow-md">Back to Park</span>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* --- LEFT COLUMN: THE BIG TICKET (4 cols) --- */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="relative transform hover:scale-[1.02] transition-transform duration-500">
             {/* Glowing Backlight */}
             <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full transform translate-y-10"></div>
             
             {/* THE GIANT TICKET */}
             <div className="ticket-mask relative w-full bg-[#FFEBEE] rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
                {/* Top Stub */}
                <div className="bg-[#FFCDD2] p-8 pb-12 text-center relative border-b-2 border-dashed border-pink-400/40">
                  <div className="flex justify-center items-center gap-2 mb-2 opacity-60">
                     <Ticket size={16} /> 
                     <span className="text-xs font-black uppercase tracking-[0.2em]">Verified Raffle</span>
                  </div>
                  <h1 className="text-3xl font-black text-gray-800 leading-tight mb-2">Weekend Jackpot</h1>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Created by Player ...8821</p>
                  
                  <div className="bg-white/40 rounded-2xl p-4 border border-white/50 backdrop-blur-sm mx-auto inline-block min-w-[200px]">
                    <span className="text-xs font-bold text-gray-600 uppercase block mb-1">Win Prize</span>
                    <span className="text-4xl font-black text-[#E91E63] drop-shadow-sm">1,000 USDC</span>
                  </div>
                </div>

                {/* Bottom Body */}
                <div className="p-8 space-y-6 bg-[#FFEBEE]">
                   {/* Stat Grid */}
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/60 p-3 rounded-xl border border-pink-100">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ticket Price</p>
                       <p className="font-bold text-lg text-amber-600 flex items-center gap-1">
                         5 <Coins size={16} className="fill-amber-500" />
                       </p>
                     </div>
                     <div className="bg-white/60 p-3 rounded-xl border border-pink-100 text-right">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ends In</p>
                       <p className="font-mono font-bold text-lg text-gray-700 flex items-center justify-end gap-1">
                         <Timer size={16} /> 02d 14h
                       </p>
                     </div>
                   </div>

                   {/* Progress Bar */}
                   <div>
                     <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                       <span>450 Tickets Sold</span>
                       <span>1,000 Total</span>
                     </div>
                     <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#E91E63] w-[45%] rounded-full shadow-[0_0_10px_rgba(233,30,99,0.5)]"></div>
                     </div>
                   </div>

                   {/* Share Button */}
                   <button className="w-full py-3 rounded-xl border-2 border-pink-200 text-pink-700 font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 text-sm">
                     <Share2 size={16} /> Share with Friends
                   </button>
                </div>
             </div>
          </div>
        </div>


        {/* --- RIGHT COLUMN: THE GAME CONSOLE (8 cols) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. BUYING PANEL */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <Ticket size={120} className="text-amber-500 rotate-12" />
             </div>

             <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
               <span className="bg-amber-100 text-amber-700 p-2 rounded-lg"><Coins size={24} /></span>
               Buy Tickets
             </h2>

             {/* Ticket Stepper */}
             <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
               <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                 <button 
                   onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                   className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-black text-xl disabled:opacity-50"
                 >-</button>
                 <div className="w-16 text-center">
                   <span className="text-2xl font-black text-gray-800">{ticketCount}</span>
                   <span className="block text-[10px] font-bold text-gray-400 uppercase">Tickets</span>
                 </div>
                 <button 
                   onClick={() => setTicketCount(ticketCount + 1)}
                   className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-black text-xl"
                 >+</button>
               </div>

               {/* Quick Select */}
               <div className="flex gap-2">
                 {[5, 10, 20].map(num => (
                   <button 
                     key={num}
                     onClick={() => setTicketCount(num)}
                     className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-colors text-sm"
                   >
                     {num}x
                   </button>
                 ))}
               </div>
             </div>

             {/* Summary & Action */}
             <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <p className="text-sm font-bold text-gray-400 uppercase mb-1">Total Cost</p>
                   <p className="text-4xl font-black text-amber-600 flex items-center gap-2">
                     {totalCost} <span className="text-xl text-amber-600/60 font-bold">USDC</span>
                   </p>
                   {!canAfford && <p className="text-xs font-bold text-red-500 mt-1">Insufficient Balance</p>}
                </div>

                <button 
                  disabled={!canAfford}
                  className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-5 rounded-2xl font-black shadow-[0_6px_0_0_#b45309] active:shadow-none active:translate-y-2 transition-all text-xl flex items-center justify-center gap-3"
                >
                  <Ticket size={24} />
                  BUY NOW
                </button>
             </div>
          </div>


          {/* 2. PARTICIPANTS LIST (Social Proof) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={18} className="text-blue-500" /> Recent Entries
                </h3>
                <div className="space-y-3">
                  {[1,2,3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-white/60">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                           0x
                         </div>
                         <div>
                           <p className="font-bold text-sm text-gray-700">Player ...829{i}</p>
                           <p className="text-[10px] text-gray-400">2 minutes ago</p>
                         </div>
                       </div>
                       <div className="font-bold text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                         +5 Tickets
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* 3. PROVABLY FAIR INFO (Trust) */}
             <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-500" /> Fairness Verified
                </h3>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <div className="mt-1"><Info size={16} className="text-gray-400" /></div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {/* CHANGED FROM CHAINLINK TO GENERIC: */}
                        This raffle uses <strong>Verifiable Randomness</strong> to generate a winning number. The process is cryptographic and cannot be tampered with by the creators.
                      </p>
                   </div>
                   <div className="bg-green-50 border border-green-100 p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-green-700 uppercase">Contract Address</span>
                        <a href="#" className="text-[10px] font-bold text-green-600 underline hover:text-green-800">View on Explorer</a>
                      </div>
                      <code className="block font-mono text-xs text-green-800 bg-green-100/50 p-1 rounded">0x71C...92A1</code>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}