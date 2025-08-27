import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useAuth } from "./auth/AuthContext";

function App() {
  const { access, logout } = useAuth(); // 로그인 상태 확인 + 로그아웃

  return (
    <BrowserRouter>
      <nav style={{ padding: 10}}>
        <Link to="/">Home</Link> |{" "}
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
      </nav>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
