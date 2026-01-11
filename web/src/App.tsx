import React, { useState, useEffect } from 'react';
import { WagmiProvider, useDisconnect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Ticket, Store, BellRing, X, ArrowRight, Trophy, Hourglass, Coins, Zap, Wallet, LogOut, AlertTriangle, CheckCircle } from 'lucide-react';
import { RaffleCard } from './RaffleCard';
import { RaffleDetails } from './RaffleDetails';
import { CreateRaffle } from './CreateRaffle';
import { Explore } from './Explore';
import { Profile } from './Profile'; // IMPORT NEW PROFILE PAGE
import '@rainbow-me/rainbowkit/styles.css';

// --- CONFIG ---
const etherlink = defineChain({
  id: 42793,
  name: 'Etherlink Mainnet',
  network: 'etherlink',
  nativeCurrency: { decimals: 18, name: 'Tezos', symbol: 'XTZ' },
  rpcUrls: { default: { http: ['https://node.mainnet.etherlink.com'] } },
});

const config = getDefaultConfig({
  appName: 'Ppopgi',
  projectId: 'YOUR_PROJECT_ID',
  chains: [etherlink],
  ssr: true,
});

const queryClient = new QueryClient();

// --- COMPONENTS ---
function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => { if (!sessionStorage.getItem('ppopgi_disclaimer_accepted')) setIsOpen(true); }, []);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Welcome</h2>
                <button onClick={() => {sessionStorage.setItem('ppopgi_disclaimer_accepted', 'true'); setIsOpen(false)}} className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl">I Agree</button>
            </div>
        </div>
    );
}

function CashierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
                <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
                <h2 className="text-xl font-bold mb-4">Cashier</h2>
                <p>Buy coins here.</p>
            </div>
        </div>
    );
}

// Updated Navbar: Wired up "Profile"
function Navbar({ onOpenCashier, onNavigate }: { onOpenCashier: () => void, onNavigate: (view: 'home' | 'details' | 'create' | 'explore' | 'profile') => void }) {
    const { disconnect } = useDisconnect();
    const formatPlayerName = (address: string) => `Player ...${address.slice(-4)}`;
    return (
        <nav className="w-full h-20 bg-white/85 backdrop-blur-md border-b border-white/50 fixed top-0 z-50 flex items-center justify-between px-4 md:px-8 shadow-sm">
            <div className="flex items-center gap-6">
                <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-9 h-9 bg-[#FFD700] rounded-full flex items-center justify-center text-white font-bold shadow-inner border-2 border-white"><Ticket size={18} className="text-amber-700" /></div>
                    <span className="font-bold text-xl text-amber-800 tracking-tight hidden md:block">Ppopgi</span>
                </div>
                <div className="hidden md:flex items-center gap-1">
                    <button onClick={() => onNavigate('explore')} className="px-4 py-1.5 rounded-full font-bold text-sm text-amber-900 bg-amber-100/50 hover:bg-amber-100 transition-colors">Explore</button>
                    <button onClick={() => onNavigate('create')} className="px-4 py-1.5 rounded-full font-bold text-sm text-gray-500 hover:text-amber-700 hover:bg-gray-100/50 transition-colors">Create</button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <ConnectButton.Custom>
                    {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                        const connected = mounted && account && chain;
                        return (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-gray-50/80 p-1.5 pr-2 rounded-2xl border border-gray-200/60 shadow-inner">
                                    {connected && (
                                        <div className="hidden lg:flex flex-col gap-1 pl-1">
                                            <div className="w-36 bg-[#E8F5E9] text-green-700 px-2.5 py-1 rounded-md font-bold text-[10px] flex items-center justify-between border border-green-200 shadow-sm tracking-tight"><div className="flex items-center gap-1.5"><Zap size={10} className="fill-green-600" /> <span>Energy</span></div><span>12.5 XTZ</span></div>
                                            <div className="w-36 bg-[#FFF8E1] text-amber-700 px-2.5 py-1 rounded-md font-bold text-[10px] flex items-center justify-between border border-amber-200 shadow-sm tracking-tight"><div className="flex items-center gap-1.5"><Coins size={10} className="fill-amber-500" /> <span>Entry</span></div><span>1,250 USDC</span></div>
                                        </div>
                                    )}
                                    <button onClick={onOpenCashier} className="bg-amber-500 hover:bg-amber-600 text-white p-2 md:px-4 md:py-2.5 rounded-xl font-bold shadow-sm active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 text-xs md:text-sm h-full"><Store size={18} /><span className="hidden md:inline">Cashier</span></button>
                                </div>
                                {connected ? (
                                    <div className="flex items-center gap-2">
                                        {/* CLICKING NAME GOES TO PROFILE */}
                                        <button onClick={() => onNavigate('profile')} className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-100 px-4 py-2 rounded-xl font-bold shadow-sm flex items-center gap-2 text-sm transition-colors"><div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>{formatPlayerName(account.address)}</button>
                                        <button onClick={() => disconnect()} className="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 p-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100" title="Disconnect Wallet"><LogOut size={18} /></button>
                                    </div>
                                ) : (
                                    <button onClick={openConnectModal} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_0_0_#1e3a8a] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2 text-sm"><Wallet size={18} /><span className="hidden md:inline">Connect Pocket</span><span className="md:hidden">Connect</span></button>
                                )}
                            </div>
                        )
                    }}
                </ConnectButton.Custom>
            </div>
        </nav>
    );
}
function Notifications(){return null;} 
function SectionHeader({ icon: Icon, title, colorClass }: any) {
    return <div className="flex items-center gap-3 mb-4 pl-1"><div className={`p-2 rounded-xl ${colorClass} text-white shadow-md rotate-[-6deg]`}><Icon size={20} strokeWidth={3} /></div><h2 className="text-2xl font-black text-gray-800/90 tracking-tight uppercase drop-shadow-sm">{title}</h2></div>;
}

// --- MAIN APP ---
export default function App() {
  const [isCashierOpen, setCashierOpen] = useState(false);
  
  // NAVIGATION STATE
  const [currentView, setCurrentView] = useState<'home' | 'details' | 'create' | 'explore' | 'profile'>('home');

  const CardWrapper = (props: any) => (
      <div onClick={() => setCurrentView('details')} className="cursor-pointer">
          <RaffleCard {...props} />
      </div>
  );

  const goldCard = { title: "Whale Watcher", prize: "5,000 USDC", ticketPrice: "20 USDC", sold: 12, total: 200, endsIn: "06d 10h", color: "gold" as const, rank: 1, creator: "Player 0x88" };
  const silverCard = { title: "Weekend Jackpot", prize: "1,000 USDC", ticketPrice: "5 USDC", sold: 450, total: 1000, endsIn: "02d 14h", color: "silver" as const, rank: 2, creator: "Player 0x12" };
  const bronzeCard = { title: "Moonlight Special", prize: "500 USDC", ticketPrice: "2 USDC", sold: 890, total: 1000, endsIn: "05h 20m", color: "bronze" as const, rank: 3, creator: "Player 0x4a" };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode>
          <div className="min-h-screen pb-12">
            <Navbar onOpenCashier={() => setCashierOpen(true)} onNavigate={setCurrentView} />
            <DisclaimerModal />
            <CashierModal isOpen={isCashierOpen} onClose={() => setCashierOpen(false)} />
            <Notifications />
            
            {/* --- ROUTER LOGIC --- */}
            {currentView === 'home' && (
                <main className="container mx-auto px-4 pt-20 max-w-[100rem]">
                  {/* PODIUM */}
                  <div className="w-fit mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/30 shadow-lg relative overflow-visible mt-8">
                     <SectionHeader icon={Trophy} title="Biggest Winning Pots" colorClass="bg-yellow-400" />
                     <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 pt-4 md:pt-8 pb-4 relative z-10">
                        <div className="w-full max-w-[260px] order-2 md:order-1 relative flex flex-col items-center"><CardWrapper {...silverCard} /><div className="hidden md:block w-[90%] h-6 bg-gradient-to-t from-slate-200 to-slate-100/50 rounded-b-2xl mt-[-10px] z-0 border-b-2 border-slate-200"></div></div>
                        <div className="w-full max-w-[260px] order-1 md:order-2 md:-mt-12 relative z-20 flex flex-col items-center"><CardWrapper {...goldCard} /><div className="hidden md:block w-full h-10 bg-gradient-to-t from-yellow-300/60 via-yellow-200/40 to-transparent rounded-b-3xl mt-[-12px] z-0 shadow-[0_10px_20px_-5px_rgba(234,179,8,0.3)] border-b-4 border-yellow-400/50"></div></div>
                        <div className="w-full max-w-[260px] order-3 md:order-3 relative flex flex-col items-center"><CardWrapper {...bronzeCard} /><div className="hidden md:block w-[90%] h-6 bg-gradient-to-t from-orange-200/50 to-orange-100/30 rounded-b-2xl mt-[-10px] z-0 border-b-2 border-orange-300/50"></div></div>
                     </div>
                     <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-yellow-100/60 to-transparent rounded-t-[50%] blur-3xl -z-10"></div>
                  </div>

                  {/* ENDING SOON */}
                  <div className="w-fit mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-white/30 shadow-lg">
                     <SectionHeader icon={Hourglass} title="Ending Soon" colorClass="bg-red-400" />
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 justify-items-center">
                        <CardWrapper title="Quickfire Draw" prize="100 USDC" ticketPrice="1 USDC" sold={48} total={50} endsIn="00h 12m" color="pink" creator="Player 0x99" />
                        <CardWrapper title="Lunch Break" prize="50 USDC" ticketPrice="0.5 USDC" sold={15} total={100} endsIn="00h 45m" color="pink" creator="Player 0x72" />
                        <CardWrapper title="Flash Friday" prize="250 USDC" ticketPrice="2 USDC" sold={120} total={150} endsIn="01h 10m" color="pink" creator="Player 0x1A" />
                        <CardWrapper title="Early Bird" prize="75 USDC" ticketPrice="1 USDC" sold={20} total={60} endsIn="02h 05m" color="pink" creator="Player 0xCC" />
                        <CardWrapper title="Night Owl" prize="200 USDC" ticketPrice="5 USDC" sold={5} total={40} endsIn="03h 30m" color="pink" creator="Player 0xB2" />
                     </div>
                  </div>

                  <div className="text-center pb-4">
                    <button onClick={() => setCurrentView('explore')} className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 font-bold text-white transition-all duration-200 bg-amber-500 rounded-full hover:bg-amber-600 hover:scale-105 shadow-[0_3px_0_0_#b45309] active:shadow-none active:translate-y-1 text-sm">
                      <span>Explore All Raffles</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </main>
            )}

            {currentView === 'explore' && <Explore onNavigate={() => setCurrentView('details')} />}
            {currentView === 'details' && <RaffleDetails onBack={() => setCurrentView('home')} />}
            {currentView === 'create' && <CreateRaffle onBack={() => setCurrentView('home')} />}
            {currentView === 'profile' && <Profile onNavigate={() => setCurrentView('details')} />}

          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}