import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.userOrders);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, accessToken]);

  return <ProfileOrdersUI orders={orders} />;
};
