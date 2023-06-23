import weavedb
import flowers_fml

class FlowersFMLWeaveDB(weavedb.WeaveDB):

    def save_model(self, model):
        model_data = flowers_fml.serialize_model(model)
        self.save_data(model_data)

    def load_model(self):
        model_data = self.load_data()
        return flowers_fml.deserialize_model(model_data)

if __name__ == "__main__":
    db = FlowersFMLWeaveDB()
    db.save_model(flowers_fml.create_model())
    model = db.load_model()
    print(model)