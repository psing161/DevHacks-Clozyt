from flask import Flask, request, jsonify
import pandas as pd
import os

from Models.user_feedback import add_liked_product
from Models.image_based_recommendation import recommend_from_image
from Models.nlp_recommender import NLPRecommender

from Utilities.Products import read_products
app = Flask(__name__)



@app.route('/user_action', methods=['POST'])
def user_action():
    data = request.get_json()
    user_id = int(data['user_id'])
    product_id = int(data['product_id'])
    product_description = data.get('product_description', f"Product {product_id}")
    action = data.get('action', 'like')
    image_url = data.get('image_url', '')
    from Utilities.User import User
    user = User(id=user_id, username="user" + str(user_id), email=None)
    if action == 'like':
        user.update_likes(product_id, product_description)
        # Also update in user feedback
    else:
        user.update_dislikes(product_id, product_description)
        # Also update in user feedback

    if image_url:
        # If an image URL is provided, get image-based recommendations
        img_recs = recommend_from_image(image_url, top_k=5)
        nlp_recommender = NLPRecommender()
        nlp_recs = nlp_recommender.nlp_recommend(product_description, top_k=5, user_id=user_id)
        return jsonify({'status': 'success', 'image_recommendations': img_recs[1:]+nlp_recs})

    return jsonify({'status': 'success'})

@app.route('/allProducts', methods=['GET'])
def products():
    res = read_products()
    return jsonify(res)


if __name__ == '__main__':
    app.run(debug=True)

