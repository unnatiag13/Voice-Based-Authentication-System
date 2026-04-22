from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Path to frontend folder
FRONTEND_FOLDER = os.path.join(os.getcwd(), "frontend")

# Serve main page
@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")

# Serve all frontend files automatically
@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_FOLDER, path)

# Voice verification API
@app.route("/verify", methods=["POST"])
def verify():
    audio = request.files.get("audio")

    if not audio:
        return jsonify({"error": "No audio file provided"}), 400

    # later your voice model will go here
    return jsonify({"message": "Voice Verified Successfully"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # important for Render
    app.run(host="0.0.0.0", port=port)