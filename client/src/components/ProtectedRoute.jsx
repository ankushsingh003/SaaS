import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Loading secure session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
