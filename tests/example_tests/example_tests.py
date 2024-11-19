# You MUST import these
from sjuRegression.bundle import TestBundle
from sjuRegression.contexts import BundleContext

# Import for page type if you want proper code completion
from playwright.async_api._generated import Page

# For float example
from math import isclose

# Make sure you have an empty __init__.py in the folder so it's recognized

# Context Classes!
#     This will be passed into all of your test functionsin this file!
#     For a basic context, all you need to do is add the variables and
#     create a __init__ like this

# The name you choose will be the same for the yaml tag
#   -> for example this would be '!MyContext'
#   -> you can change this by creating a YAML_TAG variable if you
#       don't like the default

# Read on yaml types and how to implement here
# https://pyyaml.org/wiki/PyYAMLDocumentation


class MyContext(BundleContext):
    my_fun_string: str
    my_fun_list_of_floats: list[float]

# You need to have defaults for each type in the __init__ just trust me
    def __init__(
            self, my_fun_string: str = "",
            my_fun_list_of_floats: list[float] = []):
        # Make sure you call super().__init__() or yaml info won't generate
        super().__init__()
        # Then set your variables like normal (or do whatever you need to)
        self.my_fun_string = my_fun_string
        self.my_fun_list_of_floats = my_fun_list_of_floats


# This is your testing class it MUST start with 'Test'
# and be a child of TestBundle otherwise it will not be recognized nor ran
class TestWeb(TestBundle):
    # Set the context type to an empty version of the context you made
    #  it will be filled by yaml input
    CONTEXT_TYPE = MyContext()

    # Tests run in async must be denoted by the TEST_PATTERN variable
    #   by default it is 'bundle_' but you can change it if you want

    # If you want a test run in sync, then denote it only by test_
    #  for example def test_basic_auth():

    # The order is driver, context when passing
    #  you can add custom objects through yaml so there's no need to pass
    #  any obejcts outside of MyContext
    async def bundle_test_my_float(page: Page, context: MyContext):
        # In your function, creation and deletion of drivers are done by the
        # contex manager, so don't worry about any dirty work just get
        # that test up and let everything handle itself

        # Code completion only works properly when denoting driver as type Page
        #  inside the function, no idea why.
        page: Page

        # Do your page stuff
        # page.goto("mysite.com")

        assert isclose(context.my_fun_list_of_floats[0], 1.54)

    async def bundle_test_my_string(page: Page, context: MyContext):
        # For text completion
        page: Page

        assert context.my_fun_string == "some string"
