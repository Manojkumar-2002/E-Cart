from flask import request, jsonify
import jwt
import datetime
from api.config.config import config

def generate_token(data, role, expires_in_days=7):
    payload = {
        'email': data.get('email'),
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=expires_in_days)
    }
    token = jwt.encode(payload, config['JWT_SECRET'], algorithm="HS256")
    return token

def validate_token(required_role=None):
    token = None
    if 'Authorization' in request.headers:
        token = request.headers['Authorization'].split(" ")[1]

    if not token:
        return jsonify({"error": "Token is missing!"}), 401

    try:
        decoded_token = jwt.decode(token, config['JWT_SECRET'], algorithms=["HS256"])

        if required_role == 'user' and decoded_token.get('role') != 'user':
            return jsonify({"error": "Unauthorized access for user!"}), 403
        elif required_role == 'company' and decoded_token.get('role') != 'company':
            return jsonify({"error": "Unauthorized access for company!"}), 403
        
        return decoded_token

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token!"}), 401
