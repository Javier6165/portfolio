import { expect, test } from "@playwright/test";

test("editorial entry settles and leaves the ambient cursor free to work", async ({ page, isMobile }) => {
  test.skip(isMobile, "The ambient cursor is intentionally desktop-only.");
  await page.goto("/?studio=off");
  await expect(page.locator("html")).not.toHaveAttribute("data-site-entrance", "active", { timeout: 4_000 });
  await expect(page.locator("[data-director-presence]")).toHaveAttribute("data-suspended", "false");
  await expect(page.getByRole("heading", { level: 1, name: "I design the calm inside complex products." })).toBeVisible();
});

test("case motion preserves reading, deep links and reduced-motion fallback", async ({ page, isMobile }) => {
  await page.goto("/work/logicx");
  await expect(page.locator("html")).not.toHaveAttribute("data-site-entrance", "active", { timeout: 4_000 });
  await expect(page.getByRole("heading", { level: 1, name: "Making powerful automation easier to understand." })).toBeVisible();

  if (isMobile) await page.goto("/work/logicx#editor");
  else await page.getByRole("link", { name: "03 editor" }).click();
  await expect(page).toHaveURL(/#editor$/);
  await expect(page.getByRole("heading", { name: "Separate the rule from its configuration." })).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-site-entrance", "active");
  await expect(page.getByRole("heading", { name: "Separate the rule from its configuration." })).toBeVisible();
});
