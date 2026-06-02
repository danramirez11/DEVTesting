import { Link, useLocation } from "react-router-dom";
import "../styles/Navigation.css";

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Components Showcase", path: "/" },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>Screen Navigator</h1>
      </div>
      <div className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
