"""Authentication endpoints: login and current-user lookup."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, decode_access_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        claims = decode_access_token(credentials.credentials)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc
    user = db.scalar(select(User).where(User.email == claims.get("sub")))
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    user = db.scalar(select(User).where(User.email == credentials.email))
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(subject=user.email, extra_claims={"role": user.role})
    return LoginResponse(access_token=token, user=UserOut(name=user.name, email=user.email, role=user.role))
