import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import { createOrderThunk } from '../../services/slices/constructorSlice';
import { clearOrder } from '../../services/slices/constructorSlice';
export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const dispatch = useDispatch();
  const orderRequest = useSelector(
    (state) => state.burgerConstructor.orderRequest
  );

  const orderModalData = useSelector((state) => state.burgerConstructor.order);
  const error = useSelector((state) => state.burgerConstructor.error);
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(createOrderThunk(ingredients));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      error={error}
    />
  );
};
