import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { Layout, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (!result.error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] overflow-hidden">
      {/* Left side: Overlapping Image Stack */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-20 bg-gradient-to-br from-blue-900/10 to-transparent border-r border-white/5">
        <div className="relative w-full max-w-lg h-[600px]">
             {/* Back Card: Elon Musk */}
             <div className="absolute top-[10%] left-[5%] w-[65%] rotate-[-8deg] z-10 transition-all duration-500 hover:z-50 hover:scale-105">
                <img 
                    src="/portrait_3.png" 
                    className="w-full h-auto rounded-[3rem] shadow-2xl border-4 border-white/5 opacity-50" 
                    alt="Vision" 
                />
            </div>

            {/* Middle Card: Satya Nadella */}
            <div className="absolute top-[20%] right-[10%] w-[65%] rotate-[6deg] z-20 transition-all duration-500 hover:z-50 hover:scale-105">
                <img 
                    src="/portrait_2.png" 
                    className="w-full h-auto rounded-[3rem] shadow-2xl border-4 border-white/10 opacity-75" 
                    alt="Innovation" 
                />
            </div>

            {/* Front Main Card: Mark Zuckerberg (Sitting on Top) */}
            <div className="absolute top-[35%] left-[10%] w-[75%] rotate-[-2deg] z-30 transition-all duration-700 hover:z-50 hover:scale-110">
                <img 
                    src="/portrait_1.png" 
                    className="w-full h-auto rounded-[3.5rem] shadow-[0_60px_150px_rgba(0,0,0,0.8)] border-4 border-[#404eed]" 
                    alt="Network" 
                />
                <div className="absolute top-8 -right-4 p-5 rounded-3xl bg-[#404eed] text-white shadow-xl animate-bounce">
                    <Layout size={28} />
                </div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
      </div>
      
      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-50">
        <div className="w-full max-w-[380px] space-y-8">
            <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">SaaSify</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[2px]">Enter your credentials</p>
            </div>

            <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                    <div className="rounded-xl bg-red-500/10 p-4 text-xs font-bold text-red-400 border border-red-500/20 uppercase tracking-widest">
                        {error}
                    </div>
                    )}
                    
                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Mail size={16} />
                            </div>
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Email Address"
                            required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Lock size={16} />
                            </div>
                            <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-xl border border-white/5 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Password"
                            required
                            />
                        </div>
                        <div className="flex justify-end pr-1">
                            <a href="#" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Forgot password?</a>
                        </div>
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:opacity-50 group"
                    >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <>
                        Sign in
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </>
                    )}
                    </button>
                </form>

                <div className="mt-10 flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">OR</span>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>

                <div className="mt-10 text-center">
                    <span className="text-xs font-bold text-slate-500">Don&apos;t have an account? </span>
                    <Link to="/register" className="text-xs font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">
                    Sign up
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
