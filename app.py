from flask import Flask, request, jsonify
import pandas as pd
import os
from Models.basic_model import ProductStore, UserStore, Recommender

app = Flask(__name__)

# --- Load product data from all CSVs in Datasets/ ---
def load_all_products():
    dataset_dir = os.path.join(os.path.dirname(__file__), 'Datasets')
    products = []
    for fname in os.listdir(dataset_dir):
        if fname.endswith('.csv'):
            df = pd.read_csv(os.path.join(dataset_dir, fname))
            # Ensure each product has a unique id
            for i, row in df.iterrows():
                prod = row.to_dict()
                prod['id'] = hash(f"{fname}_{i}") % (10**8)
                products.append(prod)
    return products

products = load_all_products()
product_store = ProductStore(products)
user_store = UserStore()
recommender = Recommender(product_store, user_store)

@app.route('/user_action', methods=['POST'])
def user_action():
    data = request.get_json()
    user_id = int(data['user_id'])
    product_id = int(data['product_id'])
    action = data.get('action', 'like')
    recommender.update_user(user_id, product_id, action)
    return jsonify({'status': 'success'})

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = int(request.args.get('user_id'))
    top_k = int(request.args.get('top_k', 5))
    recs = recommender.recommend(user_id, top_k)
    return jsonify({'recommendations': recs})

if __name__ == '__main__':
    app.run(debug=True)

