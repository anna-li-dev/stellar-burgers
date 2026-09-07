import { FC } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  // Ингредиенты ещё загружаются
  if (isLoading) {
    return <Preloader />;
  }

  // Загрузка закончилась, но такого ингредиента нет
  if (!ingredientData) {
    return <Navigate to='/404' replace />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
