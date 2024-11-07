import yaml
import base64
from typing import Self, Any
from sys import modules
from os.path import dirname
from sjuRegression.credentials import CredentialGenerator


class Credentials(yaml.YAMLObject):
    SECRET_VAR = "credvar"
    username: str
    password: str

    def __init__(self, username: str, password: str):
        # Will need to do decryption here

        # Pass key var name
        gen = CredentialGenerator(self.SECRET_VAR)
        self.username = gen.decrypt(username)
        self.password = gen.decrypt(password)

    def __from_yaml(loader: yaml.Loader, node: yaml.Node) -> Self:
        return Credentials(**loader.construct_mapping(node, deep=True))

    def __get_tag() -> str:
        return "!Credentials"

    @staticmethod
    def add_constructor_with_loader(loader: yaml.Loader):
        loader.add_constructor(Credentials.__get_tag(),
                               Credentials.__from_yaml)


class BasicAuth(yaml.YAMLObject):
    credentials: Credentials
    headers: dict[str, str] = {}

    def __init__(self, credentials: Credentials) -> Self:
        # Creds already decrypted
        self.credentials = credentials
        self.headers['Authorization'] = 'Basic ' + base64.b64encode(
            '{}:{}'.format(credentials.username, credentials.password)
            .encode('utf-8')).decode('utf-8')

    def __from_yaml(loader: yaml.Loader, node: yaml.Node) -> Self:
        return BasicAuth(**loader.construct_mapping(node, deep=True))

    def __get_tag() -> str:
        return "!BasicAuth"

    @staticmethod
    def add_constructor_with_loader(loader: yaml.Loader):
        loader.add_constructor(BasicAuth.__get_tag(),
                               BasicAuth.__from_yaml)


class BundleContext(yaml.YAMLObject):
    YAML_TAG: str
    YAML_DIR: str
    YAML_FILE: str = 'bundle.yaml'

    def __init__(self) -> Self:
        self.YAML_DIR = self.__update_path()
        self.YAML_TAG = self.__update_tag()

    @classmethod
    def __from_yaml(
            cls, loader: yaml.Loader,
            node: yaml.Node) -> Self:
        return cls(**loader.construct_mapping(node, deep=True))

    def __get_loader(self) -> yaml.SafeLoader:
        loader: yaml.SafeLoader = yaml.SafeLoader
        loader.add_constructor(self.YAML_TAG, self.__from_yaml)
        BasicAuth.add_constructor_with_loader(loader)
        Credentials.add_constructor_with_loader(loader)
        return loader

    def __update_path(self) -> str:
        return dirname(
            modules[self.__class__.__module__].__file__) + "/"

    def __update_tag(self) -> str:
        return "!" + self.__class__.__name__

    def generate_context(self) -> dict[str, list[Any]]:
        try:
            with open(self.YAML_DIR + self.YAML_FILE, 'r') as f:
                return yaml.load(f, Loader=self.__get_loader())
        except FileNotFoundError:
            return {}
