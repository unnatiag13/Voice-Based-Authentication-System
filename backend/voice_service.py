import os
import subprocess

import torch
import numpy as np
import torch.nn.functional as F
from scipy.io import wavfile

from speechbrain.inference import EncoderClassifier
from speechbrain.utils.fetching import LocalStrategy
from config import MODEL_SOURCE


classifier = EncoderClassifier.from_hparams(
    source=MODEL_SOURCE,
    savedir="pretrained_model",
    local_strategy=LocalStrategy.COPY
)

TARGET_SR = 16000
FIXED_SECONDS = 3
TARGET_LEN = TARGET_SR * FIXED_SECONDS


def convert_to_wav(input_path):
    wav_path = input_path.rsplit(".", 1)[0] + "_converted.wav"

    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-ac", "1",
        "-ar", str(TARGET_SR),
        "-sample_fmt", "s16",
        wav_path
    ]

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed: {result.stderr}")

    return wav_path


def preprocess_audio(file_path):
    wav_path = convert_to_wav(file_path)

    sample_rate, signal = wavfile.read(wav_path)

    if signal.ndim > 1:
        signal = np.mean(signal, axis=1)

    signal = signal.astype(np.float32)

    max_value = np.max(np.abs(signal))
    if max_value > 0:
        signal = signal / max_value

    if len(signal) < TARGET_LEN:
        signal = np.pad(signal, (0, TARGET_LEN - len(signal)))
    else:
        signal = signal[:TARGET_LEN]

    waveform = torch.tensor(signal).float().unsqueeze(0)

    return waveform, wav_path


def get_embedding(file_path):
    wav_path = None

    try:
        signal, wav_path = preprocess_audio(file_path)

        with torch.no_grad():
            embedding = classifier.encode_batch(signal)

        return embedding.squeeze().cpu().numpy().astype(np.float32)

    finally:
        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)


def cosine_similarity(a, b):
    a_tensor = torch.tensor(a).float()
    b_tensor = torch.tensor(b).float()
    return F.cosine_similarity(a_tensor, b_tensor, dim=0).item()


def verify_user(test_file, stored_embeddings, threshold):
    if not stored_embeddings:
        return 0.0, False

    test_embedding = get_embedding(test_file)

    scores = [cosine_similarity(test_embedding, emb) for emb in stored_embeddings]

    avg_score = float(np.mean(scores))
    authenticated = avg_score >= threshold

    return avg_score, authenticated