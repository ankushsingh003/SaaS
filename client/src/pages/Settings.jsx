import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { fetchWorkspaces } from '../features/workspaces/workspaceSlice';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Settings as SettingsIcon, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Loader2,
  Globe,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Workspace Settings Page:
 * Allows owners to update workspace name, slug, and other global configs.
 */
const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeWorkspace } = useSelector((state) => state.workspaces);
    
    const [name, setName] = useState(activeWorkspace?.name || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name) return;

        try {
            setLoading(true);
            await api.patch(`/workspaces/${activeWorkspace._id}`, { name });
            toast.success('Workspace updated successfully!');
            dispatch(fetchWorkspaces()); // Refresh global list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update workspace');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <Toaster position="top-right" />
            
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Settings</h1>
                        <p className="text-sm text-slate-500">Configure your workspace preferences and identity.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-400 font-bold">
                                <SettingsIcon size={20} />
                            </div>
                            <h2 className="font-bold text-white text-lg font-bold">General Information</h2>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Workspace Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Enter workspace name"
                                    required
                                />
                                <p className="text-[10px] text-slate-500 mt-2 ml-1">Changing the name will also update your URL slug automatically.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Current Slug</label>
                                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-slate-400 cursor-not-allowed">
                                    <Globe size={16} />
                                    <span className="text-sm font-mono tracking-tight">{activeWorkspace?.slug}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || name === activeWorkspace?.name}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-2xl border border-red-900/20 bg-red-900/5 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-red-600/10 text-red-500 font-bold">
                                <ShieldAlert size={20} />
                            </div>
                            <h2 className="font-bold text-red-400 text-lg font-bold">Danger Zone</h2>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 rounded-xl border border-red-900/20 bg-red-900/5">
                            <div>
                                <h3 className="text-sm font-bold text-red-300 mb-1">Delete this workspace</h3>
                                <p className="text-xs text-red-500/60 font-medium">Once deleted, it cannot be recovered. All your analytics will be gone.</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-900/20 whitespace-nowrap">
                                <Trash2 size={14} />
                                Delete Workspace
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
