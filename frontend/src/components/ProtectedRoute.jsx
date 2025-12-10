import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // If user doesn't exist, redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;