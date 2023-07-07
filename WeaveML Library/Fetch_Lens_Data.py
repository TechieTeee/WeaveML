import requests
import json
import flower
import weavedb_sdk

def get_lens_data():
    response = requests.get("https://api.thegraph.com/subgraphs/name/anudit/lens-protocol")
    data = response.json()
    return data

def train_model():
    model = flower.create_model()
    model.fit(get_lens_data())
    return model

def make_predictions():
    model = train_model()
    predictions = model.predict(get_lens_data())
    return predictions

def save_predictions():
    predictions = make_predictions()
    db = weavedb_sdk.WeaveDB('v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA')
    db.create_collection('predictions')
    db.insert_data('predictions', predictions)

if __name__ == "__main__":
    save_predictions()
