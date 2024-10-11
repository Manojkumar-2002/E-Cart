from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
from bson.objectid import ObjectId

order_routes = Blueprint('order_routes', __name__)
client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

@order_routes.route('/add', methods=['POST'])
def add_order():
    data = request.json
    user_id = data.get('user_id')
    products = data.get('products')
    company_id = data.get('company_id')
    # Validate input
    if not user_id or not products:
        return jsonify({"error": "User ID and products are required!"}), 400

    if not isinstance(products, list) or len(products) == 0:
        return jsonify({"error": "'products' must be a non-empty list!"}), 400

    try:
        # Find user by ID
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve user: {str(e)}"}), 500
    
    try:
        company = db.companies.find_one({"_id": ObjectId(company_id)})
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve company: {str(e)}"}), 500

    if not user:
        return jsonify({"error": "User not found!"}), 404
    
    if not company:
        return jsonify({"error": "User not found!"}), 404

    # Get user address
    user_address = user.get('address')
    if not user_address:
        return jsonify({"error": "User address not found!"}), 404

    # Group products by company_id
    company_orders = {}
    for product in products:
        if company_id not in company_orders:
            company_orders[company_id] = {
                "products": [],
                "total_price": 0
            }
        # Add product to respective company's list and calculate total price
        company_orders[company_id]['products'].append({
            "product_id": product.get('product_id'),
            "product_name":product.get('product_name'),
            "price":product.get('price'),
            "quantity": product.get('quantity'),
            "total_price": product.get('total_price')
        })
        company_orders[company_id]['total_price'] += product.get('total_price')

    # Create orders for each company and update company's and user's order lists
    created_orders = []
    try:
        for company_id, order_data in company_orders.items():
            order = {
                "user_id": user_id,
                "company_id": company_id,
                "products": order_data['products'],
                "status": "Pending",
                "total_price": order_data['total_price'],
                "user_address": user_address
            }
            # Insert order into 'orders' collection
            result = db.orders.insert_one(order)
            order_id = result.inserted_id
            order['_id'] = order_id  # Append order ID to the order object

            # Add the order_id to the respective company's orders array
            db.companies.update_one(
                {"_id": ObjectId(company_id)},
                {"$push": {"orders": order_id}}
            )

            # Add the order_id to the user's orders array
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"user_orders": order_id}}
            )

            created_orders.append(order)
            db.carts.delete_many({"user_id": ObjectId(user_id)})

        return jsonify({"message": "Orders added successfully!", "orders": created_orders}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        result = db.orders.delete_one({"_id": ObjectId(order_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Order not found!"}), 404
        return jsonify({"message": "Order deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    update_fields = {k: v for k, v in data.items() if v is not None}

    if not update_fields:
        return jsonify({"error": "No fields to update!"}), 400

    try:
        result = db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": update_fields})
        if result.modified_count == 0:
            return jsonify({"error": "Order not found or no changes made!"}), 404
        return jsonify({"message": "Order updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/order/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = db.orders.find_one({"_id": ObjectId(order_id)})
        if not order:
            return jsonify({"error": "Order not found!"}), 404
        return jsonify(order), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@order_routes.route('/<user_id>', methods=['GET'])
def get_orders(user_id):
    try:
        # Fetch orders based on user_id
        orders = list(db.orders.find({"user_id": user_id}))
        
        # Check if orders exist for the user
        if not orders:
            return jsonify({"message": "No orders found for this user!"}), 404

        # Process and serialize orders
        for order in orders:
            order['_id'] = str(order['_id'])  # Convert ObjectId to string
            order['user_id'] = str(order['user_id'])  # Convert user_id to string
            order['company_id'] = str(order['company_id']) if order['company_id'] else None  # Convert or set to None

            # Serialize products directly
            for product in order.get('products', []):  # Use .get() to avoid KeyError
                product['product_id'] = str(product['product_id'])  # Convert product_id to string
                # No need to check for '_id' since it doesn't exist in products
                # Add additional fields from the product if necessary

            # Optionally serialize the user_address if needed
            if 'user_address' in order:
                order['user_address'] = {
                    "city": order['user_address'].get("city"),
                    "country": order['user_address'].get("country"),
                    "state": order['user_address'].get("state"),
                    "street": order['user_address'].get("street"),
                    "zip_code": order['user_address'].get("zip_code")
                }

        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@order_routes.route('/company/<company_id>', methods=['GET'])
def get_orders_by_company(company_id):
    try:
        # Fetch orders based on company_id
        orders = list(db.orders.find({"company_id": company_id}))

        # Check if orders exist for the company
        if not orders:
            return jsonify({"message": "No orders found for this company!"}), 404

        # Process and serialize orders
        for order in orders:
            order['_id'] = str(order['_id'])  # Convert ObjectId to string
            order['user_id'] = str(order['user_id'])  # Convert user_id to string
            order['company_id'] = str(order['company_id']) if order['company_id'] else None  # Convert or set to None

            # Serialize products directly
            for product in order.get('products', []):  # Use .get() to avoid KeyError
                product['product_id'] = str(product['product_id'])  # Convert product_id to string
                # Additional product fields can be serialized if needed

            # Optionally serialize the user_address if needed
            if 'user_address' in order:
                order['user_address'] = {
                    "city": order['user_address'].get("city"),
                    "country": order['user_address'].get("country"),
                    "state": order['user_address'].get("state"),
                    "street": order['user_address'].get("street"),
                    "zip_code": order['user_address'].get("zip_code")
                }

        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    




