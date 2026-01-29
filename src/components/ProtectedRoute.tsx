import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-brand-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
