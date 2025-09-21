import csv

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
