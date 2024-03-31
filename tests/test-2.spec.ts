import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:8001/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('admin');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('0000');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('http://localhost:8001/');
  await page.getByRole('link', { name: 'New Post' }).click();
  await page.getByPlaceholder('Write something...').click();
  await page.getByPlaceholder('Write something...').fill('this is a post');
  await page.getByRole('button', { name: 'Post' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
  await page.getByRole('link', { name: 'View Post' }).click();
  await page.getByRole('link', { name: 'Create a New Post' }).click();
  await page.getByPlaceholder('Write something...').click();
  await page.getByPlaceholder('Write something...').fill('another post ');
  await page.getByRole('button', { name: 'Post' }).click();
  await page.getByRole('link', { name: 'Back' }).click();
});

