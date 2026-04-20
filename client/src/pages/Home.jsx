import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LogOut, LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SaaSify</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-400 font-medium">
              <BarChart3 size={18} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Users size={18} />
              Team
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Settings size={18} />
              Settings
            </a>
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-slate-700"></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User Name'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(logout())}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-semibold border border-blue-600/20">
              Pro Plan
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Revenue', value: '$24,560', change: '+12.5%', icon: BarChart3 },
              { label: 'Active Users', value: '1,234', change: '+18.2%', icon: Users },
              { label: 'Workspaces', value: '42', change: '+4.3%', icon: LayoutDashboard },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-blue-600/10 transition-all">
                    <stat.icon className="text-slate-400 group-hover:text-blue-400" size={20} />
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 h-64 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-slate-800 mb-4 text-slate-500">
               <BarChart3 size={32} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No activity data yet</h3>
            <p className="text-slate-400 max-w-sm">Connect your first data source to see real-time analytics and user behavior metrics.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
