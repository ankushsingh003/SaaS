import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createWorkspace } from '../features/workspaces/workspaceSlice';
import { Layout, Plus, Loader2, ArrowRight } from 'lucide-react';

/**
 * CreateWorkspace Page:
 * Allows authenticated users to create their first organization/workspace.
 * This is typically the first step after registration.
 */
const CreateWorkspace = () => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get workspace state from Redux
    const { loading, error } = useSelector((state) => state.workspaces);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Dispatch the createWorkspace action
        // This will call our backend API and handle the multi-tenant setup
        const result = await dispatch(createWorkspace({ name }));
        
        if (!result.error) {
            // Once workspace is created, redirect to dashboard
            navigate('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            {/* Background design elements */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
            
            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                        <Plus className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Create Workspace</h1>
                    <p className="mt-2 text-slate-400">Every project starts with a workspace. Set yours up in seconds.</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Handling Display */}
                        {error && (
                            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Workspace Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                                    <Layout size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="e.g. My Amazing Team"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 ml-1 uppercase tracking-widest font-semibold flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                                You can change this later in settings
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !name}
                            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Launch Workspace
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkspace;
