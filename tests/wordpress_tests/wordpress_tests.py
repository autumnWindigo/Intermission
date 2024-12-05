from sjuRegression.bundle import TestBundle
from sjuRegression.contexts import BundleContext
from playwright.async_api._generated import Page
from playwright.async_api import expect
import re


class Context(BundleContext):
    dummy: str

    def __init__(self, dummy: str = ""):
        super().__init__()
        self.dummy = dummy


class TestWordpress(TestBundle):
    CONTEXT_TYPE = Context()

    async def bundle_test_wordpress_main(page: Page, context: Context):
        page: Page
        await page.goto("https://sites.sju.edu/")
        await expect(page.locator("#post-424")).to_contain_text(
            "Learn how to manage your WordPress website."
        )
        await expect(page.locator("#masthead")).to_contain_text("SJU WordPress Sites")

    async def bundle_test_wordpress_beaver(page: Page, context: Context):
        page: Page
        await page.goto("https://sites.sju.edu/community-engagement/")
        await expect(
            page.locator("div")
            .filter(has_text=re.compile(r"^To navigate, press the arrow keys\.$"))
            .nth(1)
        ).to_be_visible()
        await expect(page.get_by_role("heading")).to_contain_text("Engaging The Community")

    async def bundle_test_wordpress_writing_center(page: Page, context: Context):
        page: Page
        await page.goto("https://www.sju.edu/writingcenter")
        await expect(page.locator("h1")).to_contain_text("The Writing Center")
        await expect(
            page.get_by_label("List of Links").get_by_role("list")
        ).to_contain_text("How Tutorials Work")
        await page.get_by_role("link", name="Learn More").click()
        await expect(page.locator("#block-sju-content")).to_contain_text("Mission")
