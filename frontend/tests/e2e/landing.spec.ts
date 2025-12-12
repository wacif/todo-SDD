// frontend/tests/e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {

  test('should load the page and contain primary headline and CTA', async ({ page }) => {
    // T004 - Initial boilerplate
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Your tasks, simplified/i);
    await expect(page.getByRole('link', { name: /Start organizing for free/i })).toBeVisible();
  });

  // T016 - Placeholder for future accessibility test
  test.skip('should pass basic accessibility audit (T016)', async ({ page }) => {
    await page.goto('/');
    // Check for major accessibility issues (e.g., contrast, missing alt text)
    const accessibilityResult = await page.accessibility.snapshot();
    // This is typically handled by dedicated tools like axe-core within tests,
    // but the boilerplate ensures the test file exists for later integration.
  });

  test('should handle authenticated/unauthenticated CTA states (T016)', async ({ page }) => {
    // Test 1: Anonymous user sees "Login" and "Sign up" CTA
    await page.goto('/');

    // Anonymous: Prominent Login link, Sign up CTA
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start organizing for free' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Dashboard' })).not.toBeVisible();

    // Anonymous: Click login should redirect to /login
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL(/.*\/login/);

    // Test 2: Authenticated user sees "Go to Dashboard" CTA
    // The mock in LandingNav.tsx uses localStorage.setItem('isLoggedIn', 'true')
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('isLoggedIn', 'true'));
    await page.reload();

    // Authenticated: Prominent "Go to Dashboard" CTA
    await expect(page.getByRole('link', { name: 'Go to Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).not.toBeVisible(); // Signup CTA is replaced by Dashboard

    // Authenticated: Click Dashboard should redirect to /tasks
    await page.getByRole('link', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/.*\/tasks/);

    // Clean up localStorage
    await page.evaluate(() => localStorage.removeItem('isLoggedIn'));
  });

  // T016 - Placeholder for future accessibility test
  test.skip('should be responsive across multiple breakpoints (T027)', async ({ page }) => {
    // This will be implemented in a later phase (T027)
  });

  // T028 - Placeholder for future Lighthouse audit
  test.skip('should achieve target Lighthouse performance scores (T028)', async ({ page }) => {
    // This will be run using an external tool (Lighthouse CI) as part of T028
  });
});
