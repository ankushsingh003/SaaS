import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Loader2, 
  Search,
  ArrowLeft,
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Team = () => {
    const { activeWorkspace } = useSelector((state) => state.workspaces);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [bulkEmails, setBulkEmails] = useState('');
    const [inviting, setInviting] = useState(false);
    const [inviteMode, setInviteMode] = useState('single'); // single, bulk, link
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (activeWorkspace?._id) {
            fetchMembers();
        }
    }, [activeWorkspace]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/workspaces/${activeWorkspace._id}/members`);
            setMembers(response.data.members);
        } catch (error) {
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        const emailsToInvite = inviteMode === 'single' 
            ? [inviteEmail.trim()] 
            : bulkEmails.split(/[\s,]+/).filter(e => e.includes('@'));

        if (emailsToInvite.length === 0) return;

        try {
            setInviting(true);
            // In a real scenario, the backend would handle an array or we'd loop.
            // For now, let's keep the existing single endpoint but prepare for multi.
            for (const email of emailsToInvite) {
                await api.post(`/workspaces/${activeWorkspace._id}/invite`, {
                    email,
                    role: 'member'
                });
            }
            
            toast.success(emailsToInvite.length > 1 ? `Invited ${emailsToInvite.length} members!` : 'Invitation sent!');
            setInviteEmail('');
            setBulkEmails('');
            fetchMembers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to invite members');
        } finally {
            setInviting(false);
        }
    };

    const copyInviteLink = () => {
        const link = `${window.location.origin}/join/${activeWorkspace?._id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success('Invite link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-blue-500/30">
            <Toaster position="top-right" />
            
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="group h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                            <ArrowLeft size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-white tracking-tighter">Team Management</h1>
                                <span className="px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">Admin</span>
                            </div>
                            <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                                <Users size={14} /> Control access and roles for <span className="text-slate-300">{activeWorkspace?.name}</span>
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Invitation Control Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-1 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                            <div className="flex p-1">
                                <button 
                                    onClick={() => setInviteMode('single')}
                                    className={`flex-1 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${inviteMode === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Mail size={14} /> Single
                                </button>
                                <button 
                                    onClick={() => setInviteMode('bulk')}
                                    className={`flex-1 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${inviteMode === 'bulk' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Mail size={14} /> Bulk
                                </button>
                                <button 
                                    onClick={() => setInviteMode('link')}
                                    className={`flex-1 py-3 rounded-[1.5rem] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${inviteMode === 'link' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <LinkIcon size={14} /> Link
                                </button>
                            </div>

                            <div className="p-6 pt-4">
                                {inviteMode === 'link' ? (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <LinkIcon size={16} className="text-blue-400" /> Share Invite Link
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Anyone with this link can join your workspace. Be careful with who you share it with.
                                        </p>
                                        <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/5 rounded-xl">
                                            <div className="flex-1 truncate text-[10px] text-slate-400 font-mono px-2">
                                                {window.location.origin}/join/{activeWorkspace?._id}
                                            </div>
                                            <button 
                                                onClick={copyInviteLink}
                                                className="h-10 px-4 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                            >
                                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                                <span className="text-xs font-bold uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInvite} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                                {inviteMode === 'single' ? 'Recipient Email' : 'Email Addresses (comma separated)'}
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute top-4 left-4 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                                    {inviteMode === 'single' ? <Mail size={18} /> : <Mail size={18} />}
                                                </div>
                                                {inviteMode === 'single' ? (
                                                    <input
                                                        type="email"
                                                        value={inviteEmail}
                                                        onChange={(e) => setInviteEmail(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                                                        placeholder="name@company.com"
                                                        required
                                                    />
                                                ) : (
                                                    <textarea
                                                        value={bulkEmails}
                                                        onChange={(e) => setBulkEmails(e.target.value)}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 min-h-[120px] resize-none"
                                                        placeholder="john@example.com, sarah@company.com..."
                                                        required
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={inviting || (inviteMode === 'single' ? !inviteEmail : !bulkEmails)}
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                                        >
                                            {inviting ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus size={18} />
                                                    Send Invitations
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
                           <div className="relative z-10">
                             <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Team Capacity</h4>
                             <div className="flex items-end gap-3 mb-6">
                                <span className="text-5xl font-black">{members.length}</span>
                                <span className="text-lg font-bold opacity-60 mb-1">/ 50 members</span>
                             </div>
                             <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full group-hover:scale-x-105 transition-transform origin-left" style={{ width: `${(members.length / 50) * 100}%` }}></div>
                             </div>
                           </div>
                           <Users className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 transition-transform" size={160} />
                        </div>
                    </div>

                    {/* Members Directory */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, email or role..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all backdrop-blur-sm"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                                    <Filter size={14} /> Filter
                                </button>
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Member Profile</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Access Level</th>
                                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Activity</th>
                                            <th className="px-8 py-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <Loader2 className="animate-spin mx-auto text-blue-500" size={40} />
                                                    <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Loading members...</p>
                                                </td>
                                            </tr>
                                        ) : members.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-slate-500">
                                                        <Users size={32} />
                                                    </div>
                                                    <p className="text-lg font-bold text-slate-400">Your pack is empty</p>
                                                    <p className="text-sm text-slate-600 mt-1">Start by inviting your first teammate!</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            members.map((member) => (
                                                <tr key={member._id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg font-black text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
                                                                    {member.user?.name?.charAt(0)}
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-[2.5px] border-[#080808] rounded-full shadow-lg"></div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{member.user?.name}</p>
                                                                <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail size={10} /> {member.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-1.5 rounded-lg border ${member.role === 'owner' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                                <Shield size={14} />
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${member.role === 'owner' ? 'text-amber-500' : 'text-slate-400'}`}>
                                                                {member.role}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div>
                                                            <p className="text-xs text-slate-300 font-bold mb-1">Joined</p>
                                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                                                {new Date(member.joinedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all group-hover:visible invisible">
                                                                <MoreVertical size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;

