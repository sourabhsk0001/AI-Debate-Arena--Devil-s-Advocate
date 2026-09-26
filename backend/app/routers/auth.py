import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserRegister, UserLogin, TokenResponse, UserResponse
from app.core.auth import hash_password, verify_password, create_access_token, get_current_user_optional
from app.core.database import StorageService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister):
    existing = await StorageService.get_user_by_email(user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user_in.name,
        "email": user_in.email,
        "hashed_password": hash_password(user_in.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    user = await StorageService.create_user(user_dict)
    
    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user["id"], name=user["name"], email=user["email"], created_at=user["created_at"])
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await StorageService.get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user["id"], name=user["name"], email=user["email"], created_at=user["created_at"])
    )

@router.post("/guest", response_model=TokenResponse)
async def guest_login():
    """Generates an immediate guest session token without email sign-up."""
    guest_id = f"guest_{uuid.uuid4().hex[:8]}"
    token = create_access_token({"sub": guest_id, "email": f"{guest_id}@guest.arena", "name": "Guest Debater"})
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=guest_id, name="Guest Debater", email=f"{guest_id}@guest.arena", created_at=datetime.now(timezone.utc).isoformat())
    )

@router.get("/me")
async def get_me(user: dict = Depends(get_current_user_optional)):
    if not user:
        return {"authenticated": False}
    return {"authenticated": True, "user": user}
