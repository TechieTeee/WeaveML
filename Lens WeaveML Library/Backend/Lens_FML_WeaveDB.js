const tf = require('@tensorflow/tfjs');
const fetch = require('isomorphic-fetch');
require('isomorphic-fetch/fetch-npm-node');

const weavedb = {
  WeaveDB: function(contractTxId) {
    // Implementation for WeaveDB constructor
    this.contractTxId = contractTxId;
  },
  saveData: function(data) {
    // Implementation for saving data to WeaveDB
    // Da will be saved to WeaveDB, once in right format
    console.log('Saving data:', data);
  },
  loadData: function() {
    // Implementation for loading data from WeaveDB
    const data = {};
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
  const CONTRACT_TX_ID = 'v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA';
  const GRAPH_API_URL = 'https://thegraph.com/hosted-service/subgraph/anudit/lens-protocol';

  const db = new weavedb.WeaveDB(CONTRACT_TX_ID);

  const response = await requests.get(GRAPH_API_URL);
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