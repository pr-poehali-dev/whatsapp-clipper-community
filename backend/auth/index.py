"""
Аутентификация клинеров: регистрация, вход, получение текущего пользователя.
Роутинг через query-параметр action=register|login|me
"""
import json
import os
import hashlib
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

DEFAULT_AVATAR = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/1ea98bce-a6e9-4e7c-b7b4-6872483cd9fc.jpg"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def cleaner_to_dict(row) -> dict:
    return {
        "id": str(row[0]),
        "email": row[1],
        "name": row[2],
        "phone": row[3],
        "specialty": row[4],
        "bio": row[5],
        "price": row[6],
        "tags": list(row[7]) if row[7] else [],
        "avatar": row[8] or DEFAULT_AVATAR,
        "verified": row[9],
        "rating": float(row[10]),
        "reviews": row[11],
        "completedJobs": row[12],
    }


def handler(event: dict, context) -> dict:
    """Аутентификация: action=register|login|me."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    session_id = headers.get("x-session-id", "")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # GET ?action=me
    if method == "GET" and action == "me":
        if not session_id:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "no session"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT c.id, c.email, c.name, c.phone, c.specialty, c.bio, c.price, c.tags, c.avatar, c.verified, c.rating, c.reviews_count, c.completed_jobs "
            f"FROM {SCHEMA}.sessions s JOIN {SCHEMA}.cleaners c ON s.cleaner_id = c.id "
            f"WHERE s.id = %s",
            (session_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "session not found"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(cleaner_to_dict(row))}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        act = action or body.get("_action", "")

        # POST ?action=register
        if act == "register":
            name = body.get("name", "").strip()
            email = body.get("email", "").strip().lower()
            phone = body.get("phone", "").strip()
            specialty = body.get("specialty", "").strip()
            password = body.get("password", "")

            if not all([name, email, password]):
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "name, email, password обязательны"})}

            pw_hash = hash_password(password)
            conn = get_conn()
            cur = conn.cursor()
            try:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.cleaners (email, password_hash, name, phone, specialty, avatar) "
                    f"VALUES (%s, %s, %s, %s, %s, %s) "
                    f"RETURNING id, email, name, phone, specialty, bio, price, tags, avatar, verified, rating, reviews_count, completed_jobs",
                    (email, pw_hash, name, phone, specialty, DEFAULT_AVATAR)
                )
                cleaner = cur.fetchone()
                cur.execute(f"INSERT INTO {SCHEMA}.sessions (cleaner_id) VALUES (%s) RETURNING id", (cleaner[0],))
                session = cur.fetchone()
                conn.commit()
            except psycopg2.errors.UniqueViolation:
                conn.rollback()
                conn.close()
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}
            finally:
                conn.close()

            return {"statusCode": 200, "headers": CORS, "body": json.dumps({
                "session_id": str(session[0]),
                "cleaner": cleaner_to_dict(cleaner)
            })}

        # POST ?action=login
        if act == "login":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            pw_hash = hash_password(password)

            conn = get_conn()
            cur = conn.cursor()
            cur.execute(
                f"SELECT id, email, name, phone, specialty, bio, price, tags, avatar, verified, rating, reviews_count, completed_jobs "
                f"FROM {SCHEMA}.cleaners WHERE email = %s AND password_hash = %s",
                (email, pw_hash)
            )
            row = cur.fetchone()
            if not row:
                conn.close()
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

            cur.execute(f"INSERT INTO {SCHEMA}.sessions (cleaner_id) VALUES (%s) RETURNING id", (row[0],))
            session = cur.fetchone()
            conn.commit()
            conn.close()

            return {"statusCode": 200, "headers": CORS, "body": json.dumps({
                "session_id": str(session[0]),
                "cleaner": cleaner_to_dict(row)
            })}

    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "action обязателен: register|login|me"})}
