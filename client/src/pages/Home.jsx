import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';
import { fetchWorkspaces } from '../features/workspaces/workspaceSlice';
import useSocket from '../hooks/useSocket';
import { 
    LayoutDashboard, Users, Settings, CreditCard, 
    Video, Radio, MessageSquare, CheckSquare, 
    Plus, Search, Bell, ChevronRight, Play, Mic, Monitor, LogOut,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);
    const { list, activeWorkspace, loading } = useSelector((state) => state.workspaces);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);

    useEffect(() => {
        if (!loading && list.length === 0) {
            navigate('/create-workspace');
        }
    }, [list, loading, navigate]);

    const socket = useSocket(activeWorkspace?._id);

    useEffect(() => {
        if (!socket) return;
        socket.on('notification', (payload) => {
            toast.success(payload.message, {
              icon: '🚀',
              style: { borderRadius: '15px', background: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', fontWeight: 'bold' },
            });
        });
        return () => socket.off('notification');
    }, [socket]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-600">
            <Toaster position="top-right" />
            
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100/30 blur-[120px] rounded-full"></div>
            </div>

            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                            <LayoutDashboard size={20} className="text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-900 italic">SaaSify</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/dashboard" className="px-4 py-2 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 transition-all">Dashboard</Link>
                        <Link to="/team" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Team</Link>
                        <Link to="/settings" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Settings</Link>
                        <Link to="/billing" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Billing</Link>
                        <div className="h-4 w-px bg-slate-200 mx-2"></div>
                        <Link to="/meeting" className="px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all flex items-center gap-2">
                            <Video size={16} /> Meeting Room
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-600 focus:outline-none focus:border-blue-500/50 w-48 transition-all"
                        />
                    </div>
                    <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-200 cursor-pointer hover:scale-105 transition-transform">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto p-10">
                {/* Header Section */}
                <header className="mb-16">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[4px]">{activeWorkspace?.name || 'Workspace active'}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-4">
                                Experience <span className="text-blue-600">Space .</span>
                            </h1>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Select your workspace mode to start collaborating with your team in high-fidelity virtual environments.
                            </p>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-95 shadow-xl shadow-blue-500/20">
                            <Plus size={18} /> New Environment
                        </button>
                    </div>
                </header>

                {/* Workspace Modes Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                    {/* Office Mode */}
                    <div className="group relative bg-blue-50/50 border border-blue-100 rounded-[3rem] p-8 hover:bg-blue-50 transition-all duration-500 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] group-hover:bg-blue-600/10 transition-all"></div>
                        <div className="h-64 rounded-[2rem] bg-slate-100 mb-8 overflow-hidden relative border border-blue-100">
                            <img src="/office_preview.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Office" />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Beta 2.0</div>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 italic">Virtual Office Space</h3>
                                <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">The newest version of Workspace, best for remote teams working together every day in a virtual office.</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <LayoutDashboard size={24} />
                            </div>
                        </div>
                        <button className="mt-8 w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[2px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                            Enter Office Mode
                        </button>
                    </div>

                    {/* Event Mode */}
                    <div className="group relative bg-[#f5faff] border border-blue-100 rounded-[3rem] p-8 hover:bg-blue-50 transition-all duration-500 overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] group-hover:bg-purple-600/10 transition-all"></div>
                        <div className="h-64 rounded-[2rem] bg-slate-100 mb-8 overflow-hidden relative border border-blue-100">
                            <img src="/event_preview.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 px-4 py-2 bg-blue-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Events 1.0</div>
                        </div>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 italic">Digital Conference Room</h3>
                                <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">The classic version with event templates. Best for virtual conferences and one-time gatherings.</p>
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-800 group-hover:bg-blue-800 group-hover:text-white transition-all shadow-sm">
                                <Video size={24} />
                            </div>
                        </div>
                        <button className="mt-8 w-full py-4 rounded-2xl bg-blue-800 text-white font-black text-[10px] uppercase tracking-[2px] hover:bg-slate-900 transition-all shadow-lg shadow-blue-200">
                            Enter Event Mode
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
