import sounddevice as sd
from scipy.io.wavfile import write

def record_audio(filename, duration=3, fs=44100):
    print("Recording...")
    audio = sd.rec(int(duration * fs),
                   samplerate=fs,
                   channels=1)
    sd.wait()
    write(filename, fs, audio)
    print("Saved:", filename)

import librosa
import numpy as np

def extract_features(file):
    audio, sr = librosa.load(file)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=13
    )

    return np.mean(mfcc.T, axis=0)




from numpy.linalg import norm

def similarity(v1, v2):
    return np.dot(v1, v2) / (norm(v1) * norm(v2))


record_audio("voice1.wav")
input("Press Enter for second recording...")

record_audio("voice2.wav")

f1 = extract_features("voice1.wav")
f2 = extract_features("voice2.wav")

score = similarity(f1, f2)

print("Similarity Score:", score)

if score > 0.8:
    print("✅ Same Speaker")
else:
    print("❌ Different Speaker")