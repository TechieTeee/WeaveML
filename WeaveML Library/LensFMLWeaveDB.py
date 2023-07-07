import weavedb
import requests
import json
import flowers
import xgboost

def predict(data):
    model = flowers.load("<path-to-machine-learning-model>")
    xgboost_model = xgboost.Booster()
    xgboost_model.load_model(model_data)
    return xgboost_model.predict(data)

def save_model(model):
    model_data = flowers_fml.serialize_model(model)
    xgboost_model = xgboost.Booster()
    xgboost_model.load_model(model_data)
    db.save_data(xgboost_model)

def load_model():
    xgboost_model = db.load_data()
    return flowers_fml.deserialize_model(xgboost_model)

if name == "__main__":
    db = weavedb.WeaveDB("v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA")

    url = "https://api.thegraph.com/subgraphs/name/lensprotocol/lens"
    response = requests.get(url)
    data = json.loads(response.content)

    db.insert(data)

    model = xgboost.Booster()
    model.fit(data["features"], data["target"])
    save_model(model)
    model = load_model()
    predictions = []
    for record in data:
        predictions.append(predict(record))

    print(predictions)

if name == "__main__":
    db = LensFMLWeaveDB()
    data = db.get_lens_data()
    model = flowers_fml.create_model(data)
    db.save_model(model)
    model = db.load_model()
    print(model)
