import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

// ML Graphs - Standalone Visualization Module
// Contains only the essential ML graph visualization functions

export class MLGraphs {
  
  // Visualize model architecture
  static async modelArchitecture(model: tf.LayersModel, title: string = 'Model Architecture') {
    const surface = { name: title, tab: 'Model' };
    await tfvis.show.modelSummary(surface, model);
    
    const architectureData = model.layers.map((layer, index) => ({
      x: index,
      y: layer.countParams()
    }));
    
    await tfvis.render.linechart(
      { name: `${title} - Parameters`, tab: 'Model' },
      { values: architectureData },
      { xLabel: 'Layer', yLabel: 'Parameters', height: 400, width: 800 }
    );
  }

  // Visualize training loss and accuracy
  static async trainingHistory(history: any, title: string = 'Training History') {
    const epochs = Array.from({ length: history.history.loss.length }, (_, i) => i);
    
    // Loss chart
    await tfvis.render.linechart(
      { name: `${title} - Loss`, tab: 'Training' },
      {
        values: [
          epochs.map((epoch, i) => ({ x: epoch, y: history.history.loss[i] })),
          epochs.map((epoch, i) => ({ x: epoch, y: history.history.val_loss[i] }))
        ],
        series: ['Training Loss', 'Validation Loss']
      },
      { xLabel: 'Epoch', yLabel: 'Loss', height: 300, width: 800 }
    );

    // Accuracy chart
    if (history.history.accuracy) {
      await tfvis.render.linechart(
        { name: `${title} - Accuracy`, tab: 'Training' },
        {
          values: [
            epochs.map((epoch, i) => ({ x: epoch, y: history.history.accuracy[i] })),
            epochs.map((epoch, i) => ({ x: epoch, y: history.history.val_accuracy[i] }))
          ],
          series: ['Training Accuracy', 'Validation Accuracy']
        },
        { xLabel: 'Epoch', yLabel: 'Accuracy', height: 300, width: 800 }
      );
    }
  }

  // Visualize data distribution
  static async dataDistribution(data: number[], title: string = 'Data Distribution') {
    await tfvis.render.histogram(
      { name: title, tab: 'Data' },
      data,
      { height: 400, width: 800 }
    );
  }

  // Visualize confusion matrix
  static async confusionMatrix(
    predictions: number[], 
    actual: number[], 
    labels: string[], 
    title: string = 'Confusion Matrix'
  ) {
    const numClasses = labels.length;
    const matrix: number[][] = Array(numClasses).fill(null).map(() => Array(numClasses).fill(0));
    
    for (let i = 0; i < predictions.length; i++) {
      matrix[actual[i]][predictions[i]]++;
    }
    
    await tfvis.render.heatmap(
      { name: title, tab: 'Evaluation' },
      { values: matrix },
      { height: 400, width: 600 }
    );
  }

  // Visualize feature importance
  static async featureImportance(
    _features: string[], 
    importance: number[], 
    title: string = 'Feature Importance'
  ) {
    await tfvis.render.barchart(
      { name: title, tab: 'Features' },
      importance.map((val, idx) => ({ index: idx, value: val })),
      { xLabel: 'Features', yLabel: 'Importance', height: 400, width: 800 }
    );
  }

  // Visualize prediction confidence
  static async predictionConfidence(
    predictions: number[], 
    _labels: string[], 
    title: string = 'Prediction Confidence'
  ) {
    await tfvis.render.barchart(
      { name: title, tab: 'Predictions' },
      predictions.map((val, idx) => ({ index: idx, value: val })),
      { xLabel: 'Classes', yLabel: 'Confidence', height: 300, width: 600 }
    );
  }

  // Visualize scatter plot
  static async scatterPlot(
    data: { x: number; y: number }[], 
    title: string = 'Scatter Plot'
  ) {
    await tfvis.render.scatterplot(
      { name: title, tab: 'Data' },
      { values: data },
      { xLabel: 'X', yLabel: 'Y', height: 400, width: 600 }
    );
  }

  // Visualize learning rate schedule
  static async learningRateSchedule(
    epochs: number[], 
    learningRates: number[], 
    title: string = 'Learning Rate Schedule'
  ) {
    const data = epochs.map((epoch, i) => ({ x: epoch, y: learningRates[i] }));
    
    await tfvis.render.linechart(
      { name: title, tab: 'Training' },
      { values: data },
      { xLabel: 'Epoch', yLabel: 'Learning Rate', height: 300, width: 800 }
    );
  }

  // Clear all visualizations
  static clear() {
    tfvis.visor().close();
  }

  // Toggle visor visibility
  static toggle() {
    const visor = tfvis.visor();
    visor.isOpen() ? visor.close() : visor.open();
  }
}

// Quick demo functions for testing
export const QuickDemo = {
  
  // Quick neural network demo
  async neuralNetwork() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [4], units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' })
      ]
    });
    
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
    
    await MLGraphs.modelArchitecture(model);
    
    // Dummy training history
    const epochs = 50;
    const history = {
      history: {
        loss: Array.from({ length: epochs }, (_, i) => Math.exp(-i * 0.1) + Math.random() * 0.1),
        val_loss: Array.from({ length: epochs }, (_, i) => Math.exp(-i * 0.08) + Math.random() * 0.15),
        accuracy: Array.from({ length: epochs }, (_, i) => 1 - Math.exp(-i * 0.15) + Math.random() * 0.05),
        val_accuracy: Array.from({ length: epochs }, (_, i) => 1 - Math.exp(-i * 0.12) + Math.random() * 0.08)
      }
    };
    
    await MLGraphs.trainingHistory(history);
    return model;
  },

  // Quick data distribution demo
  async dataDistribution() {
    const normalData = Array.from({ length: 1000 }, () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    });
    
    await MLGraphs.dataDistribution(normalData, 'Normal Distribution');
  },

  // Quick feature importance demo
  async featureImportance() {
    const features = ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'];
    const importance = [0.35, 0.25, 0.20, 0.15, 0.05];
    
    await MLGraphs.featureImportance(features, importance);
  }
};

export default MLGraphs;
