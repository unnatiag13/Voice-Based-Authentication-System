import sounddevice as sd
from scipy.io.wavfile import write
import librosa
import numpy as np
from dtaidistance import dtw
from scipy.spatial.distance import euclidean


def record_audio(filename, duration=3, fs=44100):
    print("Recording...")
    audio = sd.rec(int(duration * fs),
                   samplerate=fs,
                   channels=1)
    sd.wait()
    write(filename, fs, audio)
    print("Saved:", filename)


def extract_features(file):
    audio, sr = librosa.load(file, sr=16000)

    # ✅ normalize volume
    audio = librosa.util.normalize(audio)

    # ✅ REMOVE SILENCE
    audio, _ = librosa.effects.trim(audio, top_db=20)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=13
    )

    return mfcc.T



def similarity(mfcc1, mfcc2):

    distances = []

    for i in range(mfcc1.shape[1]):
        d = dtw.distance(
            mfcc1[:, i],
            mfcc2[:, i]
        )
        distances.append(d)

    final_distance = np.mean(distances)

    # ✅ normalize by length
    final_distance /= (len(mfcc1) + len(mfcc2))

    return final_distance

record_audio("voice1.wav")
input("Press Enter for second recording...")

record_audio("voice2.wav")

f1 = extract_features("voice1.wav")
f2 = extract_features("voice2.wav")

score = similarity(f1, f2)

print("Similarity Score:", score)

if score < 1.8:
    print("✅ Same Speaker")
else:
    print("❌ Different Speaker")


