"""
Портфолио клинеров: просмотр и добавление работ.
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

DEFAULT_IMG = "https://cdn.poehali.dev/projects/2d5b4196-61a2-4092-9b7e-d0b2304a31bb/files/f5145ac5-da33-4dad-8cce-eb757bd3d2d0.jpg"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Получение портфолио клинера и добавление новой работы."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    session_id = headers.get("x-session-id", "")
    params = event.get("queryStringParameters") or {}
    cleaner_id = params.get("cleaner_id", "")

    # GET /?cleaner_id=...
    if method == "GET":
        if not cleaner_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "cleaner_id обязателен"})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, title, area, time_spent, img FROM {SCHEMA}.portfolio_items "
            f"WHERE cleaner_id = %s ORDER BY created_at DESC",
            (cleaner_id,)
        )
        rows = cur.fetchall()
        conn.close()
        items = [{"id": str(r[0]), "title": r[1], "area": r[2], "time": r[3], "img": r[4] or DEFAULT_IMG} for r in rows]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(items)}

    # POST / — добавить работу (требует сессии)
    if method == "POST":
        if not session_id:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "no session"})}

        body = json.loads(event.get("body") or "{}")
        title = body.get("title", "").strip()
        area = body.get("area", "").strip()
        time_spent = body.get("time", "").strip()
        img = body.get("img", DEFAULT_IMG).strip() or DEFAULT_IMG

        if not title:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "title обязателен"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT cleaner_id FROM {SCHEMA}.sessions WHERE id = %s", (session_id,))
        sess = cur.fetchone()
        if not sess:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "session not found"})}

        c_id = str(sess[0])
        cur.execute(
            f"INSERT INTO {SCHEMA}.portfolio_items (cleaner_id, title, area, time_spent, img) "
            f"VALUES (%s, %s, %s, %s, %s) RETURNING id, title, area, time_spent, img",
            (c_id, title, area, time_spent, img)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": str(row[0]), "title": row[1], "area": row[2], "time": row[3], "img": row[4]
        })}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
