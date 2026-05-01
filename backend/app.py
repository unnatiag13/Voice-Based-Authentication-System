from flask import Flask, request, jsonify
import os
import bcrypt
from flask_cors import CORS
import traceback

from config import UPLOAD_FOLDER, THRESHOLD, DB_PATH
from database import *
from voice_service import *

app = Flask(__name__)
CORS(app)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("instance", exist_ok=True)

init_db()

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    init_db()
    username = request.form.get("username")
    password = request.form.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    existing_user = get_user(username)
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    files = request.files.getlist("audio")

    if len(files) < 5:
        return jsonify({"error": "Need 5 voice samples"}), 400

    generated_embeddings = []
    saved_paths = []

    try:
        for index, file in enumerate(files):
            filename = f"{username}_sample_{index + 1}.webm"
            path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(path)
            saved_paths.append(path)

            emb = get_embedding(path)
            generated_embeddings.append(emb)

        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        user_id = create_user(username, hashed)

        if not user_id:
            return jsonify({"error": "User already exists"}), 400

        for emb in generated_embeddings:
            insert_embedding(user_id, emb)

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        traceback.print_exc()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

    finally:
        for path in saved_paths:
            if os.path.exists(path):
                os.remove(path)

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    init_db()
    username = request.form.get("username")
    password = request.form.get("password")

    user = get_user(username)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id, _, password_hash = user

    if not bcrypt.checkpw(password.encode(), password_hash):
        return jsonify({"error": "Wrong password"}), 401

    files = request.files.getlist("audio")

    if len(files) < 2:
        return jsonify({"error": "Need 2 voice samples"}), 400

    embeddings = get_user_embeddings(user_id)

    scores = []

    for file in files:
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        score, _ = verify_user(path, embeddings, THRESHOLD)
        scores.append(score)

        os.remove(path)

    final_score = sum(scores) / len(scores)
    authenticated = final_score >= THRESHOLD

    return jsonify({
        "score": final_score,
        "authenticated": authenticated
    })


# ---------------- HEALTH ----------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "running"})


if __name__ == "__main__":
    print("Using DB:", DB_PATH)
    app.run(debug=False, use_reloader=False)