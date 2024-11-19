import pytest

option = None


# this is a function to add new parameters to pytest
def pytest_addoption(parser):
    parser.addoption(
        "--allow", action="store", default=None,
        help="Select which tests are allowed to run"
    )


# this method here makes your configuration global
def pytest_configure(config):
    global option
    option = config.option


@pytest.fixture
def allow(request):
    return request.config.getoption('--allow')
