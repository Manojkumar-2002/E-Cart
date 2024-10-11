# config.py
import os
from dotenv import load_dotenv


load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
PORT = os.getenv("PORT", 5000)


config = {
    "MONGODB_URI": MONGODB_URI,
    "JWT_SECRET": JWT_SECRET,
    "PORT": PORT,   
}
