import os
import sys
import pandas as pd
# pyrefly: ignore [missing-import]
import numpy as np
# pyrefly: ignore [missing-import]
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_DIR = os.path.join(BASE_DIR, "model")

# File paths
COMBINED_DATA_CSV_PATH = os.path.join(DATASET_DIR, "combined_data.csv")
SPAM_CSV_PATH = os.path.join(DATASET_DIR, "spam.csv")
SPAM_DATASET_CSV_PATH = os.path.join(DATASET_DIR, "spam_dataset.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "spam_model.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")


def preprocess_text(text: str) -> str:
    """
    Basic text cleaning: lowercasing and trimming whitespace.
    """
    if not isinstance(text, str):
        return ""
    return text.lower().strip()


def load_dataset():
    """
    Locates and loads dataset from combined_data.csv (primary), spam.csv, or spam_dataset.csv.
    Identifies text and label columns dynamically.
    """
    target_path = None
    if os.path.exists(COMBINED_DATA_CSV_PATH):
        target_path = COMBINED_DATA_CSV_PATH
    elif os.path.exists(SPAM_CSV_PATH):
        target_path = SPAM_CSV_PATH
    elif os.path.exists(SPAM_DATASET_CSV_PATH):
        target_path = SPAM_DATASET_CSV_PATH
    else:
        raise FileNotFoundError(
            f"Dataset file not found. Expected {COMBINED_DATA_CSV_PATH}"
        )

    print(f"Loading dataset from: {target_path}")
    
    try:
        df = pd.read_csv(target_path, encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(target_path, encoding='latin-1')

    print(f"Raw dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")

    # Determine text and label columns dynamically
    text_col = None
    label_col = None

    for col in df.columns:
        cl = col.lower()
        if cl in ['text', 'message', 'email', 'sms', 'v2']:
            text_col = col
        elif cl in ['label', 'category', 'class', 'target', 'v1']:
            label_col = col

    if not text_col or not label_col:
        # Fallback to standard column positions if names aren't matched
        if df.shape[1] >= 2:
            label_col = df.columns[0]
            text_col = df.columns[1]
        else:
            raise ValueError(f"Could not identify text and label columns in {df.columns.tolist()}")

    print(f"Identified Text Column: '{text_col}', Label Column: '{label_col}'")
    return df, text_col, label_col


def train():
    print("==================================================")
    print("      Spam Email ML Model Training Pipeline       ")
    print("==================================================")

    # 1. Load Dataset
    df, text_col, label_col = load_dataset()

    # 2. Clean Data
    print("\nCleaning data...")
    # Drop NA values
    df = df.dropna(subset=[text_col, label_col])
    
    # Remove duplicate records based on text column
    initial_rows = len(df)
    df = df.drop_duplicates(subset=[text_col]).copy()
    duplicates_removed = initial_rows - len(df)
    print(f"Removed {duplicates_removed} duplicate text records. Clean dataset size: {len(df)} rows.")

    # 3. Preprocess Text
    df['text_clean'] = df[text_col].apply(preprocess_text)

    # Filter out any empty text records
    df = df[df['text_clean'].str.len() > 0].copy()

    # 4. Normalize Labels to 'spam' and 'not_spam'
    def normalize_label(val):
        s = str(val).lower().strip()
        if s in ['1', '1.0', 'spam']:
            return 'spam'
        return 'not_spam'

    df['normalized_label'] = df[label_col].apply(normalize_label)
    
    label_counts = df['normalized_label'].value_counts()
    print("\nNormalized Label Distribution:")
    for label, count in label_counts.items():
        pct = (count / len(df)) * 100
        print(f" - {label}: {count} ({pct:.2f}%)")

    X = df['text_clean']
    y = df['normalized_label']

    # 5. Train / Test Split (80% Train, 20% Test with Stratification)
    print("\nSplitting data into 80% Train / 20% Test sets (stratified)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 6. Feature Extraction using TF-IDF
    print("Extracting features using TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        stop_words='english',
        sublinear_tf=True
    )

    # Fit vectorizer ONLY on training set to prevent data leakage
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # 7. Model Training: Logistic Regression
    print("Training Logistic Regression classifier...")
    model = LogisticRegression(
        random_state=42,
        max_iter=1000,
        class_weight='balanced'
    )
    model.fit(X_train_tfidf, y_train)

    # 8. Model Evaluation
    print("\nEvaluating model performance on test set...")
    y_pred = model.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, pos_label='spam', zero_division=0)
    rec = recall_score(y_test, y_pred, pos_label='spam', zero_division=0)
    f1 = f1_score(y_test, y_pred, pos_label='spam', zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=['not_spam', 'spam'])

    print("\n==================================================")
    print("               EVALUATION METRICS                 ")
    print("==================================================")
    print(f" Accuracy       : {acc * 100:.2f}%")
    print(f" Precision (Spam): {prec * 100:.2f}%")
    print(f" Recall (Spam)   : {rec * 100:.2f}%")
    print(f" F1-Score (Spam) : {f1:.4f}")
    print("\n Confusion Matrix (rows: Actual, cols: Predicted):")
    print("                Pred Not Spam    Pred Spam")
    print(f"Actual Not Spam   {cm[0][0]:<14} {cm[0][1]:<14}")
    print(f"Actual Spam       {cm[1][0]:<14} {cm[1][1]:<14}")
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred))
    print("==================================================")

    # 9. Save Artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    print(f"\nSaving model to: {MODEL_PATH}")
    joblib.dump(model, MODEL_PATH)

    print(f"Saving vectorizer to: {VECTORIZER_PATH}")
    joblib.dump(vectorizer, VECTORIZER_PATH)

    # 10. Sample Test Predictions
    print("\nSample Predictions from Test Set:")
    test_sample_indices = [0, 5, 10, 15, 20]
    sample_texts = X_test.iloc[test_sample_indices].tolist()
    sample_actual = y_test.iloc[test_sample_indices].tolist()
    sample_tfidf = vectorizer.transform(sample_texts)
    sample_preds = model.predict(sample_tfidf)
    sample_probs = model.predict_proba(sample_tfidf)

    for i, (text, actual, pred, prob) in enumerate(zip(sample_texts, sample_actual, sample_preds, sample_probs)):
        classes = list(model.classes_)
        pred_idx = classes.index(pred)
        conf = prob[pred_idx]
        print(f"\n[{i+1}] Text: {text[:80]}...")
        print(f"    Actual: {actual} | Predicted: {pred} (Confidence: {conf:.4f})")

    print("\n[SUCCESS] Training complete! Artifacts successfully generated.")


if __name__ == "__main__":
    train()
