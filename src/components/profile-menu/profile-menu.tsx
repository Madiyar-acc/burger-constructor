import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutThunk } from '../../services/slices/authSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch {
    } finally {
      navigate('/login', { replace: true });
    }
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
