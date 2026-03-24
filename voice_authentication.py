from speechbrain.inference.speaker import SpeakerRecognition

# load deep learning speaker model
verification = SpeakerRecognition.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb"
)

# compare two voices
score, prediction = verification.verify_files(
    "voice recording.ogg",
    "voice recording 2.ogg"
)

print("Similarity Score:", score)
print("Same Speaker:", prediction)