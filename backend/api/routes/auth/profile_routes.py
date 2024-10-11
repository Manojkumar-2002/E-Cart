from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
from bson.objectid import ObjectId

profile_routes = Blueprint('profile_routes', __name__)

client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

def serialize_user(user):
    """Convert ObjectId to string and exclude sensitive information."""
    if user is None:
        return None  # Handle case where user is None

    user['_id'] = str(user['_id']) if '_id' in user else None  # Convert ObjectId to string
    
    # Handle other fields that might contain ObjectId or nested structures
    for key, value in user.items():
        if isinstance(value, list):
            user[key] = [serialize_user(item) if isinstance(item, dict) else str(item) for item in value]
        elif isinstance(value, dict):
            user[key] = serialize_user(value)
        elif isinstance(value, ObjectId):
            user[key] = str(value)  

    return user

@profile_routes.route('/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})  # Exclude password
        if not user:
            return jsonify({"error": "User not found!"}), 404
        
        # Serialize user object
        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@profile_routes.route('/<user_id>', methods=['PUT'])
def update_user_profile(user_id):
    data = request.json
    update_data = {k: v for k, v in data.items() if v is not None}

    if not update_data:
        return jsonify({"error": "No fields to update!"}), 400

    try:
        result = db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"error": "User not found!"}), 404
        
        # Optionally fetch the updated user data and serialize it
        updated_user = db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        return jsonify({
            "message": "User profile updated successfully!",
            "user": serialize_user(updated_user)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def serialize_company(company):
    """Convert ObjectId to string for company data."""
    if company is None:
        return None  # Handle case where company is None

    company['_id'] = str(company['_id']) if '_id' in company else None  # Convert ObjectId to string
    
    # Handle nested structures if necessary
    for key, value in company.items():
        if isinstance(value, ObjectId):
            company[key] = str(value)  # Convert ObjectId directly if found
        elif isinstance(value, list):
            company[key] = [serialize_company(item) if isinstance(item, dict) else str(item) for item in value]
        elif isinstance(value, dict):
            company[key] = serialize_user(value)
    return company
    
@profile_routes.route('/company/<company_id>', methods=['GET'])
def get_company_profile(company_id):
    try:
        company = db.companies.find_one({"_id": ObjectId(company_id)})  
        if not company:
            return jsonify({"error": "Company not found!"}), 404
        
        # Serialize company object
        return jsonify(serialize_company(company)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@profile_routes.route('/company/<company_id>', methods=['PUT'])
def update_company_profile(company_id):
    data = request.json
    # Exclude '_id' from the update data
    update_data = {k: v for k, v in data.items() if v is not None and k != '_id'}

    if not update_data:
        return jsonify({"error": "No fields to update!"}), 400

    try:
        result = db.companies.update_one({"_id": ObjectId(company_id)}, {"$set": update_data})
        if result.matched_count == 0:
            return jsonify({"error": "User not found!"}), 404
        
        # Optionally fetch the updated user data and serialize it
        updated_user = db.companies.find_one({"_id": ObjectId(company_id)}, {"password": 0})
        return jsonify({
            "message": "User profile updated successfully!",
            "user": serialize_user(updated_user)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

