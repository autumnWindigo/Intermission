from __future__ import annotations

import asyncio
from collections.abc import Generator, Iterable
from contextlib import asynccontextmanager
from inspect import currentframe
from re import Pattern, compile, search
from typing import Any

import pytest
from playwright.async_api import async_playwright
from playwright.async_api._generated import Browser
from pytest_subtests import SubTests

from sjuRegression.contexts import BundleContext


pytestmark = pytest.mark.asyncio


class TestBundle:
    # OVERWRITE IN CHILD to change context class
    #  (you should almost always be doing this)
    CONTEXT_TYPE = BundleContext()

    # OVERWRITE IN CHILD to change naming convention for child class
    TEST_PATTERN: Pattern = compile("bundle_.*")

    # OVERWRITE IN CHILD to change concurrency
    NUM_TASKS: int = 3

    @asynccontextmanager
    async def web_driver_connection(
            self) -> Generator[Browser, None, None]:
        """Create unique webdriver for each test

        Specific options for firefox can be found here:
            https://developer.mozilla.org/en-US/docs/Web/WebDriver/Capabilities/firefoxOptions

        Yields:
            Gecko Webdriver session
        """
        async with async_playwright() as p:
            browser = await p.firefox.launch()
            try:
                yield browser
            finally:
                await browser.close()

    def find_tests(
            self, ignored_names: list[str],
            pattern: Pattern) -> Generator[str, None, None]:
        """Finds and bundles subtests within a test class based on TEST_PATTERN

        Args:
            ignored_names: functions to ignore
                    include function called from to prevent recursion
            pattern: regex pattern to parse tests from

        Yields:
            Test function name
        """
        for func in [f for f in dir(self.__class__)
                     if not f.startswith('__')
                     and callable(getattr(self.__class__, f))]:
            if func in ignored_names:
                continue
            if search(self.TEST_PATTERN, func):
                yield func

    async def worker(
            self, subtests: SubTests,
            queue: asyncio.Queue[tuple], page) -> None:
        """Queue worker runs subtests
        guaruntees only NUM_WORKERS are running concurrently

        Args:
            subtests: Subtest object used by pytest_subtests
            queue: Names of coroutine tests to be run
            context: input class from yaml file
        """
        while True:
            # Start sub task
            context: tuple = await queue.get()
            with subtests.test(msg=context[0]):
                await getattr(self.__class__, context[0])(
                    page, context[1])

            # Iter queue
            queue.task_done()

    async def tests(self, subtests: SubTests) -> None:
        """Test runner (Pretend this is main!)

        Args:
            subtests: Subtest object used by pytest_subtests

        Raises:
            TypeError: If no valid tests are found
        """
        try:
            functions: Iterable[str] = self.find_tests(
                currentframe().f_code.co_name, self.TEST_PATTERN)
            # Tuple[0] -> str name of function
            # tuple[1] -> Page from playwright
            queue: asyncio.Queue[tuple] = asyncio.Queue()

            context_dict: dict[str, list[type(
                self.CONTEXT_TYPE)]] = self.CONTEXT_TYPE.generate_context()

            # Add test names to queue
            # Make better names
            for coro in functions:
                for con in context_dict.get(coro):
                    queue.put_nowait((coro, con))

            # Create workers for queue
            tasks: list[asyncio.Task[Any]] = []
            async with self.web_driver_connection() as session:
                for _ in range(self.NUM_TASKS):
                    browser_context = await session.new_context()
                    task = asyncio.create_task(self.worker(
                        subtests, queue,
                        await browser_context.new_page()))
                    tasks.append(task)

                # Consume Queue
                await queue.join()

            # Cancel worker tasks
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)

        except Exception as e:
            raise e
            assert False
        finally:
            # Set to False to have debug output
            assert True
