// src/App.jsx
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Board from "./pages/Board";
import BoardDetail from "./pages/BoardDetail";
import BoardForm from "./pages/BoardForm";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/board" element={<Board />} /> {/* 게시판 페이지 */}
          <Route path="/board/new" element={<BoardForm />} />
          <Route path="/board/:id/edit" element={<BoardForm />} />
          <Route path="/board/:id" element={<BoardDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
