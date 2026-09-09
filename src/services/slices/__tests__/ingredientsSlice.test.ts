import { describe, test, expect } from '@jest/globals';

import {
  fetchIngredients,
  ingredientsReducer,
  initialState
} from '../ingredientsSlice';
import type { TIngredient } from '@utils-types';

describe('ingredientsReducer', () => {
  const ingredient: TIngredient = {
    _id: 'ingredient-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({ ...initialState });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      {
        ingredients: [ingredient],
        isLoading: false,
        error: 'Ошибка'
      },
      fetchIngredients.pending('request-id')
    );

    expect(state).toEqual({
      ingredients: [ingredient],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      {
        ingredients: [ingredient],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled([ingredient], 'request-id', undefined)
    );

    expect(state).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      {
        ingredients: [ingredient],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Ошибка загрузки ингредиентов'),
        'request-id',
        undefined
      )
    );

    expect(state).toEqual({
      ingredients: [ingredient],
      isLoading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });
});
