import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.profileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
