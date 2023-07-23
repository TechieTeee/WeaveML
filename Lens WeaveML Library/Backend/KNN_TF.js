const knnClassifier = require("@tensorflow-models/knn-classifier");
const tf = require("@tensorflow/tfjs");
const fs = require("fs");
const Papa = require("papaparse");

// Load the Iris dataset
async function loadIrisDataset() {
  try {
    const csvData = fs.readFileSync("./iris.csv", "utf-8");
    const { data, meta } = Papa.parse(csvData, { header: true });
    const features = data.map((row) => [parseFloat(row.sepal_length), parseFloat(row.sepal_width), parseFloat(row.petal_length), parseFloat(row.petal_width)]);
    const labels = data.map((row) => row.species);
    return { features, labels };
  } catch (err) {
    console.error("Error loading the Iris dataset:", err);
    return null;
  }
}

async function run() {
  // Load the dataset
  const dataset = await loadIrisDataset();
  if (!dataset) return;

  // Create a KNN classifier
  const classifier = knnClassifier.create();

  // Add training examples to the classifier
  for (let i = 0; i < dataset.features.length; i++) {
    const exampleFeatures = tf.tensor1d(dataset.features[i]);
    const exampleLabel = dataset.labels[i];
    console.log("Adding example:", exampleFeatures.arraySync(), exampleLabel);
    classifier.addExample(exampleFeatures, exampleLabel);
  }

  // Make a prediction
  const inputFeatures = tf.tensor1d([5.1, 3.5, 1.4, 0.2]);
  console.log("Input features:", inputFeatures.arraySync());
  const prediction = await classifier.predictClass(inputFeatures);

  console.log(prediction);
}

run();