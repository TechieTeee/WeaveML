const tf = require('@tensorflow/tfjs');
const fetch = require('node-fetch');

const predict = async (data, model) => {
    return model.predict(data);
};

const saveModel = async (model) => {
    const modelData = await model.toJSON();
    // Save modelData using db.saveData()
};

const loadModel = async () => {
    const modelData = await db.loadData();
    const model = await tf.loadLayersModel(tf.io.fromJSON(modelData));
    return model;
};

async function main() {
    const db = weavedb.WeaveDB("v7xdnco4ygYpqCCCqGo7RYkRqoieEFxC-kS63UsfWXA");

    const url = "https://thegraph.com/hosted-service/subgraph/anudit/lens-protocol";
    const response = await fetch(url);
    const data = await response.json();

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
