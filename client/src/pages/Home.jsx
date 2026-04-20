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
        <div className="flex h-screen bg-slate-950 text-slate-200">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Sidebar */}
            <aside className="w-68 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <LayoutDashboard size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">SaaSify</span>
                    </div>
                    
                    {/* Workspace Switcher */}
                    <div className="relative mb-6">
                        <button className="flex w-full items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800 transition-all group">
                            <div className="flex items-center gap-3 overflow-hidden text-left">
                                <div className="h-6 w-6 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 group-hover:bg-blue-600 transition-colors">
                                    {activeWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
                                </div>
                                <span className="font-medium text-sm text-slate-200 truncate">{activeWorkspace?.name || 'Loading...'}</span>
                            </div>
                            <ChevronDown size={14} className="text-slate-500" />
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 font-medium font-bold">
                            <BarChart3 size={18} />
                            Dashboard
                        </a>
                        <Link to="/team" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
                            <Users size={18} />
                            Team
                        </Link>
                        <Link to="/billing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
                            <CreditCard size={18} />
                            Billing
                        </Link>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
                            <Settings size={18} />
                            Settings
                        </a>
                    </nav>
                </div>
                
                <div className="mt-auto p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-300 ring-2 ring-slate-800">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User Name'}</p>
                            <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => dispatch(logout())}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/5 via-slate-950 to-slate-950">
                <header className="h-16 border-b border-slate-800 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                      <h2 className="text-lg font-bold text-white leading-tight">Dashboard Overview</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Real-time Analytics</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Live Plan Indicator linking to Billing */}
                        <Link 
                            to="/billing"
                            className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-[10px] font-bold border border-blue-600/20 uppercase tracking-widest hover:bg-blue-600/20 transition-all shadow-inner"
                        >
                            {activeWorkspace?.subscription?.plan || 'Free'} Plan
                        </Link>
                        <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer">
                          <Bell size={18} />
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[
                            { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: BarChart3, color: 'text-emerald-400' },
                            { label: 'Active Users', value: '1,234', change: '+18.2%', icon: Users, color: 'text-blue-400' },
                            { label: 'Members', value: activeWorkspace?.members?.length || '1', change: 'Online', icon: LayoutDashboard, color: 'text-purple-400' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <stat.icon size={80} />
                                </div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className={`p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-all ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider bg-slate-800 px-2 py-1 rounded-full ${stat.color} border border-slate-700`}>
                                      {stat.change}
                                    </span>
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Revenue Trend</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Monthly growth</p>
                                </div>
                                <select className="bg-slate-800 border-none text-[10px] uppercase font-bold text-slate-400 rounded-md px-2 py-1 outline-none">
                                  <option>Last 7 Days</option>
                                  <option>Last 30 Days</option>
                                </select>
                            </div>
                            <RevenueChart />
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Active Users</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Daily engagement</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            </div>
                            <UserGrowthChart />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
