import { Outlet } from "react-router";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>© 2025 Mini Game Playground</p>
      </footer>
    </div>
  );
}

export default Layout;
