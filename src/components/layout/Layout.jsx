import { Outlet } from "react-router";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="container">
        <p>© 2025 Mini Game Playground</p>
      </footer>
    </div>
  );
}

export default Layout;
