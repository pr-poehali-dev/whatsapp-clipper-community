"""
Отзывы клинеров: просмотр и добавление.
"""
import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Получение отзывов клинера и добавление нового отзыва."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    cleaner_id = params.get("cleaner_id", "")

    # GET /?cleaner_id=... — отзывы конкретного клинера
    if method == "GET":
        if not cleaner_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "cleaner_id обязателен"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, author_name, rating, review_text, created_at "
            f"FROM {SCHEMA}.reviews WHERE cleaner_id = %s ORDER BY created_at DESC",
            (cleaner_id,)
        )
        rows = cur.fetchall()
        conn.close()
        reviews = [
            {
                "id": str(r[0]),
                "author": r[1],
                "rating": r[2],
                "text": r[3],
                "date": r[4].strftime("%d %B %Y") if r[4] else "",
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(reviews)}

    # POST / — добавить отзыв
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        c_id = body.get("cleaner_id", "").strip()
        author = body.get("author", "Аноним").strip() or "Аноним"
        rating = int(body.get("rating", 5))
        text = body.get("text", "").strip()

        if not c_id or not text:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "cleaner_id и text обязательны"})}
        if rating < 1 or rating > 5:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "rating должен быть от 1 до 5"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.reviews (cleaner_id, author_name, rating, review_text) "
            f"VALUES (%s, %s, %s, %s) RETURNING id, author_name, rating, review_text, created_at",
            (c_id, author, rating, text)
        )
        row = cur.fetchone()

        # Пересчитать средний рейтинг клинера
        cur.execute(
            f"UPDATE {SCHEMA}.cleaners SET "
            f"rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM {SCHEMA}.reviews WHERE cleaner_id = %s), "
            f"reviews_count = (SELECT COUNT(*) FROM {SCHEMA}.reviews WHERE cleaner_id = %s) "
            f"WHERE id = %s",
            (c_id, c_id, c_id)
        )
        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(row[0]),
            "author": row[1],
            "rating": row[2],
            "text": row[3],
            "date": row[4].strftime("%d %B %Y") if row[4] else "",
        })}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
