import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Video as VideoIcon, VideoOff, Mic, MicOff, Monitor, PhoneOff, 
    MoreVertical, Users, MessageSquare, ShieldCheck, 
    ArrowLeft, Plus, Link as LinkIcon, Check, X, Camera
} from 'lucide-react';

const MeetingRoom = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    // Refs for Video Elements
    const localVideoRef = useRef(null);
    const previewVideoRef = useRef(null);
    
    // States
    const [isJoined, setIsJoined] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [stream, setStream] = useState(null);
    const [lobbyRequests, setLobbyRequests] = useState([]);

    // Handle Camera/Mic Access
    useEffect(() => {
        const getMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                
                // Attach to preview initially
                if (previewVideoRef.current) {
                    previewVideoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };

        if (!stream) getMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Sync stream with video elements when joining or toggling
    useEffect(() => {
        if (isJoined && localVideoRef.current && stream) {
            localVideoRef.current.srcObject = stream;
        } else if (!isJoined && previewVideoRef.current && stream) {
            previewVideoRef.current.srcObject = stream;
        }
    }, [isJoined, stream, isCamOn]);

    // Toggle Tracks
    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCamOn(videoTrack.enabled);
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

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
                            <video 
                                ref={previewVideoRef}
                                autoPlay 
                                muted 
                                playsInline
                                className={`w-full h-full object-cover transition-opacity duration-500 ${isCamOn ? 'opacity-100' : 'opacity-0'}`}
                            />
                            
                            {!isCamOn && (
                                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-slate-950/20 backdrop-blur-xl">
                                    <div className="h-32 w-32 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-4xl font-black text-slate-700 shadow-2xl">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <p className="text-slate-500 font-black uppercase tracking-[3px] text-xs">Camera is off</p>
                                </div>
                            )}
                            
                            {/* Overlay Controls */}
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
                                <button 
                                    onClick={toggleMic}
                                    className={`h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isMicOn ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20' : 'bg-red-500 text-white'}`}
                                >
                                    {isMicOn ? <Mic size={28} /> : <MicOff size={28} />}
                                </button>
                                <button 
                                    onClick={toggleVideo}
                                    className={`h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isCamOn ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20' : 'bg-red-500 text-white'}`}
                                >
                                    {isCamOn ? <VideoIcon size={28} /> : <VideoOff size={28} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Join Actions */}
                    <div className="w-full lg:w-[40%] text-center lg:text-left space-y-10 p-4">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Huddle Pro<span className="text-blue-600">.</span></h1>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">Permissions allowed. Your camera and microphone are live and ready for the squad.</p>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setIsJoined(true)}
                                className="w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                            >
                                Enter Room
                            </button>
                            <button className="w-full bg-white border-2 border-slate-100 text-slate-800 py-5 rounded-[2.5rem] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                                <LinkIcon size={20} /> Copy Link
                            </button>
                        </div>

                        <div className="pt-10">
                            <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[4px]">Participating</p>
                            <div className="flex -space-x-3 justify-center lg:justify-start">
                                {/* Participants will be listed here */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- EN-MEETING INTERFACE ---
    return (
        <div className="h-screen bg-black flex flex-col font-sans overflow-hidden">
            {/* Participant Grid */}
            <main className="flex-1 p-6 relative flex gap-6 overflow-hidden">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Your REAL Video Window */}
                    <div className="bg-slate-900 rounded-[3rem] relative overflow-hidden border-4 border-blue-600/50 shadow-2xl ring-[20px] ring-blue-600/5">
                        <video 
                            ref={localVideoRef}
                            autoPlay 
                            muted 
                            playsInline
                            className={`w-full h-full object-cover transition-opacity duration-500 ${isCamOn ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {!isCamOn && (
                             <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-slate-700 bg-slate-900">
                                {user?.name?.charAt(0)}
                             </div>
                        )}
                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest border border-white/10">
                             {user?.name} (You)
                             {!isMicOn && <MicOff size={14} className="text-red-500" />}
                        </div>
                    </div>

                    
                    {/* Screen Share Window */}
                    {isSharing && (
                        <div className="col-span-full bg-slate-900 rounded-[3rem] border-4 border-blue-600 overflow-hidden relative shadow-2xl">
                             <div className="absolute inset-0 bg-blue-600/5 flex items-center justify-center flex-col gap-6">
                                 <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/50 animate-pulse">
                                    <Monitor size={48} />
                                 </div>
                                 <p className="text-3xl font-black text-white italic tracking-tighter">Live Screen Share</p>
                             </div>
                        </div>
                    )}
                </div>

                {/* Right Side Panel: Lobby / Admissions */}
                <div className="w-96 hidden xl:flex flex-col gap-6 h-full">
                    <div className="bg-slate-900/40 rounded-[3rem] p-8 border border-white/5 flex-1 flex flex-col backdrop-blur-xl shadow-inner">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-8 flex items-center gap-3">
                            <ShieldCheck size={16} className="text-blue-600" /> Lobby Control
                        </h4>
                        
                        <div className="flex-1">
                            {lobbyRequests.length > 0 ? (
                                <div className="space-y-6">
                                    {lobbyRequests.map(req => (
                                        <div key={req.id} className="bg-white/[0.03] p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-14 w-14 rounded-full border-2 border-blue-600 p-1">
                                                    <img src={req.avatar} className="h-full w-full rounded-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white tracking-tight">{req.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Wants to enter</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => handleAdmit(req.id)}
                                                    className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                                >
                                                    Admit
                                                </button>
                                                <button 
                                                    onClick={() => handleAdmit(req.id)}
                                                    className="px-6 py-3.5 bg-white/5 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                                    <Users size={48} className="text-slate-600 mb-6" />
                                    <p className="text-sm font-bold text-slate-500 italic">No pending requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Controls (GMeet Inspired) */}
            <footer className="h-28 bg-[#050505] px-12 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-white font-black tracking-tighter text-2xl italic">Huddle Pro<span className="text-blue-600">.</span></p>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Workspace alpha-v1</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <button 
                        onClick={toggleMic}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isMicOn ? 'bg-slate-900 text-white border border-white/5' : 'bg-red-600 text-white'}`}
                    >
                        {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>
                    <button 
                        onClick={toggleVideo}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isCamOn ? 'bg-slate-900 text-white border border-white/5' : 'bg-red-600 text-white'}`}
                    >
                        {isCamOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
                    </button>
                    <button 
                        onClick={() => setIsSharing(!isSharing)}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isSharing ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-white border border-white/5'}`}
                    >
                        <Monitor size={24} />
                    </button>
                    <button className="h-14 w-14 rounded-2xl bg-slate-900 text-slate-500 hover:text-white transition-all flex items-center justify-center border border-white/5">
                        <MoreVertical size={24} />
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-red-600 text-white px-10 h-14 rounded-[2rem] font-black text-xs uppercase tracking-[3px] shadow-2xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all ml-4"
                    >
                        End Session
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Secure</span>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors"><MessageSquare size={22} /></button>
                    <button className="text-slate-500 hover:text-white transition-colors"><Users size={22} /></button>
                </div>
            </footer>
        </div>
    );
};

export default MeetingRoom;
