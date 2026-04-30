🎙️ Voice-Based Authentication System
A biometric authentication system that verifies user identity using voice recognition. This project leverages machine learning and deep learning techniques to extract voice features and match them against stored user profiles.

👥 Team Members


Kritika Saxena — Machine Learning Model


Unnati Agarwal — Backend API


Aarohi Mishra — Frontend & DevOps



🧠 Project Overview
Traditional authentication systems rely on passwords or OTPs, which can be insecure or inconvenient. This project introduces a voice-based biometric system that authenticates users based on unique vocal characteristics.
The system records a user's voice, processes it, extracts features, and compares it with stored voice embeddings to verify identity.

⚙️ Tech Stack
🔹 Machine Learning


Python


Librosa (audio processing)


Scikit-learn


SpeechBrain (Pretrained Speaker Recognition Model)


🔹 Backend


FastAPI (REST API for authentication & processing)


🔹 Frontend


HTML


CSS


JavaScript



🤖 Model Details


Used SpeechBrain's pretrained speaker recognition model for extracting voice embeddings.


Audio input is processed into features like MFCC (Mel-Frequency Cepstral Coefficients).


Extracted embeddings are compared using similarity metrics (e.g., cosine similarity).


The system decides whether the voice matches a registered user based on a threshold.



🔄 System Workflow


User records voice input


Audio preprocessing (noise reduction, normalization)


Feature extraction using Librosa


Embedding generation using SpeechBrain


Comparison with stored embeddings


Authentication result (Success / Failure)



📂 Project Structure (Example)
Voice-Based-Authentication-System/│── backend/│   ├── main.py│   ├── routes/│   ├── models/││── frontend/│   ├── index.html│   ├── style.css│   ├── script.js││── ml/│   ├── feature_extraction.py│   ├── model.py││── README.md

🚀 How to Run
1. Clone the repository
git clone https://github.com/your-repo/Voice-Based-Authentication-System.gitcd Voice-Based-Authentication-System
2. Install dependencies
pip install -r requirements.txt
3. Run backend server
uvicorn main:app --reload
4. Open frontend
Simply open index.html in your browser


🧪 Features


🎤 Voice recording & processing


🔐 Secure biometric authentication


⚡ FastAPI-based backend


🤖 Pretrained deep learning model (SpeechBrain)


📊 Feature extraction using Librosa



📊 Future Scope


Add real-time authentication


Improve accuracy with fine-tuned models


Deploy on cloud (AWS / Azure)


Add mobile app integration


Multi-user voice database support



📌 Project Status
🚧 Currently under development (Core ML pipeline implemented, API & UI in progress)



📜 Conclusion
This project demonstrates how voice biometrics can be used as a secure and user-friendly authentication method. By leveraging pretrained models like SpeechBrain, the system achieves efficient and scalable voice recognition.



