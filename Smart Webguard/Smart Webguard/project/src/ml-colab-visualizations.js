// Complete ML Visualization Suite for Google Colab - JavaScript Version
// All graph types in one file for Colab compatibility

// Load TensorFlow.js and Vis in Colab
// import * as tf from '@tensorflow/tfjs';
// import * as tfvis from '@tensorflow/tfjs-vis';

class MLVisualizationSuite {

  // ==================== BAR CHARTS ====================
  
  static async barChart(data, title = 'Bar Chart') {
    const chartData = data.map((item, index) => ({ index, value: item.value }));
    
    await tfvis.render.barchart(
      { name: title, tab: 'Charts' },
      chartData,
      { 
        xLabel: 'Categories', 
        yLabel: 'Values', 
        height: 400, 
        width: 800 
      }
    );
  }

  // ==================== PIE CHARTS ====================
  
  static async pieChart(data, title = 'Pie Chart') {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    const pieData = data.map((item) => {
      const percentage = item.value / total;
      const angle = currentAngle + percentage * Math.PI * 2;
      const x = Math.cos(angle) * 5;
      const y = Math.sin(angle) * 5;
      currentAngle = angle;
      
      return { x, y, label: item.label, value: item.value };
    });

    await tfvis.render.scatterplot(
      { name: title, tab: 'Charts' },
      { values: pieData },
      { 
        xLabel: '', 
        yLabel: '', 
        height: 400, 
        width: 600 
      }
    );
  }

  // ==================== SCATTER PLOTS ====================
  
  static async scatterPlot(data, title = 'Scatter Plot') {
    await tfvis.render.scatterplot(
      { name: title, tab: 'Charts' },
      { values: data },
      { 
        xLabel: 'X Axis', 
        yLabel: 'Y Axis', 
        height: 400, 
        width: 600 
      }
    );
  }

  // ==================== LINE CHARTS ====================
  
  static async lineChart(data, title = 'Line Chart') {
    await tfvis.render.linechart(
      { name: title, tab: 'Charts' },
      { values: data },
      { 
        xLabel: 'X Axis', 
        yLabel: 'Y Axis', 
        height: 400, 
        width: 800 
      }
    );
  }

  static async multiLineChart(series, title = 'Multi-Line Chart') {
    const values = series.map(s => s.data);
    const seriesNames = series.map(s => s.name);

    await tfvis.render.linechart(
      { name: title, tab: 'Charts' },
      { values, series: seriesNames },
      { 
        xLabel: 'X Axis', 
        yLabel: 'Y Axis', 
        height: 400, 
        width: 800 
      }
    );
  }

  // ==================== HISTOGRAMS ====================
  
  static async histogram(data, title = 'Histogram') {
    await tfvis.render.histogram(
      { name: title, tab: 'Charts' },
      data,
      { 
        height: 400, 
        width: 800 
      }
    );
  }

  // ==================== HEATMAPS ====================
  
  static async heatmap(data, title = 'Heatmap') {
    await tfvis.render.heatmap(
      { name: title, tab: 'Charts' },
      { values: data },
      { 
        height: 400, 
        width: 600 
      }
    );
  }

  // ==================== ML SPECIFIC CHARTS ====================
  
  static async confusionMatrix(predictions, actual, labels, title = 'Confusion Matrix') {
    const numClasses = labels.length;
    const matrix = Array(numClasses).fill(null).map(() => Array(numClasses).fill(0));
    
    for (let i = 0; i < predictions.length; i++) {
      matrix[actual[i]][predictions[i]]++;
    }
    
    await tfvis.render.heatmap(
      { name: title, tab: 'ML Charts' },
      { values: matrix },
      { 
        height: 400, 
        width: 600 
      }
    );
  }

  static async rocCurve(tpr, fpr, title = 'ROC Curve') {
    const rocData = tpr.map((value, index) => ({ x: fpr[index], y: value }));
    
    await tfvis.render.linechart(
      { name: title, tab: 'ML Charts' },
      { values: rocData },
      { 
        xLabel: 'False Positive Rate', 
        yLabel: 'True Positive Rate', 
        height: 400, 
        width: 600 
      }
    );
  }

  static async featureImportance(features, importance, title = 'Feature Importance') {
    const chartData = importance.map((value, index) => ({ index, value }));
    
    await tfvis.render.barchart(
      { name: title, tab: 'ML Charts' },
      chartData,
      { 
        xLabel: 'Features', 
        yLabel: 'Importance', 
        height: 400, 
        width: 800 
      }
    );
  }

  // ==================== UTILITY FUNCTIONS ====================
  
  static clearAll() {
    tfvis.visor().close();
  }

  static toggleVisor() {
    const visor = tfvis.visor();
    visor.isOpen() ? visor.close() : visor.open();
  }

  // ==================== DEMO FUNCTION - ALL CHARTS ====================
  
  static async demonstrateAllCharts() {
    console.log('🎨 Generating all visualization types...');

    await this.barChart([
      { label: 'A', value: 10 },
      { label: 'B', value: 25 },
      { label: 'C', value: 15 }
    ], 'Sample Bar Chart');

    await this.pieChart([
      { label: 'Segment 1', value: 30 },
      { label: 'Segment 2', value: 45 },
      { label: 'Segment 3', value: 25 }
    ], 'Sample Pie Chart');

    await this.scatterPlot(
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100
      })),
      'Random Scatter Plot'
    );

    await this.lineChart(
      Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: Math.sin(i * 0.5) * 10 + 50
      })),
      'Sine Wave Line Chart'
    );

    await this.histogram(
      Array.from({ length: 1000 }, () => 
        (Math.random() - 0.5) * 10 + 50
      ),
      'Normal Distribution'
    );

    const heatmapData = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => Math.random() * 100)
    );
    await this.heatmap(heatmapData, 'Random Heatmap');

    const predictions = Array.from({ length: 100 }, () => Math.floor(Math.random() * 3));
    const actual = Array.from({ length: 100 }, () => Math.floor(Math.random() * 3));
    await this.confusionMatrix(predictions, actual, ['A', 'B', 'C'], 'Demo Confusion Matrix');

    console.log('✅ All visualizations generated! Check the visor tabs.');
  }
}

// For Google Colab usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MLVisualizationSuite;
}

// For browser usage
if (typeof window !== 'undefined') {
  window.MLVisualizationSuite = MLVisualizationSuite;
}
