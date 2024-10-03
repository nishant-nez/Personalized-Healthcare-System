import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
    const { user } = useAuth();

    return (
        <>
            Home
            <br />
            Hello, {user && user.email}
        </>
    );
}

export default Home;