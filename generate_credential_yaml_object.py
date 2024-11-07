from sjuRegression.credentials import CredentialGenerator
CREDVAR = "credvar"


def __main__():
    gen = CredentialGenerator(CREDVAR)
    gen.generate_yaml_object()


if __name__ == "__main__":
    __main__()
