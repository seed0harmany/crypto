
// Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Download,
  Upload,
  Users,
  User,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const items = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Invest', icon: Wallet, path: '/invest' },
    { label: 'Investments', icon: LineChart, path: '/investments' },
    { label: 'Deposit History', icon: Download, path: '/deposits' },
    { label: 'Withdrawal', icon: Upload, path: '/withdraw' },
    { label: 'Referral', icon: Users, path: '/referral' },
    { label: 'Account', icon: User, path: '/account' }
  ];

  const handleLogout = () => {
    // placeholder for real auth clear
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="brand">Johnny One Mama</div>

      <nav className="menu">
        {items.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <button className="menu-item logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      <style>{`
        .sidebar {
          width: 300px;
          background: #050607;
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          position: fixed;
          inset: 0 auto 0 0;
          border-right: 1px solid #111;
        }
        .brand {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 36px;
        }
        .menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          background: transparent;
          border: none;
          color: #b7bdc6;
          text-decoration: none;
          cursor: pointer;
          transition: background .2s, color .2s;
          font-size: 1.1rem;
        }
        .menu-item:hover {
          background: #111318;
          color: #fff;
        }
        .menu-item.active {
          background: #1a1f2b;
          color: #f0b90b;
        }
        .menu-item.logout {
          margin-top: 18px;
          color: #e05252;
        }
        .menu-item.logout:hover {
          background: rgba(224,82,82,.1);
          color: #ff6b6b;
        }
      `}</style>
    </aside>
  );
}