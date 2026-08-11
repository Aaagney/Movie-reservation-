import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/films" className="navbar-logo">
          <span>CINÉ</span>VAULT
        </Link>

        <nav className="navbar-navigation">
          <Link to="/films">Films</Link>
          <Link to="/bookings">My Bookings</Link>
        </nav>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <span className="navbar-user-name">Alex Rivera</span>
          <span className="navbar-user-role">Member</span>
        </div>

        <button className="signout-button" type="button">
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;