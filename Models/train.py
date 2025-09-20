import pandas as pd
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vggl16  import VGG16, preprocess_input
from tensorflow.keras.models import Model
import numpy as np
base_model =  VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model = Model(inputs=base_model.input, outputs=base_model.output)

import requests
from PIL import Image
from io import BytesIO


def preprocess_image(img_url):
    response = requests.get(img_url)
    response.raise_for_status()  # Raise an exception for bad status codes

    # Open the image from the in-memory bytes
    img = Image.open(BytesIO(response.content))
    # img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array


def extract_features(model, preprocessed_img):
    features = model.predict(preprocessed_img)
    flattened_features = features.flatten()
    normalized_features = flattened_features / np.linalg.norm(flattened_features)
    return normalized_features

def train_all_images(file_path):
    all_features =[]
    all_image_urls =[]

    df = pd.read_csv('../../Dataset/alo_yoga_products.csv')
    for row in df.itertuples():
        preprocess_img = preprocess_image(row['image_url']) # Print first 5 features as a sample
        features = extract_features(model, preprocess_img)
        all_features.append(features)
        all_image_urls.append(row['image_url'])





