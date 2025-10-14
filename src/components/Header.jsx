import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';
import authService from '../features/auth/authService';

function Header() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const onLogout = () => {
    authService.logout();
    useAuthStore.setState({ user: null });
    navigate('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md mb-8">
      <div className="text-xl font-bold">
        <Link to="/">SplitIt</Link>
      </div>
      {/* We removed gap-6 from this ul */}
      <ul className="flex items-center">
        {user ? (
          <li>
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              onClick={onLogout}
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            {/* We add a margin-right (mr-6) to the Login item */}
            <li className="font-semibold text-gray-600 hover:text-black mr-6">
              <Link to="/login">Login</Link>
            </li>
            <li>

            </li>
            <li className="font-semibold text-gray-600 hover:text-black">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;