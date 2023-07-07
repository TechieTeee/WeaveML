import requests
from weavedb.sdk import WeaveDB

def get_lens_data():
    response = requests.get("https://api.lensprotocol.io/subgraphs/name/lensprotocol/data/collections/Profiles/")
    data = response.json()
    return data

def save_lens_data(data):
    db = weavedb.WeaveDB("v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA")
    db.create_collection("profiles")
    db.insert_data("profiles", data)

if name == "__main__":
    data = get_lens_data()
    save_lens_data(data)
