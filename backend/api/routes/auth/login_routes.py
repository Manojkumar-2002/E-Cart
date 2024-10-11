from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
import bcrypt
from api.routes.auth.token_validation import generate_token

login_routes = Blueprint('login_routes', __name__)

client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

@login_routes.route('/user', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    user = db.users.find_one({"email": email})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        token = generate_token({'email': email}, role='user')
        
        user_data = {
            "id": str(user['_id']),
            "name": user['name'],
            "token": token
        }
        
        return jsonify({"token": token, "user": user_data}), 200
    else:
        return jsonify({"error": "Invalid email or password!"}), 401
    
    
    

@login_routes.route('/company', methods=['POST'])
def login_company():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    company = db.companies.find_one({"email": email})
    
    if company and bcrypt.checkpw(password.encode('utf-8'), company['password'].encode('utf-8')):
        token = generate_token({'email': email}, role='company')
        
        company_data = {
            "id": str(company['_id']),
            "company_name": company['company_name'],
            "email": company['email'],
            "phone": company['phone'],
            "token": token  
        }

        return jsonify({"token": token, "company": company_data}), 200
    else:
        return jsonify({"error": "Invalid email or password!"}), 401
