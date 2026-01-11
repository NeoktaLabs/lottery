import React, { useState } from 'react';
import { ArrowRight, Ticket, Coins, Clock, Image as ImageIcon, Sparkles, AlertCircle, Trophy, Ban, CheckCircle2, Layers } from 'lucide-react';
import { RaffleCard } from './RaffleCard';

export function CreateRaffle({ onBack }: { onBack: () => void }) {
  
  // --- SMART CONTRACT CONSTANTS ---
  const MAX_TITLE_LENGTH = 50; 
  const MIN_DURATION_SECONDS = 600; // 10 minutes
  const MAX_BATCH_BUY = 1000;
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: '',
    prizeAmount: '',      // winningPot (USDC)
    ticketPrice: '',      // ticketPrice (USDC)
    minTickets: '',       // minTickets (Soft Cap)
    maxTickets: '',       // maxTickets (Hard Cap)
    minPurchaseAmount: '1', // minPurchaseAmount (Batch Size)
    // Duration
    durationDays: '',
    durationHours: '',
    durationMinutes: '',
    theme: 'pink' as const
  });

  // --- PREVIEW CALCULATIONS ---
  const titlePreview = formData.title || "Untitled Raffle";
  const prizePreview = formData.prizeAmount ? `${formData.prizeAmount} USDC` : "0 USDC";
  const pricePreview = formData.ticketPrice ? `${formData.ticketPrice} USDC` : "0 USDC";
  
  const totalPreview = formData.maxTickets 
    ? parseInt(formData.maxTickets) 
    : (formData.minTickets ? parseInt(formData.minTickets) * 2 : 100); 

  const formatDuration = () => {
    const d = formData.durationDays ? `${formData.durationDays}d` : '';
    const h = formData.durationHours ? `${formData.durationHours}h` : '';
    const m = formData.durationMinutes ? `${formData.durationMinutes}m` : '';
    return `${d} ${h} ${m}`.trim() || '24h';
  };

  const getTotalSeconds = () => {
    const d = parseInt(formData.durationDays || '0') * 86400;
    const h = parseInt(formData.durationHours || '0') * 3600;
    const m = parseInt(formData.durationMinutes || '0') * 60;
    return d + h + m;
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- 1. TITLE VALIDATION ---
    if (!formData.title.trim()) {
      alert("Raffle Title is required.");
      return;
    }
    if (formData.title.length > MAX_TITLE_LENGTH) {
      alert(`Title is too long (Max ${MAX_TITLE_LENGTH} characters).`);
      return;
    }

    // --- 2. PRIZE & PRICE VALIDATION ---
    if (!formData.prizeAmount || parseFloat(formData.prizeAmount) <= 0) {
      alert("Prize Pot (USDC) is required and must be greater than 0.");
      return;
    }
    if (!formData.ticketPrice || parseFloat(formData.ticketPrice) <= 0) {
      alert("Ticket Price (USDC) is required and must be greater than 0.");
      return;
    }

    // --- 3. TICKET LIMITS VALIDATION ---
    if (!formData.minTickets || parseInt(formData.minTickets) <= 0) {
      alert("Minimum tickets (Soft Cap) is required.");
      return;
    }
    // Note: Max tickets is optional (can be empty)

    // --- 4. BATCH SIZE VALIDATION ---
    if (!formData.minPurchaseAmount || parseInt(formData.minPurchaseAmount) < 1) {
      alert("Min Purchase Amount must be at least 1.");
      return;
    }
    if (parseInt(formData.minPurchaseAmount) > MAX_BATCH_BUY) {
      alert(`Min purchase amount cannot exceed ${MAX_BATCH_BUY}.`);
      return;
    }

    // --- 5. DURATION VALIDATION ---
    if (getTotalSeconds() < MIN_DURATION_SECONDS) {
      alert("Duration must be at least 10 minutes.");
      return;
    }

    // SIMULATION
    console.log("Validation Passed! Creating Raffle...");
    console.log(`Title: ${formData.title}`);
    console.log(`Pot: ${formData.prizeAmount} USDC`);
    alert("Validation Successful!\nTriggering Wallet Transaction...");
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 animate-fade-in-up">
      
      {/* HEADER */}
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
        
        {/* --- LEFT COLUMN: THE FORM (7 cols) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-xl">
             
             <div className="flex items-center gap-3 mb-8">
               <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                 <Sparkles size={24} />
               </div>
               <div>
                 <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Create Raffle</h1>
                 <p className="text-sm text-gray-500 font-medium">Mint a new ticket series to the blockchain.</p>
               </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
               
               {/* 1. TITLE (Mandatory) */}
               <div>
                 <div className="flex justify-between items-center mb-2 ml-1">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Raffle Title</label>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">Required</span>
                    </div>
                    <span className={`text-[10px] font-bold ${formData.title.length >= MAX_TITLE_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                      {formData.title.length}/{MAX_TITLE_LENGTH}
                    </span>
                 </div>
                 <input 
                   type="text" 
                   name="title"
                   value={formData.title} 
                   onChange={handleChange}
                   maxLength={MAX_TITLE_LENGTH}
                   required // HTML5 validation
                   placeholder="e.g. Bored Ape Giveaway"
                   className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all placeholder:text-gray-300"
                 />
               </div>

               {/* 2. PRIZE & PRICE ROW (Mandatory) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Prize Pot (USDC)</label>
                   <div className="relative">
                     <input 
                       type="number" 
                       name="prizeAmount"
                       value={formData.prizeAmount} 
                       onChange={handleChange}
                       required
                       placeholder="1000"
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                       <Trophy size={20} />
                     </div>
                   </div>
                   <p className="text-[10px] text-amber-600 mt-1.5 ml-1 font-bold">
                     ⚠️ Required.
                   </p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Ticket Price (USDC)</label>
                   <div className="relative">
                     <input 
                       type="number" 
                       name="ticketPrice"
                       value={formData.ticketPrice} 
                       onChange={handleChange}
                       required
                       placeholder="5"
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                       <Coins size={20} />
                     </div>
                   </div>
                 </div>
               </div>

               {/* 3. LIMITS ROW */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* MIN TICKETS (Mandatory) */}
                 <div>
                   <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Min Tickets</label>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">Required</span>
                   </div>
                   <div className="relative">
                     <input 
                       type="number" 
                       name="minTickets"
                       value={formData.minTickets} 
                       onChange={handleChange}
                       required
                       placeholder="10"
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                       <CheckCircle2 size={20} />
                     </div>
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                     Soft Cap (Refunds if not met).
                   </p>
                 </div>

                 {/* MAX TICKETS (Optional) */}
                 <div>
                   <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Max Tickets</label>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">Optional</span>
                   </div>
                   <div className="relative">
                     <input 
                       type="number" 
                       name="maxTickets"
                       value={formData.maxTickets} 
                       onChange={handleChange}
                       placeholder="∞"
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                       <Ban size={20} className="rotate-90" />
                     </div>
                   </div>
                 </div>
               </div>

               {/* 4. ADVANCED: MIN PURCHASE & DURATION */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* MIN PURCHASE AMOUNT */}
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Min Buy Amount</label>
                    <div className="relative">
                     <input 
                       type="number" 
                       name="minPurchaseAmount"
                       value={formData.minPurchaseAmount} 
                       onChange={handleChange}
                       required
                       min="1"
                       max={MAX_BATCH_BUY}
                       placeholder="1"
                       className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-5 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                     />
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                       <Layers size={20} />
                     </div>
                   </div>
                 </div>

                 {/* DURATION */}
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Duration</label>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <input 
                          type="number" 
                          name="durationDays"
                          value={formData.durationDays} 
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-2 py-4 text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                        <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold text-gray-400 uppercase">Days</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          name="durationHours"
                          value={formData.durationHours} 
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          max="23"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-2 py-4 text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                        <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold text-gray-400 uppercase">Hrs</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          name="durationMinutes"
                          value={formData.durationMinutes} 
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          max="59"
                          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg font-bold rounded-xl px-2 py-4 text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                        <span className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold text-gray-400 uppercase">Mins</span>
                      </div>
                   </div>
                 </div>
               </div>

               {/* 5. THEME SELECTOR */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Ticket Theme (Preview Only)</label>
                 <div className="flex gap-3">
                   {[
                     { id: 'pink', bg: 'bg-pink-500' },
                     { id: 'purple', bg: 'bg-purple-500' },
                     { id: 'blue', bg: 'bg-blue-500' },
                     { id: 'gold', bg: 'bg-yellow-500' },
                   ].map((theme) => (
                     <button
                       key={theme.id}
                       type="button"
                       onClick={() => setFormData({...formData, theme: theme.id as any})}
                       className={`w-12 h-12 rounded-full ${theme.bg} transition-all transform hover:scale-110 flex items-center justify-center ${formData.theme === theme.id ? 'ring-4 ring-gray-200 scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`}
                     >
                        {formData.theme === theme.id && <div className="w-3 h-3 bg-white rounded-full" />}
                     </button>
                   ))}
                 </div>
               </div>

               {/* SUBMIT SECTION */}
               <div className="pt-4 border-t border-gray-100 mt-6">
                 <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-xl shadow-[0_4px_0_0_#b45309] active:shadow-none active:translate-y-1 transition-all text-lg flex items-center justify-center gap-2">
                   APPROVE USDC & MINT
                 </button>
                 <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 font-medium">
                   <AlertCircle size={14} className="text-gray-400" />
                   <span>Requires Energy Coins (XTZ) for gas.</span>
                 </div>
               </div>

             </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
        <div className="lg:col-span-5 hidden lg:block sticky top-28">
           <div className="text-center mb-6">
             <h3 className="text-white font-bold text-xl drop-shadow-md">Live Preview</h3>
             <p className="text-white/80 text-sm">This is how your ticket will look.</p>
           </div>
           
           <div className="transform scale-110 origin-top">
              <RaffleCard 
                title={titlePreview}
                prize={prizePreview}
                ticketPrice={pricePreview}
                sold={0}
                total={totalPreview}
                endsIn={formatDuration()} 
                color={formData.theme}
                creator="You"
              />
           </div>

           <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 mt-16 text-white/90">
             <h4 className="font-bold flex items-center gap-2 mb-2">
               <ImageIcon size={16} /> Pro Tip
             </h4>
             <p className="text-xs leading-relaxed opacity-80 mb-3">
               <strong>Min Tickets:</strong> Must be met by deadline, or raffle cancels (refunds enabled).
             </p>
             <p className="text-xs leading-relaxed opacity-80 mb-3">
               <strong>Min Buy Amount:</strong> Force players to buy at least X tickets at once.
             </p>
             <p className="text-xs leading-relaxed opacity-80 text-amber-300">
               <strong>Note:</strong> Your Prize Pot USDC is transferred immediately upon creation.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}