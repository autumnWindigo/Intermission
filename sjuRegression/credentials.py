import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from getpass import getpass


class CredentialGenerator:
    fernet: Fernet

    def __init__(self, env_key: str):
        load_dotenv()
        secret_key = os.getenv(env_key)
        self.fernet = Fernet(secret_key.encode())

    def generate_yaml_object(self):
        username = input("Enter Username: ")
        password = getpass("Enter Password: ")
        print(f"""
credentials: !Credentials
    username: {self.encrypt(username.encode())}
    password: {self.encrypt(password.encode())}""")

    def encrypt(self, credential: str) -> str:
        return self.fernet.encrypt(credential).decode()

    def decrypt(self, credential: str) -> str:
        return self.fernet.decrypt(credential).decode()
