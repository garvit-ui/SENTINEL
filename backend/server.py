from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import asyncio
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import bcrypt
import httpx
import jwt
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
FOUNDER_ALERT_EMAIL = os.environ["FOUNDER_ALERT_EMAIL"]
FRONTEND_URL = os.environ["FRONTEND_URL"]

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---- Managed email guardrail gate (do not weaken) ----
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []
    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []
    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan(); scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} ≠ real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


async def notify_founder(email: str, position: int, batch: int):
    subject = f"New Sentinel signup #{position}"
    admin_url = f"{FRONTEND_URL}/admin"
    html = (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:32px 0">'
        '<tr><td align="center">'
        '<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#0C0C0C;border:1px solid #27272a;border-radius:12px;padding:32px;font-family:Arial,sans-serif">'
        '<tr><td>'
        '<p style="color:#a1a1aa;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">Sentinel · waitlist alert</p>'
        f'<p style="color:#e4e4e7;font-size:15px;line-height:1.6;margin:0 0 8px">Someone just joined the waitlist:</p>'
        f'<p style="color:#ffffff;font-size:18px;font-weight:bold;margin:0 0 16px">{escape(email)}</p>'
        f'<p style="color:#a1a1aa;font-size:13px;margin:0 0 24px">Queue position #{position} · access batch {batch}</p>'
        f'<p style="margin:0 0 24px"><a href="{admin_url}" style="background:#ffffff;color:#080808;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:bold">Open waitlist admin</a></p>'
        f'<p style="color:#71717a;font-size:11px;margin:0">Sent by {escape(EMAIL_FROM_NAME)}. We never ask for passwords or card details by email.</p>'
        '</td></tr></table></td></tr></table>'
    )
    try:
        email_id = await send_email(to=FOUNDER_ALERT_EMAIL, subject=subject, html=html)
        logger.info(f"Founder alert sent for signup #{position} (id={email_id})")
    except Exception as e:
        logger.error(f"Founder alert failed for signup #{position}: {e}")


# ---- Auth ----
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


class LoginInput(BaseModel):
    email: EmailStr
    password: str


MAX_ATTEMPTS = 5
LOCKOUT_WINDOW = timedelta(minutes=15)


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower().strip()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= MAX_ATTEMPTS:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": (datetime.now(timezone.utc) + LOCKOUT_WINDOW).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    response.set_cookie(key="access_token", value=create_access_token(user["id"], email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user["id"]), httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    return {"id": user["id"], "email": email, "name": user.get("name", "Admin"), "role": user["role"]}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "logged_out"}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie(key="access_token", value=create_access_token(user["id"], user["email"]), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    return {"status": "refreshed"}


# ---- Waitlist ----
class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    position: int
    batch: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WaitlistCreate(BaseModel):
    email: EmailStr


@api_router.get("/")
async def root():
    return {"message": "Sentinel API — watching Indian APIs so you don't have to."}


@api_router.post("/waitlist")
async def join_waitlist(input: WaitlistCreate):
    email = input.email.lower().strip()
    existing = await db.waitlist.find_one({"email": email}, {"_id": 0})
    if existing:
        return {
            "status": "already_registered",
            "position": existing["position"],
            "batch": existing["batch"],
        }
    total = await db.waitlist.count_documents({})
    position = total + 1
    batch = (total // 50) + 1
    entry = WaitlistEntry(email=email, position=position, batch=batch)
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.waitlist.insert_one(doc)
    asyncio.create_task(notify_founder(email, position, batch))
    return {"status": "joined", "position": position, "batch": batch}


@api_router.get("/waitlist/count")
async def waitlist_count():
    return {"count": await db.waitlist.count_documents({})}


# ---- Admin ----
@api_router.get("/admin/waitlist")
async def list_waitlist(admin=Depends(get_current_admin)):
    entries = await db.waitlist.find({}, {"_id": 0}).sort("position", 1).to_list(10000)
    return {"total": len(entries), "entries": entries}


@api_router.get("/admin/waitlist/export")
async def export_waitlist(admin=Depends(get_current_admin)):
    entries = await db.waitlist.find({}, {"_id": 0}).sort("position", 1).to_list(10000)
    lines = ["position,email,batch,joined_at"]
    for e in entries:
        lines.append(f'{e["position"]},{e["email"]},{e["batch"]},{e["created_at"]}')
    csv_data = "\n".join(lines) + "\n"
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sentinel-waitlist.csv"},
    )


async def seed_admin():
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Founder",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.waitlist.create_index("email", unique=True)
    await seed_admin()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[FRONTEND_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
