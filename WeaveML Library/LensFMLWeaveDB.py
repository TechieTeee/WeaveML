import json
import requests
import weavedb
import flowers_fml
import xgboost

class LensFMLWeaveDB(weavedb.WeaveDB):

    def save_model(self, model):
        model_data = flowers_fml.serialize_model(model)
        xgboost_model = xgboost.Booster()
        xgboost_model.load_model(model_data)
        self.save_data(xgboost_model)

    def load_model(self):
        xgboost_model = self.load_data()
        return flowers_fml.deserialize_model(xgboost_model)

    def get_lens_data(self):
        url = "https://api.thegraph.com/subgraphs/name/lensprotocol/lens"
        response = requests.get(url)
        data = json.loads(response.content)
        return data

if name == "__main__":
    db = LensFMLWeaveDB()
    data = db.get_lens_data()
    model = flowers_fml.create_model(data)
    db.save_model(model)
    model = db.load_model()
    print(model)
