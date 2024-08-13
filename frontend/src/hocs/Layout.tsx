import Navbar from "../components/Navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
};

export default Layout;
