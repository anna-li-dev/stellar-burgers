import { FC, useMemo, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  clearOrder
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const isLoading = useSelector((state) => state.order.isLoading);
  const orderNotFound = useSelector((state) => state.order.orderNotFound);

  const orderFromStore =
    feedOrders.find((order) => order.number === Number(number)) ||
    profileOrders.find((order) => order.number === Number(number));

  useEffect(() => {
    if (orderFromStore) {
      dispatch(clearOrder());
      return;
    }

    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderFromStore]);

  const orderData = orderFromStore || orderModalData;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (orderNotFound) {
    return <Navigate to='/404' replace />;
  }

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
