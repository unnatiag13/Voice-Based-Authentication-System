import sqlite3
import numpy as np
from config import DB_PATH

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS voice_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        embedding BLOB,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    conn.commit()
    conn.close()

def create_user(username, password_hash):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, password_hash)
        )
        conn.commit()
        return cursor.lastrowid

    except sqlite3.IntegrityError:
        return None

    finally:
        conn.close()

def get_user(username):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()

    conn.close()
    return user

def insert_embedding(user_id, embedding):
    conn = get_connection()
    cursor = conn.cursor()

    blob = embedding.tobytes()

    cursor.execute("INSERT INTO voice_embeddings (user_id, embedding) VALUES (?, ?)",
                   (user_id, blob))

    conn.commit()
    conn.close()

def get_user_embeddings(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT embedding FROM voice_embeddings WHERE user_id=?", (user_id,))
    rows = cursor.fetchall()

    conn.close()

    embeddings = []
    for row in rows:
        emb = np.frombuffer(row[0], dtype=np.float32)
        embeddings.append(emb)

    return embeddings