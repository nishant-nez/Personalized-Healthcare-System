import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, isLoggedIn, user } = useAuth();

  const guestLinks = () => (
    <>
      <Link to={'/login'}>Login</Link>
      <Link to={'/signup'}>Signup</Link>
    </>
  );

  const authLinks = () => (
    <>
      <div onClick={logout}>Logout</div>
    </>
  );

  return (
    <>
      <div>Navbar</div>
      <div>
        <Link to={'/'}>Home</Link>

        {isLoggedIn ? authLinks() : guestLinks()}

      </div>
    </>
  )
};

export default Navbar;
