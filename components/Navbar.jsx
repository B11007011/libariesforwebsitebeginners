import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      {/* ... existing nav items */}
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
} 