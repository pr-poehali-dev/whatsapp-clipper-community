"""
Управление профилем клинера: просмотр всех клинеров, обновление своего профиля.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_cleaner_id_by_session(cur, session_id: str):
    cur.execute(f"SELECT cleaner_id FROM {SCHEMA}.sessions WHERE id = %s", (session_id,))
    row = cur.fetchone()
    return str(row[0]) if row else None


def handler(event: dict, context) -> dict:
    """Получение списка клинеров и обновление профиля."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    session_id = headers.get("x-session-id", "")

    # GET / — список всех клинеров (публичный)
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, specialty, rating, reviews_count, completed_jobs, price, tags, avatar, verified "
            f"FROM {SCHEMA}.cleaners ORDER BY rating DESC, reviews_count DESC"
        )
        rows = cur.fetchall()
        conn.close()
        cleaners = [
            {
                "id": str(r[0]),
                "name": r[1],
                "specialty": r[2],
                "rating": float(r[3]),
                "reviews": r[4],
                "completedJobs": r[5],
                "price": r[6],
                "tags": list(r[7]) if r[7] else [],
                "avatar": r[8],
                "verified": r[9],
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(cleaners)}

    # PUT / — обновить свой профиль
    if method == "PUT":
        if not session_id:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "no session"})}

        body = json.loads(event.get("body") or "{}")
        conn = get_conn()
        cur = conn.cursor()
        cleaner_id = get_cleaner_id_by_session(cur, session_id)
        if not cleaner_id:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "session not found"})}

        fields = []
        values = []
        allowed = ["name", "phone", "specialty", "bio", "price", "tags"]
        for key in allowed:
            if key in body:
                fields.append(f"{key} = %s")
                values.append(body[key] if key != "tags" else body[key])

        if not fields:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "нет полей для обновления"})}

        values.append(cleaner_id)
        cur.execute(
            f"UPDATE {SCHEMA}.cleaners SET {', '.join(fields)} WHERE id = %s "
            f"RETURNING id, email, name, phone, specialty, bio, price, tags, avatar, verified, rating, reviews_count, completed_jobs",
            values
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(row[0]),
            "email": row[1],
            "name": row[2],
            "phone": row[3],
            "specialty": row[4],
            "bio": row[5],
            "price": row[6],
            "tags": list(row[7]) if row[7] else [],
            "avatar": row[8],
            "verified": row[9],
            "rating": float(row[10]),
            "reviews": row[11],
            "completedJobs": row[12],
        })}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
