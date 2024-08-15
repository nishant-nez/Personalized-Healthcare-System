import { useAuth } from "@/contexts/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from "react-router-dom";
import queryString from 'query-string';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { load_user, checkAuthenticated, googleAuthenticate } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const values = queryString.parse(location.search);
        const state = values.state ? values.state : '';
        const code = values.state ? values.code : '';

        if (state && code) {
            googleAuthenticate(String(state), String(code));
        } else {
            checkAuthenticated();
            load_user();
        }

    }, [location]);

    return (
        <div>
            <Navbar />
            {children}
            <Toaster />
        </div>
    );
};

export default Layout;
