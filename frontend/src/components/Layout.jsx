// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main style={{ padding: 20 }}>
        <Outlet /> {/* 여기에 Home, Login, Register 페이지가 렌더링됨 */}
      </main>
      <Footer />
    </div>
  );
}
