from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder="../frontend")

@app.route("/")
def home():
    return send_from_directory("../frontend", "index.html")

@app.route("/style.css")
def css():
    return send_from_directory("../frontend", "style.css")

@app.route("/script.js")
def js():
    return send_from_directory("../frontend", "script.js")

@app.route("/verify", methods=["POST"])
def verify():
    audio = request.files['audio']
    return jsonify({"message": "Voice Verified Successfully"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)