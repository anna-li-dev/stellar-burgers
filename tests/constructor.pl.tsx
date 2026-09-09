import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/burger-api.har', {
    url: '**/api/**',
    update: false
  });
});

const orderNumber = 110021;

test.describe('Конструктор бургера', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('/');
  });

  test('добавляет начинку из списка в конструктор', async({ page }) => {
    const constructor = page.getByTestId('burger-constructor');

    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await expect(constructor.getByText(
      'Биокотлета из марсианской Магнолии',
      {exact: true})
    ).toHaveCount(0);

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(constructor.getByText(
      'Биокотлета из марсианской Магнолии',
      {exact: true})
    ).toHaveCount(1);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('открывает модальное окно с ингредиентом', async ({ page }) => {
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();

    const modal = page.getByTestId('modal');

    await expect(modal.getByText('Детали ингредиента', {exact: true})).toBeVisible();

    await expect(modal.getByRole('heading', {name: 'Биокотлета из марсианской Магнолии'})).toBeVisible();
  });

  test('закрывает модальное окно по крестику', async ({ page }) => {
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть модальное окно' }).click();

    await expect(modal).not.toBeVisible();
  });

  test('закрывает модальное окно по оверлею', async ({ page }) => {
    const ingredient = page
      .locator('li')
      .filter({
        hasText: 'Биокотлета из марсианской Магнолии'
      });

    await ingredient.getByRole('link').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
  });

  test('оформляет заказ и очищает конструктор', async({ page }) => {
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

    const orderModal = page.getByTestId('modal');

    await expect(orderModal.getByRole('heading', {name: String(orderNumber)})).toBeVisible();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor.getByText('Выберите булки', {exact: true})).toHaveCount(2);
    await expect(constructor.getByText('Выберите начинку', {exact: true})).toBeVisible();
    await orderModal.getByRole('button', {name: 'Закрыть модальное окно'}).click();
    await expect(orderModal).not.toBeVisible();
  });
})
