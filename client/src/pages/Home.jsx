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
    Plus, Search, Bell, ChevronRight, Play, Mic, Monitor, LogOut
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
        <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-600">
            <Toaster position="top-right" />
            
            {/* Sidebar */}
            <aside className="w-72 uplifter-sidebar flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
                <div className="flex items-center gap-3 px-4 mb-12 group">
                    <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                        <LayoutDashboard size={24} className="text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 italic">SaaSify</span>
                </div>

                <nav className="space-y-1 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Workspace</p>
                    <Link to="/dashboard" className="sidebar-item-light sidebar-item-light-active">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link to="/team" className="sidebar-item-light">
                        <Users size={20} />
                        Team Space
                    </Link>
                    <Link to="/settings" className="sidebar-item-light">
                        <Settings size={20} />
                        Settings
                    </Link>
                    <Link to="/billing" className="sidebar-item-light">
                        <CreditCard size={20} />
                        Billing
                    </Link>

                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-12 mb-4 ml-4">Live Hub</p>
                    <Link to="/meeting" className="sidebar-item-light">
                        <Video size={20} />
                        Meeting Room
                        <span className="tag-pill tag-blue ml-auto">Live</span>
                    </Link>
                    <Link to="/meeting" className="sidebar-item-light">
                        <Radio size={20} />
                        Live Stream
                    </Link>
                </nav>

                <div className="mt-auto pt-8 border-t border-slate-200">
                    <div className="p-4 flex items-center gap-3 bg-white rounded-3xl border border-slate-200 shadow-sm mb-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 leading-none truncate">{user?.name}</p>
                            <button 
                                onClick={() => dispatch(logout())}
                                className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1 hover:text-red-700 transition-colors"
                            >
                                <LogOut size={10} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 pb-24 max-w-[1600px]">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[4px] mb-2">{activeWorkspace?.name || 'Workspace'}</p>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                           Dashboard <span className="text-blue-600">.</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden xl:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search workspace..." 
                                className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-64 transition-all shadow-sm"
                            />
                        </div>
                        <button className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors relative shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500 border-2 border-white"></span>
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                            <Plus size={20} />
                            New Project
                        </button>
                    </div>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-12 gap-8">
                    


                    {/* Task Board Section */}
                    <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="uplifter-card p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-black text-xl tracking-tighter">Current Tasks</h4>
                                <Plus size={20} className="text-slate-400 cursor-pointer hover:text-blue-500" />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { t: "Deploy billing module", p: "Critical", c: "red" },
                                    { t: "Style workspace grid", p: "Normal", c: "blue" },
                                    { t: "Team onboarding", p: "High", c: "purple" },
                                ].map((task, i) => (
                                    <div key={i} className="flex flex-col gap-3 p-5 bg-slate-100/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all cursor-pointer group">
                                        <span className={`tag-pill tag-${task.c} w-max`}>{task.p}</span>
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{task.t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 uplifter-card p-10 bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10">
                                <Users size={120} className="text-white/5 rotate-[15deg]" />
                            </div>
                            <h4 className="text-2xl font-black tracking-tighter mb-10 relative z-10 italic">Team Presence</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-white p-1 relative overflow-hidden group">
                                            <img src={`/portrait_${i}.png`} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" alt="" />
                                            <div className="absolute bottom-1 right-1 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Home;
