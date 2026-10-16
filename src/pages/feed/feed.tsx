import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedOrders } from '../../services/slices/orderSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { feed, feedLoading, error } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeedOrders());
  }, [dispatch]);
  if (feedLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка загрузки заказов: {error}</p>;
  }
  return (
    <FeedUI orders={feed} handleGetFeeds={() => dispatch(fetchFeedOrders())} />
  );
};
