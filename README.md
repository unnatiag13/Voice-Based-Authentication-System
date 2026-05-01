# 🎙️ Voice-Based Authentication System

A full-stack biometric authentication system that verifies user identity using **voice recognition** along with traditional **username + password**.

---

## 🚀 Overview

Traditional authentication systems rely only on passwords, which can be insecure or easily compromised.
This project enhances security by introducing **voice biometrics** as an additional authentication factor.

The system records a user’s voice, extracts unique features (embeddings), and compares them with stored profiles to verify identity.

---

## 🧠 Key Features

* 🔐 **Multi-Factor Authentication**

  * Username + Password + Voice

* 🎤 **Voice Enrollment**

  * 5 voice samples during registration

* 🔍 **Voice Verification**

  * 2 voice samples during login

* 🧠 **ML-Based Speaker Recognition**

  * Uses pretrained SpeechBrain ECAPA model

* 📊 **Similarity Scoring**

  * Cosine similarity between embeddings

* 🗄️ **Database Integration**

  * Stores user credentials and voice embeddings

* 🌐 **Full Stack Implementation**

  * Frontend + Backend + ML pipeline

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
        ↓
Flask Backend API
        ↓
Voice Processing (SpeechBrain)
        ↓
SQLite Database
```

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (MediaRecorder API)

### Backend

* Python (Flask)
* Flask-CORS

### Machine Learning

* SpeechBrain (ECAPA-TDNN)
* PyTorch
* NumPy / SciPy

### Database

* SQLite

### Audio Processing

* FFmpeg

### Deployment (Planned / Partial)

* Render (Backend)
* Vercel (Frontend)
* GCP Cloud Run (for ML scaling)

---

## ⚙️ How It Works

### 🔹 Registration

1. User enters:

   * Username
   * Password
   * 5 voice samples

2. Backend:

   * Hashes password (bcrypt)
   * Converts audio → WAV → preprocesses
   * Extracts embeddings using SpeechBrain
   * Stores embeddings + user data in DB

---

### 🔹 Login

1. User enters:

   * Username
   * Password
   * 2 voice samples

2. Backend:

   * Verifies password
   * Extracts embeddings from input
   * Compares with stored embeddings
   * Computes average cosine similarity
   * Grants / denies access

---

## 🧬 ML Pipeline

* Audio → WAV (16kHz, mono)
* Noise trimming + normalization
* Fixed-length padding (~3 sec)
* Embedding extraction
* Cosine similarity comparison

---

## 🗃️ Database Schema

### Users Table

| Field         | Type    |
| ------------- | ------- |
| id            | Integer |
| username      | Text    |
| password_hash | Text    |

### Voice Embeddings Table

| Field     | Type    |
| --------- | ------- |
| id        | Integer |
| user_id   | Integer |
| embedding | Vector  |

---

## 📁 Project Structure

```
voice-auth-system/
│
├── Backend/
│   ├── app.py
│   ├── voice_service.py
│   ├── database.py
│   ├── config.py
│   ├── requirements.txt
│   └── instance/
│
├── frontend/
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── result.html
│   ├── css/
│   └── js/
│
└── .gitignore
```

---

## ▶️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Voice-Based-Authentication-System.git
cd Voice-Based-Authentication-System
```

---

### 2. Backend setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
python app.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

### 3. Frontend setup

```bash
cd frontend
```

Run using Live Server or:

```bash
python -m http.server 5500
```

Open:

```
http://127.0.0.1:5500
```

---

## 🌍 Deployment Notes

* Backend requires **high memory** due to ML model
* Free hosting (Render free tier) may fail
* Recommended:

  * **GCP Cloud Run (2GB+ RAM)**
  * Separate ML inference service

---

## ⚠️ Challenges Faced

* Handling variable-length audio inputs
* Ensuring accurate similarity thresholds
* Deployment issues due to high memory usage
* Model performance with different phrases
* Browser audio recording inconsistencies

---

## 🚧 Future Improvements

* 🔍 Liveness detection (anti-spoofing)
* 📱 Mobile app integration
* ☁️ Scalable ML microservice
* 🔐 Face + Voice combined authentication
* 📈 Better threshold tuning for accuracy

---

## 🏆 Learning Outcomes

* Real-world ML + Web integration
* Audio signal processing
* Speaker recognition systems
* Full
