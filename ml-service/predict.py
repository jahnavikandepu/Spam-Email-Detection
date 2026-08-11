import os
import sys
import json
# pyrefly: ignore [missing-import]
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "spam_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "vectorizer.pkl")

_model = None
_vectorizer = None


def load_artifacts():
    global _model, _vectorizer
    if _model is not None and _vectorizer is not None:
        return True

    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        sys.stderr.write(f"Error: Model or vectorizer file not found at {MODEL_PATH} / {VECTORIZER_PATH}\n")
        return False

    try:
        _model = joblib.load(MODEL_PATH)
        _vectorizer = joblib.load(VECTORIZER_PATH)
        return True
    except Exception as e:
        sys.stderr.write(f"Error loading ML artifacts: {e}\n")
        return False


def preprocess_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    return text.lower().strip()


def predict(text: str) -> dict:
    if not load_artifacts():
        return {
            "error": "Model files missing or invalid. Please train the model first.",
            "prediction": "not_spam",
            "confidence": 0.5
        }

    clean_text = preprocess_text(text)
    if not clean_text:
        return {
            "prediction": "not_spam",
            "confidence": 0.5
        }

    # Transform text using saved TF-IDF vectorizer
    vectorized_text = _vectorizer.transform([clean_text])

    # Model prediction
    raw_prediction = _model.predict(vectorized_text)[0]
    
    # Standardize output class
    is_spam = (str(raw_prediction).lower().strip() == 'spam')
    prediction = "spam" if is_spam else "not_spam"

    # Confidence calculation from probability output
    confidence = 0.95
    if hasattr(_model, "predict_proba"):
        try:
            probabilities = _model.predict_proba(vectorized_text)[0]
            confidence = float(max(probabilities))
        except Exception as e:
            sys.stderr.write(f"Warning calculating probabilities: {e}\n")
            confidence = 0.95

    # Round confidence score nicely
    confidence = round(float(confidence), 4)

    return {
        "prediction": prediction,
        "confidence": confidence
    }


def main():
    # Read text from CLI argument or STDIN
    text = ""
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        try:
            text = sys.stdin.read()
        except Exception as e:
            sys.stderr.write(f"Error reading stdin: {e}\n")

    if not text:
        sys.stderr.write("No input text provided to predict.py\n")
        result = {"prediction": "not_spam", "confidence": 0.50}
    else:
        result = predict(text)

    # Output ONLY JSON to stdout
    sys.stdout.write(json.dumps(result, indent=None) + "\n")
    sys.stdout.flush()


if __name__ == "__main__":
    main()
