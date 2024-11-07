from sjuRegression.bundle import TestBundle
from sjuRegression.contexts import BasicAuth, BundleContext
from playwright.async_api._generated import Page


# Title: Exmaple Context

# Details: What are we adding
class Context(BundleContext):
    web_address: str
    web_address_answer: str
    basic_auth: BasicAuth

    def __init__(self, web_address: str = "", web_address_answer: str = "",
                 basic_auth: BasicAuth = None):
        super().__init__()
        self.web_address = web_address
        self.web_address_answer = web_address_answer
        self.basic_auth = basic_auth


# Title: Example Test Class
# Success: What constitutes a successful run?
#
# Details: What are we actually testing?
class TestWeb(TestBundle):
    CONTEXT_TYPE = Context()

    async def bundle_test_basic_auth(page: Page, context: Context):
        # For text completion
        page: Page

        await page.set_extra_http_headers(headers=context.basic_auth.headers)
        await page.goto(context.web_address)
        url: str = page.url
        assert url == context.web_address_answer

    async def bundle_test_concurrency(page: Page, context: Context):
        # For text completion
        page: Page
        await page.goto(context.web_address)
        url: str = page.url
        assert url == context.web_address_answer
