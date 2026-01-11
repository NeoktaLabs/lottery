import { Timer, Ticket, Coins, ArrowRight, Crown } from 'lucide-react';

interface RaffleCardProps {
  title: string;
  prize: string;
  ticketPrice: string;
  sold: number;
  total: number;
  endsIn: string;
  color?: 'pink' | 'purple' | 'blue' | 'gold' | 'silver' | 'bronze';
  rank?: number;
  creator?: string;
}

export function RaffleCard({ title, prize, ticketPrice, sold, total, endsIn, color = 'pink', rank, creator = "Player 1234" }: RaffleCardProps) {
  const progress = Math.min((sold / total) * 100, 100);

  type ThemeStyles = {
    bg: string;
    stub: string;
    accent: string;
    button: string;
    bar: string;
    dash: string;
    rankBg?: string;
  };

  const themes: Record<string, ThemeStyles> = {
    pink: {
      bg: 'bg-[#FFEBEE]', stub: 'bg-[#FFCDD2]', accent: 'text-[#E91E63]', button: 'bg-[#E91E63] hover:bg-[#C2185B]', bar: 'bg-[#E91E63]', dash: 'border-[#E91E63]/40', rankBg: undefined
    },
    purple: {
      bg: 'bg-[#F3E5F5]', stub: 'bg-[#E1BEE7]', accent: 'text-[#9C27B0]', button: 'bg-[#9C27B0] hover:bg-[#7B1FA2]', bar: 'bg-[#9C27B0]', dash: 'border-[#9C27B0]/40', rankBg: undefined
    },
    blue: {
      bg: 'bg-[#E3F2FD]', stub: 'bg-[#BBDEFB]', accent: 'text-[#2196F3]', button: 'bg-[#2196F3] hover:bg-[#1976D2]', bar: 'bg-[#2196F3]', dash: 'border-[#2196F3]/40', rankBg: undefined
    },
    gold: {
      bg: 'bg-yellow-50', stub: 'bg-yellow-100', accent: 'text-yellow-600', button: 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 shadow-yellow-200', bar: 'bg-yellow-500', dash: 'border-yellow-500/40', rankBg: 'bg-yellow-400 text-yellow-900'
    },
    silver: {
      bg: 'bg-slate-50', stub: 'bg-slate-100', accent: 'text-slate-600', button: 'bg-gradient-to-r from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 shadow-slate-200', bar: 'bg-slate-400', dash: 'border-slate-400/40', rankBg: 'bg-slate-300 text-slate-800'
    },
    bronze: {
      bg: 'bg-orange-50', stub: 'bg-orange-100', accent: 'text-amber-700', button: 'bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-orange-200', bar: 'bg-amber-700', dash: 'border-amber-700/40', rankBg: 'bg-amber-600 text-orange-100'
    }
  };

  const theme = themes[color];
  const isPodium = rank && rank <= 3;

  return (
    <div className="relative w-full max-w-[260px] mx-auto transition-transform hover:-translate-y-1 group z-0">
      
      {/* Rank Badge */}
      {rank && (
        <div className={`absolute -top-3 -left-3 w-9 h-9 ${theme.rankBg || 'bg-gray-800 text-white'} rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-30 transform -rotate-12`}>
          {rank === 1 ? <Crown size={16} /> : <span className="text-sm">#{rank}</span>}
        </div>
      )}

      {/* Ticket Mask */}
      <div className={`ticket-mask relative w-full ${theme.bg} rounded-2xl shadow-lg overflow-hidden flex flex-col ${isPodium && rank === 1 ? 'ring-4 ring-yellow-300 ring-offset-2' : ''}`}>
        
        {/* --- TOP STUB --- */}
        <div className={`${theme.stub} p-4 pt-6 pb-6 text-center relative rounded-t-2xl`}>
          <div className="flex justify-center items-center gap-1 mb-0.5 opacity-70">
             <Ticket size={12} /> 
             <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 leading-tight px-1 truncate">{title}</h3>
          
          <p className="text-[10px] text-gray-600/80 font-medium mb-1">by {creator}</p>
          
          <div className="flex flex-col items-center gap-0 mt-1">
            <span className="text-[9px] font-bold text-gray-600/70 uppercase">Win Prize</span>
            <span className={`text-2xl font-black ${theme.accent} drop-shadow-sm whitespace-nowrap`}>{prize}</span>
          </div>
        </div>

        {/* --- PERFORATION --- */}
        <div className="relative w-full h-0 z-10">
          <div className={`absolute top-0 left-4 right-4 border-b-2 border-dashed ${theme.dash}`}></div>
        </div>

        {/* --- BOTTOM BODY --- */}
        <div className="p-4 pt-5 flex-1 flex flex-col rounded-b-2xl">
          
          <div className="flex justify-between items-center mb-4 bg-white/60 p-2 rounded-lg border border-white/50 shadow-sm">
             <div className="text-left pl-1">
               <p className="text-[9px] font-bold text-gray-400 uppercase">Price</p>
               {/* UPDATED PRICE COLOR TO AMBER (GOLD) */}
               <p className="font-bold text-sm text-amber-600 flex items-center gap-1">
                 {ticketPrice} <Coins size={12} className="text-amber-500 fill-amber-500" />
               </p>
             </div>
             <div className="text-right pr-1">
               <p className="text-[9px] font-bold text-gray-400 uppercase">Ends In</p>
               <p className="font-mono text-[10px] font-bold text-gray-600 flex items-center justify-end gap-1">
                  <Timer size={10} /> {endsIn}
               </p>
             </div>
          </div>

          <div className="mt-auto mb-4">
             <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
               <span>{sold}/{total} Sold</span>
               <span>{Math.round(progress)}%</span>
             </div>
             <div className="w-full h-2.5 bg-gray-200/50 rounded-full overflow-hidden">
               <div 
                 className={`h-full ${theme.bar} rounded-full transition-all duration-1000 ease-out`} 
                 style={{ width: `${progress}%` }}
               ></div>
             </div>
          </div>

          <button className={`w-full ${theme.button} text-white font-bold py-2.5 rounded-xl shadow-md active:shadow-none active:translate-y-1 transition-all text-sm flex justify-center items-center gap-2 group`}>
            <span>PLAY NOW</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}