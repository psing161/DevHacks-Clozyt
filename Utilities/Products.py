import csv
import os

def read_products(csv_path='Datasets/alo_yoga_products.csv'):
    products = []
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            product = {
                'name': row.get('name'),
                'url': row.get('url'),
                # Add other fields as needed
                **{k: v for k, v in row.items() if k not in ['name', 'url']}
            }
            products.append(product)
    return products

def infer_category(name):
    name = name.lower()
    categories = [
        ("bra", ["bra"]),
        ("legging", ["legging", "tights"]),
        ("skirt", ["skirt"]),
        ("bomber", ["bomber", "jacket"]),
        ("hoodie", ["hoodie"]),
        ("pullover", ["pullover", "sweatshirt"]),
        ("shorts", ["shorts"]),
        ("tee", ["tee", "t-shirt", "shirt"]),
        ("vest", ["vest"]),
        ("trouser", ["trouser", "pant", "pants"]),
        ("swimsuit", ["swimsuit", "one-piece"]),
        ("bikini", ["bikini"]),
        ("dress", ["dress"]),
        ("suit", ["suit"]),
        ("jacket", ["jacket"]),
        ("sweatpant", ["sweatpant"]),
        ("coverup", ["coverup"]),
        ("pajama", ["pajama"]),
        ("top", ["top"]),
        ("tank", ["tank"]),
        ("crop", ["crop"]),
        ("outerwear", ["outerwear"]),
        ("activewear", ["activewear"]),
        ("sleepwear", ["sleepwear"]),
        ("lingerie", ["lingerie"]),
        ("sweater", ["sweater"]),
        ("coat", ["coat"]),
        ("blazer", ["blazer"]),
        ("jeans", ["jeans"]),
        ("denim", ["denim"]),
        ("romper", ["romper"]),
        ("jumpsuit", ["jumpsuit"]),
        ("cardigan", ["cardigan"]),
        ("windbreaker", ["windbreaker"]),
        ("puffer", ["puffer"]),
    ]
    for cat, keywords in categories:
        for kw in keywords:
            if kw in name:
                return cat
    return "other"

def read_all_products_by_category(datasets_dir="../Datasets"):
    category_dict = {}
    for fname in os.listdir(datasets_dir):
        if fname.endswith(".csv") and "products" in fname or "princess_polly" in fname:
            path = os.path.join(datasets_dir, fname)
            with open(path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    name = row.get("name") or row.get("product_name")
                    if not name:
                        continue
                    category = infer_category(name)
                    product = dict(row)
                    product["source_file"] = fname
                    if category not in category_dict:
                        category_dict[category] = []
                    category_dict[category].append(product)
    return category_dict
