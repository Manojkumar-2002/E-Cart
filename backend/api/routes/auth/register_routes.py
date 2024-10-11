from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
import bcrypt

register_routes = Blueprint('register_routes', __name__)

client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

@register_routes.route('/user', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')  # Get the name field from the request
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    address = data.get('address')  # Get the address field from the request

    # Validate that all required fields are provided
    if not name or not email or not phone or not password or not address:
        return jsonify({"error": "Name, email, phone, password, and address are required!"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        db.users.insert_one({
            "name": name,  # Store the name in the user document
            "email": email,
            "phone": phone,
            "password": hashed_password.decode('utf-8'),
            "address": address  # Store the address in the user document
        })
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@register_routes.route('/company', methods=['POST'])
def register_company():
    data = request.json
    company_name = data.get('company_name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    address = data.get('address') 

    
    if not company_name or not email or not phone or not password or not address:
        return jsonify({"error": "Company name, email, phone, password, and address are required!"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        db.companies.insert_one({
            "company_name": company_name,
            "email": email,
            "phone": phone,
            "password": hashed_password.decode('utf-8'),
            "address": address  # Store the address in the company document
        })
        return jsonify({"message": "Company registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
