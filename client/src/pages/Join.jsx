import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { 
    Users, 
    CheckCircle2, 
    ArrowRight, 
    ShieldCheck, 
    Clock, 
    Loader2,
    AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Join = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/invitations/${token}`);
                setInvitation(response.data.invitation);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Invitation not found or expired');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchInvite();
    }, [token]);

    const handleAccept = async () => {
        if (!isAuthenticated) {
            // Save token to session storage to resume after login
            sessionStorage.setItem('pendingInvite', token);
            navigate(`/register?email=${invitation.email}`);
            return;
        }

        try {
            setAccepting(true);
            const response = await api.post(`/invitations/${token}/accept`);
            toast.success('Successfully joined the team!');
            
            // Wait a bit then redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept invitation');
        } finally {
            setAccepting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="text-slate-400 font-medium">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center">
                    <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="text-red-500" size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-4 italic">Invitation Invalid</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">{error}</p>
                    <Link to="/dashboard" className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 selection:bg-blue-500/30">
            <Toaster position="top-center" />
            
            <div className="max-w-lg w-full relative">
                {/* Visual Flair */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>

                <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 relative z-10 shadow-2xl">
                    <div className="flex justify-between items-start mb-12">
                        <div className="h-16 w-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Users className="text-white" size={32} />
                        </div>
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
                            <Clock size={14} className="text-slate-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Expires in 7 days</span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[4px] mb-4">Workspace Invitation</p>
                        <h1 className="text-4xl font-black text-white tracking-tighter leading-tight mb-6 italic">
                            You've been invited <br />
                            to join <span className="text-blue-500">{invitation.workspace?.name}</span>
                        </h1>
                        <p className="text-slate-400 leading-relaxed italic">
                            Join your teammates at <span className="text-white font-bold">{invitation.workspace?.name}</span> and start collaborating on premium analytics dashboards.
                        </p>
                    </div>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                            <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Invited By</p>
                                <p className="text-sm text-slate-400 font-medium italic">{invitation.inviter?.name} ({invitation.inviter?.email})</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                            <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Access Level</p>
                                <p className="text-sm text-slate-400 font-medium italic capitalize">{invitation.role}</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full bg-blue-600 text-white h-16 rounded-3xl font-black text-lg tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-600/40 transition-all active:scale-95 disabled:opacity-50 group italic"
                    >
                        {accepting ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                {isAuthenticated ? 'Accept Invitation' : 'Sign In To Join'}
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                            </>
                        )}
                    </button>

                    {!isAuthenticated && (
                        <p className="text-center mt-6 text-xs text-slate-500 font-bold uppercase tracking-widest italic">
                            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log In</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Join;
