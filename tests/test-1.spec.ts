import { test, expect } from '@playwright/test';

test('Register test', async ({ page }) => {
  await page.goto('http://localhost:8001/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('user1');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('0000');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByText('Registered successfully!').click();
  await page.goto('http://localhost:8001/');
});

test('Failed Register',async ({page}) =>{
await page.goto('http://localhost:8001/');
await page.getByRole('link', { name: 'Register' }).click();
await page.getByPlaceholder('Username').click();
await page.getByPlaceholder('Username').fill('user1');
await page.getByPlaceholder('Password').click();
await page.getByRole('button', { name: 'Register' }).click();
});

test('Login Test',async ({page}) =>{
  await page.goto('http://localhost:8001/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByPlaceholder('Username').click();
  await page.getByPlaceholder('Username').fill('user1');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('0000');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Login in successfully!').click();
  });

  test('Login Failed',async ({page}) =>{
    await page.goto('http://localhost:8001/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('user');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('0000000000');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Login failed.').click();
    });

    test('Post Test',async ({page}) =>{
      await page.goto('http://localhost:8001/');
      await page.getByRole('link', { name: 'New Post' }).click();
      await page.getByPlaceholder('Write something...').click();
      await page.getByPlaceholder('Write something...').fill('new post ');
      await page.getByRole('button', { name: 'Post' }).click();
      await page.goto('http://localhost:8001/posts');
      });


      test('View Post',async ({page}) =>{
        await page.goto('http://localhost:8001/');
        await page.getByRole('link', { name: 'View Post' }).click();
        await page.goto('http://localhost:8001/posts');
        });


    
        test('XSS Test', async ({ page }) => {
          await page.goto('http://localhost:8001/');
          await page.getByRole('link', { name: 'New Post' }).click();
          await page.getByPlaceholder('Write something...').click();
          await page.getByPlaceholder('Write something...').fill('<script>alert("XSS")</script>');
          await page.getByRole('button', { name: 'Post' }).click();
        });