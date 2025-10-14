import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/authStore';

const PrivateRoute = () => {
  const { user } = useAuthStore(); // Check for the user in our global state

  // If the user is logged in, render the child component using <Outlet />.
  // Otherwise, redirect them to the /login page using <Navigate />.
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;