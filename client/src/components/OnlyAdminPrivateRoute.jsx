import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isPerson === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
