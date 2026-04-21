# Complete ML Visualization Suite for Google Colab - Python Version
# All graph types in one file: bar, pie, scatter, line, histogram, heatmap, etc.

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
from sklearn.metrics import confusion_matrix, roc_curve, precision_recall_curve
from typing import List, Dict, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

# Set style for better looking plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class MLVisualizationSuite:
    
    # ==================== BAR CHARTS ====================
    
    @staticmethod
    def bar_chart(data: List[Dict[str, Any]], title: str = 'Bar Chart', 
                  x_label: str = 'Categories', y_label: str = 'Values'):
        """Create a bar chart"""
        labels = [item['label'] for item in data]
        values = [item['value'] for item in data]
        
        fig, ax = plt.subplots(figsize=(12, 6))
        bars = ax.bar(labels, values, color=sns.color_palette("husl", len(data)))
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + max(values)*0.01,
                   f'{value:.1f}', ha='center', va='bottom')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel(x_label, fontsize=12)
        ax.set_ylabel(y_label, fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def horizontal_bar_chart(data: List[Dict[str, Any]], title: str = 'Horizontal Bar Chart'):
        """Create a horizontal bar chart"""
        labels = [item['label'] for item in data]
        values = [item['value'] for item in data]
        
        fig, ax = plt.subplots(figsize=(10, 6))
        bars = ax.barh(labels, values, color=sns.color_palette("husl", len(data)))
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            width = bar.get_width()
            ax.text(width + max(values)*0.01, bar.get_y() + bar.get_height()/2.,
                   f'{value:.1f}', ha='left', va='center')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Values', fontsize=12)
        ax.set_ylabel('Categories', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def grouped_bar_chart(categories: List[str], series: List[Dict[str, Any]], 
                         title: str = 'Grouped Bar Chart'):
        """Create a grouped bar chart"""
        x = np.arange(len(categories))
        width = 0.8 / len(series)
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        for i, serie in enumerate(series):
            offset = (i - len(series)/2 + 0.5) * width
            ax.bar(x + offset, serie['data'], width, label=serie['name'],
                  color=sns.color_palette("husl", len(series))[i])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Categories', fontsize=12)
        ax.set_ylabel('Values', fontsize=12)
        ax.set_xticks(x)
        ax.set_xticklabels(categories)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    # ==================== PIE CHARTS ====================
    
    @staticmethod
    def pie_chart(data: List[Dict[str, Any]], title: str = 'Pie Chart'):
        """Create a pie chart"""
        labels = [item['label'] for item in data]
        values = [item['value'] for item in data]
        
        fig, ax = plt.subplots(figsize=(10, 8))
        wedges, texts, autotexts = ax.pie(values, labels=labels, autopct='%1.1f%%',
                                         colors=sns.color_palette("husl", len(data)),
                                         startangle=90, textprops={'fontsize': 10})
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def donut_chart(data: List[Dict[str, Any]], title: str = 'Donut Chart'):
        """Create a donut chart"""
        labels = [item['label'] for item in data]
        values = [item['value'] for item in data]
        
        fig, ax = plt.subplots(figsize=(10, 8))
        wedges, texts, autotexts = ax.pie(values, labels=labels, autopct='%1.1f%%',
                                         colors=sns.color_palette("husl", len(data)),
                                         startangle=90, textprops={'fontsize': 10},
                                         wedgeprops=dict(width=0.4))
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    # ==================== SCATTER PLOTS ====================
    
    @staticmethod
    def scatter_plot(data: List[Dict[str, float]], title: str = 'Scatter Plot',
                    x_label: str = 'X Axis', y_label: str = 'Y Axis'):
        """Create a scatter plot"""
        x_values = [item['x'] for item in data]
        y_values = [item['y'] for item in data]
        
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.scatter(x_values, y_values, alpha=0.7, s=50, 
                  color=sns.color_palette("husl")[0])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel(x_label, fontsize=12)
        ax.set_ylabel(y_label, fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def bubble_chart(data: List[Dict[str, float]], title: str = 'Bubble Chart'):
        """Create a bubble chart"""
        x_values = [item['x'] for item in data]
        y_values = [item['y'] for item in data]
        sizes = [item['size'] * 10 for item in data]  # Scale for visibility
        
        fig, ax = plt.subplots(figsize=(10, 6))
        scatter = ax.scatter(x_values, y_values, s=sizes, alpha=0.6,
                            c=sizes, cmap='viridis')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('X Axis', fontsize=12)
        ax.set_ylabel('Y Axis', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.colorbar(scatter, label='Size')
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def scatter_plot_3d(data: List[Dict[str, float]], title: str = '3D Scatter Plot'):
        """Create a 3D scatter plot using plotly"""
        fig = go.Figure(data=[go.Scatter3d(
            x=[item['x'] for item in data],
            y=[item['y'] for item in data],
            z=[item['z'] for item in data],
            mode='markers',
            marker=dict(
                size=5,
                color=[i for i in range(len(data))],
                colorscale='Viridis',
                opacity=0.8
            )
        )])
        
        fig.update_layout(title=title, scene=dict(
            xaxis_title='X Axis',
            yaxis_title='Y Axis',
            zaxis_title='Z Axis'
        ))
        fig.show()
    
    # ==================== LINE CHARTS ====================
    
    @staticmethod
    def line_chart(data: List[Dict[str, float]], title: str = 'Line Chart',
                  x_label: str = 'X Axis', y_label: str = 'Y Axis'):
        """Create a line chart"""
        x_values = [item['x'] for item in data]
        y_values = [item['y'] for item in data]
        
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.plot(x_values, y_values, linewidth=2, color=sns.color_palette("husl")[0])
        ax.scatter(x_values, y_values, s=50, color=sns.color_palette("husl")[0])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel(x_label, fontsize=12)
        ax.set_ylabel(y_label, fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def multi_line_chart(series: List[Dict[str, Any]], title: str = 'Multi-Line Chart'):
        """Create a multi-line chart"""
        fig, ax = plt.subplots(figsize=(12, 6))
        
        for i, serie in enumerate(series):
            x_values = [point['x'] for point in serie['data']]
            y_values = [point['y'] for point in serie['data']]
            ax.plot(x_values, y_values, linewidth=2, label=serie['name'],
                   color=sns.color_palette("husl", len(series))[i])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('X Axis', fontsize=12)
        ax.set_ylabel('Y Axis', fontsize=12)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def area_chart(data: List[Dict[str, float]], title: str = 'Area Chart'):
        """Create an area chart"""
        x_values = [item['x'] for item in data]
        y_values = [item['y'] for item in data]
        
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.fill_between(x_values, y_values, alpha=0.4, 
                       color=sns.color_palette("husl")[0])
        ax.plot(x_values, y_values, linewidth=2, color=sns.color_palette("husl")[0])
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('X Axis', fontsize=12)
        ax.set_ylabel('Y Axis', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    # ==================== HISTOGRAMS ====================
    
    @staticmethod
    def histogram(data: List[float], title: str = 'Histogram', bins: int = 20):
        """Create a histogram"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.hist(data, bins=bins, alpha=0.7, color=sns.color_palette("husl")[0],
               edgecolor='black')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Values', fontsize=12)
        ax.set_ylabel('Frequency', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def distribution_histogram(data: List[float], title: str = 'Distribution Histogram'):
        """Create a distribution histogram with KDE"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.hist(data, bins=30, alpha=0.7, density=True, 
               color=sns.color_palette("husl")[0], edgecolor='black')
        
        # Add KDE curve
        sns.kdeplot(data=data, ax=ax, color=sns.color_palette("husl")[1], linewidth=2)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Values', fontsize=12)
        ax.set_ylabel('Density', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    # ==================== HEATMAPS ====================
    
    @staticmethod
    def heatmap(data: List[List[float]], title: str = 'Heatmap',
                x_labels: List[str] = None, y_labels: List[str] = None):
        """Create a heatmap"""
        fig, ax = plt.subplots(figsize=(10, 8))
        
        sns.heatmap(data, annot=True, fmt='.2f', cmap='viridis', ax=ax,
                   xticklabels=x_labels, yticklabels=y_labels)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def correlation_heatmap(data: np.ndarray, feature_names: List[str], 
                           title: str = 'Correlation Heatmap'):
        """Create a correlation heatmap"""
        fig, ax = plt.subplots(figsize=(10, 8))
        
        # Calculate correlation matrix
        if len(data.shape) == 2:
            corr_matrix = np.corrcoef(data.T)
        else:
            corr_matrix = data
        
        sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', center=0,
                   xticklabels=feature_names, yticklabels=feature_names, ax=ax)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    # ==================== SPECIALIZED CHARTS ====================
    
    @staticmethod
    def box_plot(data: List[List[float]], title: str = 'Box Plot',
                 labels: List[str] = None):
        """Create a box plot"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        box_plot = ax.boxplot(data, patch_artist=True, labels=labels)
        
        # Color the boxes
        colors = sns.color_palette("husl", len(data))
        for patch, color in zip(box_plot['boxes'], colors):
            patch.set_facecolor(color)
            patch.set_alpha(0.7)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Groups', fontsize=12)
        ax.set_ylabel('Values', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def violin_plot(data: List[List[float]], title: str = 'Violin Plot',
                   labels: List[str] = None):
        """Create a violin plot"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        violin_parts = ax.violinplot(data, positions=range(1, len(data)+1))
        
        # Color the violins
        colors = sns.color_palette("husl", len(data))
        for i, pc in enumerate(violin_parts['bodies']):
            pc.set_facecolor(colors[i])
            pc.set_alpha(0.7)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Groups', fontsize=12)
        ax.set_ylabel('Values', fontsize=12)
        ax.set_xticks(range(1, len(data)+1))
        if labels:
            ax.set_xticklabels(labels)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def radar_chart(data: List[Dict[str, Any]], title: str = 'Radar Chart'):
        """Create a radar chart using plotly"""
        features = [item['feature'] for item in data]
        values = [item['value'] for item in data]
        
        # Close the circle
        features.append(features[0])
        values.append(values[0])
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatterpolar(
            r=values,
            theta=features,
            fill='toself',
            name='Values'
        ))
        
        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, max(values)]
                )),
            showlegend=True,
            title=title
        )
        fig.show()
    
    @staticmethod
    def gauge_chart(value: float, max_value: float, title: str = 'Gauge Chart'):
        """Create a gauge chart using plotly"""
        fig = go.Figure(go.Indicator(
            mode = "gauge+number+delta",
            value = value,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': title},
            delta = {'reference': max_value * 0.8},
            gauge = {
                'axis': {'range': [None, max_value]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, max_value * 0.25], 'color': "lightgray"},
                    {'range': [max_value * 0.25, max_value * 0.5], 'color': "gray"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': max_value * 0.9
                }
            }
        ))
        
        fig.show()
    
    @staticmethod
    def funnel_chart(data: List[Dict[str, Any]], title: str = 'Funnel Chart'):
        """Create a funnel chart using plotly"""
        fig = go.Figure(go.Funnel(
            y = [item['stage'] for item in data],
            x = [item['value'] for item in data],
            textinfo = "value+percent initial",
            textposition = "inside"
        ))
        
        fig.update_layout(title=title)
        fig.show()
    
    # ==================== ML SPECIFIC CHARTS ====================
    
    @staticmethod
    def confusion_matrix_chart(y_true: List[int], y_pred: List[int], 
                              labels: List[str], title: str = 'Confusion Matrix'):
        """Create a confusion matrix"""
        cm = confusion_matrix(y_true, y_pred)
        
        fig, ax = plt.subplots(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax,
                   xticklabels=labels, yticklabels=labels)
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Predicted Label', fontsize=12)
        ax.set_ylabel('True Label', fontsize=12)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def roc_curve_chart(y_true: List[int], y_scores: List[float], 
                       title: str = 'ROC Curve'):
        """Create an ROC curve"""
        fpr, tpr, _ = roc_curve(y_true, y_scores)
        auc = np.trapz(tpr, fpr)
        
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.plot(fpr, tpr, linewidth=2, label=f'ROC Curve (AUC = {auc:.3f})')
        ax.plot([0, 1], [0, 1], 'k--', linewidth=1, label='Random Classifier')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('False Positive Rate', fontsize=12)
        ax.set_ylabel('True Positive Rate', fontsize=12)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def precision_recall_curve_chart(y_true: List[int], y_scores: List[float],
                                   title: str = 'Precision-Recall Curve'):
        """Create a precision-recall curve"""
        precision, recall, _ = precision_recall_curve(y_true, y_scores)
        auc = np.trapz(precision, recall)
        
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.plot(recall, precision, linewidth=2, 
               label=f'PR Curve (AUC = {auc:.3f})')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Recall', fontsize=12)
        ax.set_ylabel('Precision', fontsize=12)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def learning_curve(train_scores: List[float], val_scores: List[float],
                      train_sizes: List[int], title: str = 'Learning Curve'):
        """Create a learning curve"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        ax.plot(train_sizes, train_scores, 'o-', linewidth=2, label='Training Score')
        ax.plot(train_sizes, val_scores, 's-', linewidth=2, label='Validation Score')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Training Set Size', fontsize=12)
        ax.set_ylabel('Score', fontsize=12)
        ax.legend()
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def feature_importance_chart(features: List[str], importance: List[float],
                                title: str = 'Feature Importance'):
        """Create a feature importance chart"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Sort by importance
        sorted_idx = np.argsort(importance)
        sorted_features = [features[i] for i in sorted_idx]
        sorted_importance = [importance[i] for i in sorted_idx]
        
        bars = ax.barh(sorted_features, sorted_importance, 
                      color=sns.color_palette("husl", len(features)))
        
        # Add value labels
        for bar, value in zip(bars, sorted_importance):
            width = bar.get_width()
            ax.text(width + max(sorted_importance)*0.01, bar.get_y() + bar.get_height()/2.,
                   f'{value:.3f}', ha='left', va='center')
        
        ax.set_title(title, fontsize=16, fontweight='bold')
        ax.set_xlabel('Importance', fontsize=12)
        ax.set_ylabel('Features', fontsize=12)
        ax.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.show()
    
    @staticmethod
    def residuals_plot(y_true: List[float], y_pred: List[float],
                      title: str = 'Residuals Plot'):
        """Create a residuals plot"""
        residuals = np.array(y_true) - np.array(y_pred)
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # Residuals vs Predicted
        ax1.scatter(y_pred, residuals, alpha=0.7, 
                   color=sns.color_palette("husl")[0])
        ax1.axhline(y=0, color='r', linestyle='--')
        ax1.set_title('Residuals vs Predicted', fontsize=14)
        ax1.set_xlabel('Predicted Values', fontsize=12)
        ax1.set_ylabel('Residuals', fontsize=12)
        ax1.grid(True, alpha=0.3)
        
        # Histogram of residuals
        ax2.hist(residuals, bins=30, alpha=0.7, 
                color=sns.color_palette("husl")[1], edgecolor='black')
        ax2.set_title('Distribution of Residuals', fontsize=14)
        ax2.set_xlabel('Residuals', fontsize=12)
        ax2.set_ylabel('Frequency', fontsize=12)
        ax2.grid(True, alpha=0.3)
        
        plt.suptitle(title, fontsize=16, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    # ==================== DEMO FUNCTION - ALL CHARTS ====================
    
    @staticmethod
    def demonstrate_all_charts():
        """Generate examples of all chart types"""
        print("🎨 Generating all visualization types...")
        
        # Bar Charts
        MLVisualizationSuite.bar_chart(
            [{'label': 'A', 'value': 10}, {'label': 'B', 'value': 25}, {'label': 'C', 'value': 15}],
            'Sample Bar Chart'
        )
        
        # Pie Chart
        MLVisualizationSuite.pie_chart(
            [{'label': 'Segment 1', 'value': 30}, {'label': 'Segment 2', 'value': 45}, {'label': 'Segment 3', 'value': 25}],
            'Sample Pie Chart'
        )
        
        # Scatter Plot
        scatter_data = [{'x': np.random.rand()*100, 'y': np.random.rand()*100} for _ in range(50)]
        MLVisualizationSuite.scatter_plot(scatter_data, 'Random Scatter Plot')
        
        # Line Chart
        line_data = [{'x': i, 'y': np.sin(i*0.5)*10+50} for i in range(20)]
        MLVisualizationSuite.line_chart(line_data, 'Sine Wave Line Chart')
        
        # Histogram
        hist_data = [(np.random.rand()-0.5)*10+50 for _ in range(1000)]
        MLVisualizationSuite.histogram(hist_data, 'Normal Distribution')
        
        # Heatmap
        heatmap_data = [[np.random.rand()*100 for _ in range(10)] for _ in range(10)]
        MLVisualizationSuite.heatmap(heatmap_data, 'Random Heatmap')
        
        # Confusion Matrix
        y_true = [np.random.randint(0, 3) for _ in range(100)]
        y_pred = [np.random.randint(0, 3) for _ in range(100)]
        MLVisualizationSuite.confusion_matrix_chart(y_true, y_pred, ['A', 'B', 'C'], 'Demo Confusion Matrix')
        
        print("✅ All visualizations generated!")

# Installation function for Colab
def install_dependencies():
    """Install required packages for Google Colab"""
    print("📦 Installing dependencies...")
    !pip install plotly seaborn matplotlib numpy pandas scikit-learn -q
    print("✅ Dependencies installed!")

# Quick demo function
def quick_demo():
    """Run a quick demo of the visualization suite"""
    install_dependencies()
    MLVisualizationSuite.demonstrate_all_charts()

print("🎨 ML Visualization Suite for Google Colab loaded successfully!")
print("💡 Use MLVisualizationSuite.demonstrate_all_charts() to see all chart types")
print("📦 Use install_dependencies() if needed in your Colab notebook")
