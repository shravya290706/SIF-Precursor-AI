from pathlib import Path

import joblib


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_MODEL_PATH = PROJECT_ROOT / "backend" / "models" / "sif_classifier.pkl"
DEFAULT_VECTORIZER_PATH = PROJECT_ROOT / "backend" / "models" / "tfidf_vectorizer.pkl"


def load_artifacts(model_path=DEFAULT_MODEL_PATH, vectorizer_path=DEFAULT_VECTORIZER_PATH):
    """Load the persisted classifier and vectorizer used by the baseline."""
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    return model, vectorizer


def predict_narrative(narrative, model=None, vectorizer=None, top_k=5):
    """Classify one narrative and return coefficient-based text evidence."""
    if model is None or vectorizer is None:
        model, vectorizer = load_artifacts()

    features = vectorizer.transform([narrative])
    probabilities = model.predict_proba(features)[0]
    prediction = int(model.predict(features)[0])
    feature_indices = features.indices
    feature_values = features.data
    coefficients = model.coef_[0]
    feature_names = vectorizer.get_feature_names_out()

    evidence = []
    for index, value in zip(feature_indices, feature_values):
        contribution = float(value * coefficients[index])
        if contribution > 0:
            evidence.append(
                {
                    "term": feature_names[index],
                    "contribution": contribution,
                }
            )

    evidence.sort(key=lambda item: item["contribution"], reverse=True)
    return {
        "predicted_label": "SIF_POTENTIAL" if prediction == 1 else "NOT_APPARENT",
        "probability": float(probabilities[prediction]),
        "positive_probability": float(probabilities[1]),
        "evidence": evidence[:top_k],
    }