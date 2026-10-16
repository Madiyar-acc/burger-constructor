import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import type { RootState } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const { isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  if (!authChecked) {
    return null;
  }
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
