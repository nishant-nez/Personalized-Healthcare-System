import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();


    return (
        isLoggedIn
            ? <Outlet />
            : <Navigate to={`/login`} state={{ from: location }} replace />
    );
}

export default RequireAuth;