// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { access, logout } = useAuth();

  return (
    <header style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/board">Board</Link> |{" "}
      {access ? (
        <>
          <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
          
        </>
      )}
    </header>
  );
}
