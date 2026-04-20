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
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Team Management Page:
 * Allows owners/admins to view members and invite new ones.
 */
const Team = () => {
    const { activeWorkspace } = useSelector((state) => state.workspaces);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);

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
        if (!inviteEmail) return;

        try {
            setInviting(true);
            await api.post(`/workspaces/${activeWorkspace._id}/invite`, {
                email: inviteEmail,
                role: 'member'
            });
            toast.success('Member added successfully!');
            setInviteEmail('');
            fetchMembers(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to invite member');
        } finally {
            setInviting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <Toaster position="top-right" />
            
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Team Management</h1>
                            <p className="text-sm text-slate-500">Manage who has access to {activeWorkspace?.name}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Invite Section */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400">
                                    <UserPlus size={20} />
                                </div>
                                <h2 className="font-bold text-white">Invite Member</h2>
                            </div>
                            
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="teammate@company.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={inviting || !inviteEmail}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                                >
                                    {inviting ? <Loader2 className="animate-spin" size={18} /> : 'Send Invitation'}
                                </button>
                                
                                <p className="text-[10px] text-slate-500 text-center mt-4">
                                    Invitees must already have a SaaSify account to be added directly.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Members List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-sm">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-lg border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-3 text-sm text-white focus:border-slate-700 focus:outline-none transition-all"
                                    placeholder="Search members..."
                                />
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                                <Users size={14} />
                                {members.length} Members
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/80 border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Member</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Added</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                                            </td>
                                        </tr>
                                    ) : (
                                        members.map((member) => (
                                            <tr key={member._id} className="hover:bg-slate-800/30 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-blue-400 border border-slate-700">
                                                            {member.user?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white leading-none mb-1">{member.user?.name}</p>
                                                            <p className="text-xs text-slate-500">{member.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={14} className={member.role === 'owner' ? 'text-blue-400' : 'text-slate-500'} />
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                            member.role === 'owner' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                                                        }`}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {new Date(member.joinedAt || Date.now()).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            
                            {!loading && members.length === 0 && (
                                <div className="p-12 text-center">
                                    <Users className="mx-auto text-slate-700 mb-4" size={40} />
                                    <p className="text-slate-500">No members found in this workspace yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
