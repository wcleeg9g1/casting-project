import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      alert("로그인 성공");
      nav("/");
    } catch (err) {
      alert("로그인 실패: " + err.message);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ padding: 20 }}>
      <div>
        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
