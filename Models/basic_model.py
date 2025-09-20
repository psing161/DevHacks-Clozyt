import numpy as np
from collections import defaultdict
from typing import List, Dict, Any

class ProductStore:
    def __init__(self, products: List[Dict[str, Any]]):
        self.products = products
        self.product_vectors = {}
        for prod in products:
            self.product_vectors[prod['id']] = self._vectorize(prod)

    def _vectorize(self, product: Dict[str, Any]) -> np.ndarray:
        # Simple vectorization: category + color + brand as one-hot, price as float
        # Extend as needed for your use case
        vec = []
        vec.append(hash(product.get('category', '')) % 1000)
        vec.append(hash(product.get('color', '')) % 1000)
        vec.append(hash(product.get('brand', '')) % 1000)
        # Parse price robustly
        price_raw = product.get('price', 0)
        price = 0.0
        if isinstance(price_raw, str):
            try:
                price = float(price_raw.replace('$', '').replace(',', '').strip())
            except Exception:
                price = 0.0
        else:
            try:
                price = float(price_raw)
            except Exception:
                price = 0.0
        vec.append(price)
        return np.array(vec, dtype=np.float32)

    def get_vector(self, product_id: int) -> np.ndarray:
        return self.product_vectors.get(product_id)

    def get_product(self, product_id: int) -> Dict[str, Any]:
        for prod in self.products:
            if prod['id'] == product_id:
                return prod
        return {}

    def all_product_ids(self) -> List[int]:
        return [prod['id'] for prod in self.products]

class UserStore:
    def __init__(self):
        self.user_actions = defaultdict(list)  # user_id -> list of (product_id, action)

    def add_action(self, user_id: int, product_id: int, action: str):
        self.user_actions[user_id].append((product_id, action))

    def get_actions(self, user_id: int):
        return self.user_actions[user_id]

class Recommender:
    def __init__(self, product_store: ProductStore, user_store: UserStore):
        self.product_store = product_store
        self.user_store = user_store

    def update_user(self, user_id: int, product_id: int, action: str):
        self.user_store.add_action(user_id, product_id, action)

    def recommend(self, user_id: int, top_k: int = 5) -> List[Dict[str, Any]]:
        actions = self.user_store.get_actions(user_id)
        if not actions:
            # Return random products if no history
            ids = self.product_store.all_product_ids()[:top_k]
            return [self.product_store.get_product(pid) for pid in ids]
        # Compute user preference vector (average of liked, minus disliked)
        liked = [pid for pid, act in actions if act == 'like']
        disliked = [pid for pid, act in actions if act == 'dislike']
        if not liked:
            liked = [pid for pid, _ in actions]  # fallback: all actions
        user_vec = np.mean([self.product_store.get_vector(pid) for pid in liked], axis=0)
        if disliked:
            user_vec -= np.mean([self.product_store.get_vector(pid) for pid in disliked], axis=0)
        # Score all products
        scores = []
        for pid in self.product_store.all_product_ids():
            prod_vec = self.product_store.get_vector(pid)
            sim = self._cosine_similarity(user_vec, prod_vec)
            scores.append((sim, pid))
        scores.sort(reverse=True)
        recommended = [self.product_store.get_product(pid) for _, pid in scores if pid not in liked][:top_k]
        return recommended

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
            return 0.0
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
