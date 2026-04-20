import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, 
    MoreVertical, Users, MessageSquare, ShieldCheck, 
    ArrowLeft, Plus, Link as LinkIcon, Check, X
} from 'lucide-react';

const MeetingRoom = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    // States
    const [isJoined, setIsJoined] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [lobbyRequests, setLobbyRequests] = useState([
        { id: 1, name: 'Sunder Pichai', avatar: '/portrait_2.png' }
    ]);

    const handleAdmit = (id) => {
        setLobbyRequests(prev => prev.filter(r => r.id !== id));
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
                {/* Header */}
                <header className="p-6 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-black uppercase tracking-widest">
                        Room: <span className="text-blue-600">Dev-Sync-Alpha</span>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-10 max-w-[1400px] mx-auto w-full">
                    {/* Left: Video Preview */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-6">
                        <div className="aspect-video bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group border-[8px] border-white">
                            {isCamOn ? (
                                <img 
                                    src="/portrait_1.png" 
                                    className="w-full h-full object-cover opacity-80" 
                                    alt="Preview" 
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                                    <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-600">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <p className="text-slate-500 font-bold text-sm">Camera is off</p>
                                </div>
                            )}
                            
                            {/* Overlay Controls */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                <button 
                                    onClick={() => setIsMicOn(!isMicOn)}
                                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 backdrop-blur-md text-white border border-white/20' : 'bg-red-500 text-white'}`}
                                >
                                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                                </button>
                                <button 
                                    onClick={() => setIsCamOn(!isCamOn)}
                                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 backdrop-blur-md text-white border border-white/20' : 'bg-red-500 text-white'}`}
                                >
                                    {isCamOn ? <Video size={24} /> : <VideoOff size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Join Actions */}
                    <div className="w-full lg:w-[40%] text-center lg:text-left space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Huddle Pro</h1>
                            <p className="text-slate-500 font-medium">Everything looks good. Your team is waiting for you in the room.</p>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setIsJoined(true)}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Join Room Now
                            </button>
                            <button className="w-full bg-white border-2 border-slate-200 text-slate-800 py-4 rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                <LinkIcon size={18} /> Copy Meeting Link
                            </button>
                        </div>

                        <div className="pt-8 border-t border-slate-200">
                            <div className="flex -space-x-3 justify-center lg:justify-start">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                                        <img src={`/portrait_${i}.png`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest">3 Team Members already inside</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- EN-MEETING INTERFACE ---
    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
            {/* Participant Grid */}
            <main className="flex-1 p-6 relative flex gap-6 overflow-hidden">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Your Window */}
                    <div className="bg-slate-900 rounded-3xl relative overflow-hidden border-2 border-blue-500/50 shadow-2xl ring-4 ring-blue-500/10">
                        {isCamOn ? <img src="/portrait_1.png" className="w-full h-full object-cover" alt="" /> : (
                             <div className="h-full flex items-center justify-center text-3xl font-black text-slate-700">{user?.name?.charAt(0)}</div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                             {user?.name} (You)
                             {!isMicOn && <MicOff size={12} className="text-red-500" />}
                        </div>
                    </div>

                    {/* Participant Windows */}
                    {[
                        { n: 'Elon Musk', a: '/portrait_3.png' },
                        { n: 'Satya Nadella', a: '/portrait_2.png' }
                    ].map((p, i) => (
                        <div key={i} className="bg-slate-900 rounded-3xl relative overflow-hidden group">
                           <img src={p.a} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                           <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white uppercase tracking-widest">{p.n}</div>
                        </div>
                    ))}
                    
                    {/* Screen Share Placeholder (If sharing) */}
                    {isSharing && (
                        <div className="col-span-full bg-slate-900 rounded-[2rem] border-2 border-blue-500 overflow-hidden relative">
                             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent flex items-center justify-center flex-col gap-4">
                                 <Monitor size={64} className="text-blue-400 animate-pulse" />
                                 <p className="text-xl font-black text-white italic">Sharing Screen...</p>
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Side Panel: Lobby / Admissions */}
                <div className="w-80 flex flex-col gap-4 h-full">
                    {/* Admission Control */}
                    <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/5 flex-1 flex flex-col">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[3px] mb-6 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-500" /> Security Monitor
                        </h4>
                        
                        <div className="space-y-4 flex-1">
                            {lobbyRequests.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Entry Request</p>
                                    {lobbyRequests.map(req => (
                                        <div key={req.id} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <img src={req.avatar} className="h-10 w-10 rounded-full border border-white/10" alt="" />
                                                <p className="text-sm font-bold text-white">{req.name}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleAdmit(req.id)}
                                                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-500"
                                                >
                                                    Admit
                                                </button>
                                                <button 
                                                    onClick={() => handleAdmit(req.id)}
                                                    className="px-4 py-2 bg-white/5 text-slate-500 rounded-xl hover:bg-red-500/20 hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/2">
                                    <Users size={32} className="text-slate-800 mb-4" />
                                    <p className="text-xs font-bold text-slate-700">Lobby is empty. All participants admitted.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Controls */}
            <footer className="h-24 bg-slate-950 px-10 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-4">
                    <p className="text-white font-black tracking-tighter text-lg">WorkSync Alpha</p>
                    <div className="h-4 w-[1px] bg-slate-800"></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">12:34 PM</span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsMicOn(!isMicOn)}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
                    >
                        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsCamOn(!isCamOn)}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isCamOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
                    >
                        {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>
                    <button 
                        onClick={() => setIsSharing(!isSharing)}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${isSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        <Monitor size={20} />
                    </button>
                    <button className="h-12 w-12 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center">
                        <MoreVertical size={20} />
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-red-500 text-white px-8 h-12 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        Leave Huddle
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-slate-500 hover:text-white"><MessageSquare size={20} /></button>
                    <button className="text-slate-500 hover:text-white"><Users size={20} /></button>
                </div>
            </footer>
        </div>
    );
};

export default MeetingRoom;
