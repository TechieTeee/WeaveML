const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const tf = require('@tensorflow/tfjs');
  const fetch = require('isomorphic-fetch');
  require('isomorphic-fetch/fetch-npm-node');
  const cheerio = require('cheerio');
  
  const weavedb = {
    WeaveDB: function(contractTxId) {
      // Implementation for WeaveDB constructor
      // Needs further work
      this.contractTxId = contractTxId;
      this.data = {};
    },
    saveData: function(data) {
      // Implementation for saving data to WeaveDB
      // Overwrites the existing data with the new data
      this.data = data; 
      console.log('Data saved to WeaveDB:', data);
    },
    loadData: function() {
      // Implementation for loading data from WeaveDB
      console.log('Data loaded from WeaveDB:', this.data);
      return this.data;
    }
  };
  
  const requests = {
    get: async function(url) {
      // Implementation for making a GET request
      const response = await fetch(url);
      const content = await response.text();
      
      // Parse HTML content to JSON using cheerio
      const $ = cheerio.load(content);
      const jsonData = JSON.parse($('pre').text());
      
      return { content: jsonData };
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
  
    readline.question('Enter the API link (e.g., https://thegraph.com/hosted-service/subgraph/anudit/lens-protocol): ', async (GRAPH_API_URL) => {
      const db = new weavedb.WeaveDB(CONTRACT_TX_ID);
  
      const response = await requests.get(GRAPH_API_URL);

      const data = response.content;
      // Saves the retrieved data to WeaveDB
      db.saveData(data); 
  
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
  
      readline.close();
    });
  }
  
  main();
  