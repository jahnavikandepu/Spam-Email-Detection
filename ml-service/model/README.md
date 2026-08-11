# SpamGuard Trained Models Directory

This directory stores the trained machine learning model artifacts exported by `train.py` or from your Google Colab notebook.

### Expected Model Files:

```
model/
├── spam_model.pkl
└── vectorizer.pkl
```

- **`spam_model.pkl`**: The trained classification model (e.g. Multinomial Naive Bayes, Logistic Regression, or SVM).
- **`vectorizer.pkl`**: The trained TF-IDF text vectorizer used to transform raw email text into numerical feature vectors.

### Generating These Files:
Run `python train.py` after adding your dataset to `dataset/spam_dataset.csv`, or place exported `.pkl` files directly into this directory.

> **Note**: Do not commit corrupt or temporary model binary files to version control.
