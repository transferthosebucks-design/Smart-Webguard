import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';

/**
 * MLVisualizer: A dedicated ML file to manage graphs and visual representations 
 * of the underlying TensorFlow model's training process and architecture.
 */
export class MLVisualizer {
  private static visorInstance: ReturnType<typeof tfvis.visor> | null = null;

  /**
   * Initializes the visor container.
   */
  public static async initVisualizations() {
    this.visorInstance = tfvis.visor();
    this.visorInstance.open();
  }

  /**
   * Generates a structural graph of the model's neural network layers.
   */
  public static async showModelArchitecture(model: tf.LayersModel, name: string = 'Threat Detection Model') {
    if (!this.visorInstance) return;
    const surface = { name: name, tab: 'Model Overview' };
    await tfvis.show.modelSummary(surface, model);
  }

  /**
   * Generates custom visual graphs for training loss and accuracy metrics.
   * Returns a list of callbacks that can be attached directly to the model's fit() method.
   */
  public static getTrainingCallbacks() {
    return tfvis.show.fitCallbacks(
      { name: 'Training Progress', tab: 'Training Performance' },
      ['loss', 'val_loss', 'acc', 'val_acc'],
      { callbacks: ['onEpochEnd', 'onBatchEnd'] }
    );
  }

  /**
   * Triggers a visual representation of layer activations (optional advanced graph feature)
   */
  public static async showLayerStats(model: tf.LayersModel) {
    if (!this.visorInstance) return;
    const surface = { name: 'Layer Statistics', tab: 'Advanced Metrics' };
    await tfvis.show.layer(surface, model.layers[0]);
  }

  /**
   * Closes the graphical visor.
   */
  public static closeVisualizations() {
    if (this.visorInstance) {
      this.visorInstance.close();
    }
  }
}
