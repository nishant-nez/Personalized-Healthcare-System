import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const logout_user = () => {
    logout();
    navigate('/');
  }

  const guestLinks = () => (
    <>
      <Link to={'/login'}>Login</Link>
      <Link to={'/signup'}>Signup</Link>
    </>
  );

  const authLinks = () => (
    <>
      <div onClick={logout_user}>Logout</div>
    </>
  );

  return (
    <>
      <div>Navbar - {user && (user.first_name + ' ' + user.email)}</div>
      <div>
        <Link to={'/'}>Home</Link>

        {isLoggedIn ? authLinks() : guestLinks()}

      </div>
    </>
  )
};

export default Navbar;
