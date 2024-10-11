from flask import Flask
from pymongo import MongoClient
from api.config.config import config
from api.routes.auth.register_routes import register_routes
from api.routes.auth.login_routes import login_routes 
from api.routes.products.product_routes import product_routes
from api.routes.orders.order_routes import order_routes
from api.routes.cart.cart_routes import cart_routes
from api.routes.auth.profile_routes import profile_routes
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = config['MONGODB_URI']
app.config['JWT_SECRET_KEY'] = config['JWT_SECRET']


try:
    client = MongoClient(app.config['MONGO_URI'])
    db = client.get_database() 
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    
    
# auth
app.register_blueprint(register_routes, url_prefix='/api/register') 
app.register_blueprint(login_routes, url_prefix='/api/login') 
app.register_blueprint(product_routes, url_prefix='/api/products') 
app.register_blueprint(order_routes, url_prefix='/api/orders')
app.register_blueprint(cart_routes, url_prefix='/api/cart')
app.register_blueprint(profile_routes, url_prefix='/api/profile')

if __name__ == '__main__':
    app.run(port=config['PORT'], debug=True)
