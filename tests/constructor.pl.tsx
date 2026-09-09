import { expect, test } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test('добавляет начинку из списка в конструктор', async({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');

    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText(
      'Биокотлета из марсианской Магнолии',
      {exact: true})
    ).toHaveCount(2);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('открывает модальное окно с ингредиентом', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();
    await expect(page.getByText('Детали ингредиента', {exact: true})).toBeVisible();

    await expect(page.getByRole('heading', {name: 'Биокотлета из марсианской Магнолии'})).toBeVisible();
  });

  test('закрывает модальное окно по крестику', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();
    await expect(page.getByText('Детали ингредиента', {exact: true})).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть модальное окно' }).click();
    await expect(page.getByRole('heading', {name: 'Биокотлета из марсианской Магнолии'})).not.toBeVisible();
  });

  test('закрывает модальное окно по оверлею', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();
    await expect(page.getByText('Детали ингредиента', {exact: true})).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });
    await expect(page.getByText('Детали ингредиента', { exact: true })).not.toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test('оформляет заказ и очищает конструктор', async({context, page}) => {
    await page.routeFromHAR('./tests/hars/burger-api.har', {
      url: '**/api/**',
      update: false
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@mail.com',
            name: 'Person1'
          }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            _id: 'test-order-id',
            status: 'done',
            name: 'Space Burger',
            owner: {
              name: 'Person1',
              email: 'test@mail.com',
              createdAt: '2026-09-08',
              updatedAt: '2026-09-08'
            },
            createdAt: '2026-09-08',
            updatedAt: '2026-09-08',
            number: 12345,
            price: 25746
          },
          name: 'Space Burger'
        })
      });
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token')
    });

    await page.goto('/');

    const bun = page
      .locator('li')
      .filter({
        hasText: 'Краторная булка N-200i'
      });

    await bun.getByRole('button', {name: 'Добавить'}).click();

    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByRole('heading', {name: '12345'})).toBeVisible();
    await expect(page.getByText('Выберите булки', {exact: true})).toHaveCount(2);
    await expect(page.getByText('Выберите начинку', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Закрыть модальное окно'}).click();
    await expect(page.getByRole('heading', { name: '12345' })).not.toBeVisible();
  });
})
