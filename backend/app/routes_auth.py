from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from bson import ObjectId

from app.database import users_collection, resumes_collection
from app.auth import (
    hash_password, verify_password, create_access_token, decode_access_token,
    create_reset_token, decode_reset_token,
)

router = APIRouter()


class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/auth/signup")
def signup(data: SignUpRequest):
    existing = users_collection.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed = hash_password(data.password)
    result = users_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hashed,
    })

    token = create_access_token(str(result.inserted_id))
    return {
        "token": token,
        "user": {"id": str(result.inserted_id), "name": data.name, "email": data.email}
    }


@router.post("/auth/signin")
def signin(data: SignInRequest):
    user = users_collection.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(str(user["_id"]))
    return {
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    }


def get_current_user_id(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")
    return user_id


@router.get("/auth/me")
def get_me(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/auth/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        # Don't reveal whether the email exists — just say it was "sent"
        return {"message": "If that email exists, a reset link has been sent."}

    reset_token = create_reset_token(str(user["_id"]))

    # NOTE: In production, email this link instead of returning it directly.
    # For now (no email service configured), we return it so the demo works.
    return {
        "message": "Reset token generated (dev mode — normally this would be emailed).",
        "reset_token": reset_token,
    }


@router.post("/auth/reset-password")
def reset_password(data: ResetPasswordRequest):
    user_id = decode_reset_token(data.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link.")

    hashed = hash_password(data.new_password)
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"password": hashed}})
    return {"message": "Password updated successfully."}


class UpdateProfileRequest(BaseModel):
    name: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.put("/auth/update-profile")
def update_profile(data: UpdateProfileRequest, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"name": data.name}})
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}


@router.put("/auth/change-password")
def change_password(data: ChangePasswordRequest, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    hashed = hash_password(data.new_password)
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"password": hashed}})
    return {"message": "Password changed successfully."}


@router.delete("/auth/delete-account")
def delete_account(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    users_collection.delete_one({"_id": ObjectId(user_id)})
    resumes_collection.delete_many({"user_id": user_id})
    return {"message": "Account deleted."}