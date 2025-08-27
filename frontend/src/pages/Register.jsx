import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (res.ok) {
      alert("회원가입 성공");
      nav("/login");
    } else {
      const txt = await res.text();
      alert("회원가입 실패: " + txt);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ padding: 20 }}>
      <div><input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
      <div><input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <button type="submit">Register</button>
    </form>
  );
}
