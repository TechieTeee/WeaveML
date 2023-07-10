const tf = require('@tensorflow/tfjs');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

const weavedb = {
  WeaveDB: function(apiKey) {
    // For WeaveDB constructor
    this.apiKey = apiKey;
  },
  saveData: function(data) {
    // For saving data to WeaveDB
    console.log('Saving data:', data);
  },
  loadData: function() {
    // For loading data from WeaveDB
    const data = {}; // Example data retrieved from storage
    console.log('Loading data:', data);
    return data;
  }
};

const requests = {
  get: async function(url) {
    // Implementation for making a GET request
    const response = await fetch(url);
    const content = await response.text();
    return { content };
  }
};

const predict = async (data, model) => {
  return model.predict(data);
};

const saveModel = async (model) => {
  const modelData = await model.toJSON();
  // Save modelData using db.saveData()
  db.saveData(modelData);
};

const loadModel = async () => {
  const modelData = await db.loadData();
  const model = await tf.loadLayersModel(tf.io.fromJSON(modelData));
  return model;
};

async function main() {
  dotenv.config(); // Load environment variables from .env file

  const db = new weavedb.WeaveDB(process.env.API_KEY);
  const url = process.env.GRAPH_API_URL;

  const response = await requests.get(url);
  const data = JSON.parse(response.content);

  db.insert(data);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [data["features"].length] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  const xs = tf.tensor(data["features"]);
  const ys = tf.tensor(data["target"]);
  await model.fit(xs, ys, { epochs: 10 });
  await saveModel(model);

  const loadedModel = await loadModel();
  const predictions = [];
  for (const record of data) {
    const input = tf.tensor(record);
    const prediction = await predict(input, loadedModel);
    predictions.push(prediction);
  }

  console.log(predictions);
}

main();