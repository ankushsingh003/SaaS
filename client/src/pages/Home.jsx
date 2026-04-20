import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';
import { fetchWorkspaces } from '../features/workspaces/workspaceSlice';
import { RevenueChart, UserGrowthChart } from '../components/DashboardCharts';
import useSocket from '../hooks/useSocket';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  Loader2,
  Bell,
  CreditCard
} from 'lucide-react';

/**
 * Home Component (The main SaaS Dashboard):
 * 1. Checks if user has a workspace.
 * 2. Redirects to /create-workspace if no workspace found.
 * 3. Displays analytics for the active workspace.
 * 4. Listens for real-time events via Socket.io.
 */
const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Auth state
    const { user } = useSelector((state) => state.auth);
    
    // Workspace state
    const { list, activeWorkspace, loading } = useSelector((state) => state.workspaces);

    // Initial load: Fetch all workspaces
    useEffect(() => {
        dispatch(fetchWorkspaces());
    }, [dispatch]);

    // Multi-tenancy check
    useEffect(() => {
        if (!loading && list.length === 0) {
            navigate('/create-workspace');
        }
    }, [list, loading, navigate]);

    // Initialize Real-time Socket Connection
    const socket = useSocket(activeWorkspace?._id);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('notification', (payload) => {
            toast.success(payload.message, {
              icon: '🚀',
              style: {
                borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid #334155'
              },
            });
        });

        return () => {
            socket.off('notification');
        };
    }, [socket]);

    if (loading && !activeWorkspace) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            <Toaster position="top-right" />

            {/* Background Ambient Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Sidebar */}
            <aside className="w-72 glass-sidebar flex flex-col relative z-20">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <LayoutDashboard size={20} className="text-white" />
                        </div>
                        <span className="font-black text-2xl text-white tracking-tighter group-hover:text-blue-400 transition-colors">SaaSify</span>
                    </div>
                    
                    {/* Workspace Switcher */}
                    <div className="mb-8">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-3 ml-2">Workspaces</p>
                        <button className="flex w-full items-center justify-between gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group active:scale-95">
                            <div className="flex items-center gap-3 overflow-hidden text-left font-bold">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-xs font-black text-white shrink-0 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all shadow-inner">
                                    {activeWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
                                </div>
                                <span className="font-semibold text-sm text-slate-200 truncate">{activeWorkspace?.name || 'Loading...'}</span>
                            </div>
                            <ChevronDown size={14} className="text-slate-500 group-hover:text-blue-400" />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-3 ml-2">Menu</p>
                        <Link to="/" className="discord-sidebar-item-active">
                            <BarChart3 size={18} />
                            Dashboard
                        </Link>
                        <Link to="/team" className="discord-sidebar-item">
                            <Users size={18} />
                            Team
                        </Link>
                        <Link to="/billing" className="discord-sidebar-item">
                            <CreditCard size={18} />
                            Billing
                        </Link>
                        <Link to="/settings" className="discord-sidebar-item">
                            <Settings size={18} />
                            Settings
                        </Link>
                    </nav>
                </div>
                
                <div className="mt-auto p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center text-sm font-black text-slate-300 ring-2 ring-white/5 group-hover:ring-blue-500/50 transition-all shadow-md">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#12161b]"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'User Name'}</p>
                            <p className="text-[10px] text-slate-500 truncate uppercase tracking-tight opacity-70">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => dispatch(logout())}
                        className="flex w-full items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-[#020617] relative z-10 scrollbar-hide">
                <header className="h-20 glass-nav flex items-center justify-between px-10 sticky top-0 z-30">
                    <div>
                      <p className="text-[10px] text-blue-400 uppercase tracking-[3px] font-black mb-1">Live Environment</p>
                      <h2 className="text-xl font-black text-white tracking-tight">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link 
                            to="/billing"
                            className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            {activeWorkspace?.subscription?.plan || 'Free'} Plan
                        </Link>
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer relative border border-white/5">
                          <Bell size={20} />
                          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#020617]"></div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        {[
                            { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: BarChart3, color: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
                            { label: 'Active Users', value: '1,234', change: '+18.2%', icon: Users, color: 'text-blue-400', glow: 'shadow-blue-500/10' },
                            { label: 'Live Members', value: activeWorkspace?.members?.length || '1', change: 'Online', icon: LayoutDashboard, color: 'text-purple-400', glow: 'shadow-purple-500/10' },
                        ].map((stat, i) => (
                            <div key={i} className={`p-8 rounded-[2rem] glass-card hover:translate-y-[-4px] transition-all duration-300 group ${stat.glow}`}>
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-3 rounded-2xl bg-[#0f172a] border border-white/5 group-hover:scale-110 transition-all ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[2px] bg-white/5 px-3 py-1.5 rounded-full ${stat.color} border border-white/5`}>
                                      {stat.change}
                                    </span>
                                </div>
                                <p className="text-xs font-black uppercase tracking-[2.5px] text-slate-500 mb-2">{stat.label}</p>
                                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-[2.5rem] glass-card p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Revenue Trend</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[2px] font-black mt-1">Global performance</p>
                                </div>
                                <select className="bg-white/5 border border-white/5 text-[10px] uppercase font-black text-slate-400 rounded-xl px-4 py-2 outline-none hover:bg-white/10 transition-all cursor-pointer">
                                  <option>Last 7 Days</option>
                                  <option>Last 30 Days</option>
                                </select>
                            </div>
                            <div className="h-[350px] w-full">
                                <RevenueChart />
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] glass-card p-10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-white tracking-tight">User Engagement</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[2px] font-black mt-1">Daily activities</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <UserGrowthChart />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
