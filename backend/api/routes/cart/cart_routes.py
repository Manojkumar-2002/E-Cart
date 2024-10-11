from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from api.config.config import config
from bson.objectid import ObjectId  

cart_routes = Blueprint('cart_routes', __name__)
client = MongoClient(config['MONGODB_URI'])
db = client.get_database()

@cart_routes.route('/<user_id>', methods=['GET'])
def get_cart(user_id):
    try:
        # Fetch the user's cart from the users collection
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"cart": 1})
        if not user or "cart" not in user:
            return jsonify({"error": "Cart not found for user!"}), 404

        # Extract the cart IDs from the user's cart
        cart_ids = [ObjectId(cart_item['cart_id']) for cart_item in user['cart']]
        
        # Fetch the cart items from the carts collection using cart IDs
        cart_items = list(db.carts.aggregate([
            {"$match": {"_id": {"$in": cart_ids}}},
            {"$lookup": {
                "from": "products",
                "localField": "product_id",
                "foreignField": "_id",
                "as": "product_details"
            }},
            {"$unwind": "$product_details"},
            {"$addFields": {
                "total_price": {
                    "$multiply": [
                        {"$toInt": "$quantity"},
                        {"$toInt": "$product_details.price"}
                    ]
                }
            }},
            {"$project": {
                "_id": 1,
                "product_id": 1,
                "user_id": 1,
                "company_id": 1,
                "quantity": 1,
                "product_details.product_name": 1,
                "product_details.price": 1,
                "total_price": 1
            }}
        ]))

        # Convert ObjectId fields to string for JSON response
        for item in cart_items:
            item['_id'] = str(item['_id'])
            item['product_id'] = str(item['product_id'])
            item['user_id'] = str(item['user_id'])
            item['company_id']=str(item['company_id'])

        return jsonify(cart_items), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_routes.route('/increase/<cart_item_id>', methods=['PUT'])
def increase_quantity(cart_item_id):
    try:
        result = db.carts.update_one(
            {"_id": ObjectId(cart_item_id)},
            {"$inc": {"quantity": 1}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Cart item not found!"}), 404
        return jsonify({"message": "Quantity increased successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_routes.route('/decrease/<cart_item_id>', methods=['PUT'])
def decrease_quantity(cart_item_id):
    try:
        cart_item = db.carts.find_one({"_id": ObjectId(cart_item_id)})
        if not cart_item or cart_item['quantity'] <= 1:
            return jsonify({"error": "Cannot decrease quantity below 1!"}), 400

        result = db.carts.update_one(
            {"_id": ObjectId(cart_item_id)},
            {"$inc": {"quantity": -1}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Cart item not found!"}), 404
        return jsonify({"message": "Quantity decreased successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_routes.route('/add', methods=['POST'])
def add_to_cart():
    try:
        data = request.json
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)
        product = db.products.find_one({"_id": ObjectId(product_id)})
        company_id = product.get('company_id')

        # Check if the product already exists in the cart for this user
        existing_cart_item = db.carts.find_one({
            "user_id": ObjectId(user_id),
            "product_id": ObjectId(product_id)
        })

        if existing_cart_item:
            # If the product exists, increase the quantity
            new_quantity = existing_cart_item.get('quantity', 1) + quantity
            db.carts.update_one(
                {"_id": existing_cart_item['_id']},
                {"$set": {"quantity": new_quantity}}
            )
            return jsonify({"message": "Product quantity updated!", "cart_item_id": str(existing_cart_item['_id']), "new_quantity": new_quantity}), 200
        else:
            # Create a new cart item if the product doesn't exist
            cart_item = {
                "user_id": ObjectId(user_id),
                "company_id": ObjectId(company_id),
                "product_id": ObjectId(product_id),
                "quantity": quantity
            }
            result = db.carts.insert_one(cart_item)

            # Update the user's cart with the new cart item id
            db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"cart": {"cart_id": str(result.inserted_id)}}}  # Adding to an array of cart items
            )

            return jsonify({"message": "Item added to cart successfully!", "cart_item_id": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_routes.route('/clear/<user_id>', methods=['DELETE'])
def clear_cart(user_id):
    try:
        # Delete all items in the user's cart
        result = db.carts.delete_many({"user_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "No items found in the cart!"}), 404
        # Optionally clear user's cart array
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"cart": []}}  # Clear the cart array from user
        )
        return jsonify({"message": f"Cleared {result.deleted_count} items from the cart!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@cart_routes.route('/delete/<cart_item_id>', methods=['DELETE'])
def remove_from_cart(cart_item_id):
    try:
        # Fetch the cart item to find out the user_id associated with it
        cart_item = db.carts.find_one({"_id": ObjectId(cart_item_id)})
        if not cart_item:
            return jsonify({"error": "Cart item not found!"}), 404

        user_id = cart_item['user_id']

        # Remove the cart item from the carts collection
        result = db.carts.delete_one({"_id": ObjectId(cart_item_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Failed to remove cart item!"}), 500

        # Remove the cart ID from the user's cart array
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"cart": {"cart_id": str(cart_item_id)}}}  # Remove cart_id from user's cart
        )

        return jsonify({"message": "Cart item removed successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500