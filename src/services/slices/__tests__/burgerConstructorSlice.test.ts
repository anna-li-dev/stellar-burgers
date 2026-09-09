import { expect, test, describe } from '@jest/globals';

import {
  initialState,
  burgerConstructorReducer,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burgerConstructorSlice';
import type { TConstructorIngredient } from '@utils-types';

describe('burgerConstructorReducer', () => {
  const bun: TConstructorIngredient = {
    _id: 'bun-1',
    id: 'constructor-bun-1',
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

  const ingredient: TConstructorIngredient = {
    _id: 'ingredient-1',
    id: 'constructor-ingredient-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 424,
    calories: 4242,
    price: 424,
    image: 'image.jpg',
    image_large: 'image-large.jpg',
    image_mobile: 'image-mobile.jpg'
  };

  const secondIngredient: TConstructorIngredient = {
    _id: 'ingredient-2',
    id: 'constructor-ingredient-2',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 100,
    price: 90,
    image: 'image-2.jpg',
    image_large: 'image-large-2.jpg',
    image_mobile: 'image-mobile-2.jpg'
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({ ...initialState });
  });

  test('обрабатывает setBun', () => {
    const state = burgerConstructorReducer(undefined, setBun(bun));

    expect(state).toEqual({
      bun,
      ingredients: []
    });
  });

  test('обрабатывает addIngredient', () => {
    const state = burgerConstructorReducer(
      undefined,
      addIngredient(ingredient)
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [ingredient]
    });
  });

  test('обрабатывает removeIngredient', () => {
    const state = burgerConstructorReducer(
      {
        bun: null,
        ingredients: [ingredient, secondIngredient]
      },
      removeIngredient(ingredient.id)
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [secondIngredient]
    });
  });

  test('обрабатывает moveIngredient', () => {
    const state = burgerConstructorReducer(
      {
        bun,
        ingredients: [ingredient, secondIngredient]
      },
      moveIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state).toEqual({
      bun,
      ingredients: [secondIngredient, ingredient]
    });
  });

  test('обрабатывает clearConstructor', () => {
    const state = burgerConstructorReducer(
      {
        bun,
        ingredients: [ingredient, secondIngredient]
      },
      clearConstructor()
    );

    expect(state).toEqual({ ...initialState });
  });
});
