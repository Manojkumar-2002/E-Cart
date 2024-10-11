from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
from bson.objectid import ObjectId
from api.routes.auth.token_validation import validate_token 

product_routes = Blueprint('product_routes', __name__)
client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

@product_routes.route('/add', methods=['POST'])
def add_product():
    token_validation_response = validate_token(required_role='company')
    if isinstance(token_validation_response, tuple):
        return token_validation_response  

    data = request.json
    company_id = data.get('company_id')
    product_name = data.get('product_name')
    price = data.get('price')
    description = data.get('description')

    if not company_id or not product_name or price is None:
        return jsonify({"error": "Company ID, product name, and price are required!"}), 400

    company = db.companies.find_one({"_id": ObjectId(company_id)})
    if not company:
        return jsonify({"error": "Company not found!"}), 404

    product = {
        "company_id": company_id,
        "product_name": product_name,
        "price": price,
        "description": description
    }

    try:
        result = db.products.insert_one(product)
        product_id = result.inserted_id

        db.companies.update_one(
            {"_id": ObjectId(company_id)},
            {"$push": {"products": {"id": product_id}}}
        )

        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    token_validation_response = validate_token(required_role='company')
    if isinstance(token_validation_response, tuple):
        return token_validation_response

    try:
        result = db.products.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Product not found!"}), 404
        return jsonify({"message": "Product deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/<product_id>', methods=['PUT'])
def update_product(product_id):
    token_validation_response = validate_token(required_role='company')
    if isinstance(token_validation_response, tuple):
        return token_validation_response

    data = request.json
    update_fields = {k: v for k, v in data.items() if v is not None}

    if not update_fields:
        return jsonify({"error": "No fields to update!"}), 400

    try:
        result = db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_fields})
        if result.modified_count == 0:
            return jsonify({"error": "Product not found or no changes made!"}), 404
        return jsonify({"message": "Product updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    token_validation_response = validate_token()
    if isinstance(token_validation_response, tuple):
        return token_validation_response

    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"error": "Product not found!"}), 404
        
        product["_id"] = str(product["_id"]) 
        
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@product_routes.route('/', methods=['GET'])
def get_products():
    token_validation_response = validate_token()
    if isinstance(token_validation_response, tuple):
        return token_validation_response

    try:
        products = list(db.products.find({}))
        for product in products:
            product['_id'] = str(product['_id'])

        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@product_routes.route('/company/<company_id>', methods=['GET'])
def get_products_by_company(company_id):
    token_validation_response = validate_token()
    if isinstance(token_validation_response, tuple):
        return token_validation_response

    try:
        # Find products that match the company_id
        products = list(db.products.find({"company_id": company_id}))
        
        # Convert ObjectId fields to strings for JSON response
        for product in products:
            product['_id'] = str(product['_id'])

        return jsonify(products), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

