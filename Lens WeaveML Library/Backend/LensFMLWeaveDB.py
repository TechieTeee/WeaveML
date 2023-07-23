const tf = require("tensorflow/tfjs-node");
const requests = require("requests");
const json = require("json");

function predict(data) {
  const model = tf.keras.models.loadModel("path-to-machine-learning-model");
  return model.predict(data);
}

function saveModel(model) {
  const modelData = model.toJSON();
  return modelData;
}

function loadModel(modelData) {
  return tf.keras.models.modelFromJSON(modelData);
}

const name = "__main__";

if (name === "__main__") {
  const db = weavedb.WeaveDB("v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA");

  const url = "https://api.thegraph.com/subgraphs/name/lensprotocol/lens";
  const response = requests.get(url);
  const data = json.parse(response.content);

  db.insert(data);

  const inputLayer = tf.keras.layers.Input({ shape: [None, data["features"][0].length] });
  const hiddenLayer = tf.keras.layers.Dense(10, { activation: "relu" })(inputLayer);
  const outputLayer = tf.keras.layers.Dense(1, { activation: "linear" })(hiddenLayer);

  const model = tf.keras.models.Model(inputLayer, outputLayer);

  model.compile(loss="meanSquaredError", optimizer="adam", batch_size=128);
  model.fit(data["features"], data["target"], { epochs: 100 });
  saveModel(model);
  model = loadModel(model.toJSON());

  const predictions = [];
  for (const record of data["features"]) {
    predictions.push(predict(record));
  }

  console.log(predictions);
}
