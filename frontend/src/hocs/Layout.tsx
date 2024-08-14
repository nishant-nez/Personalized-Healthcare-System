import { useAuth } from "@/contexts/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { load_user, checkAuthenticated } = useAuth();

    useEffect(() => {
        checkAuthenticated();
        load_user();
    }, []);

    return (
        <div>
            <Navbar />
            {children}
            <Toaster />
        </div>
    );
};

export default Layout;
