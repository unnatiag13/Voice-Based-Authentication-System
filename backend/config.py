import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_PATH = os.path.join(BASE_DIR, "instance", "voice_auth.db")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "temp_uploads")

THRESHOLD = 0.55
MODEL_SOURCE = "speechbrain/spkrec-ecapa-voxceleb"