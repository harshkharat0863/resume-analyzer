from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime

from app.database import resumes_collection
from bson.errors import InvalidId
from app.routes_auth import get_current_user_id

router = APIRouter()


class SaveHistoryRequest(BaseModel):
    filename: str
    result: dict


@router.post("/history/save")
def save_history(data: SaveHistoryRequest, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    doc = {
        "user_id": user_id,
        "filename": data.filename,
        "result": data.result,
        "created_at": datetime.utcnow(),
    }
    result = resumes_collection.insert_one(doc)
    return {"id": str(result.inserted_id)}


@router.get("/history")
def get_history(authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    docs = list(resumes_collection.find({"user_id": user_id}).sort("created_at", -1).limit(50))
    for d in docs:
        d["id"] = str(d["_id"])
        del d["_id"]
    return {"history": docs}


@router.delete("/history/{item_id}")
def delete_history(item_id: str, authorization: str = Header(None)):
    user_id = get_current_user_id(authorization)
    result = resumes_collection.delete_one({"_id": ObjectId(item_id), "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found.")
    return {"deleted": True}

@router.get("/share/{item_id}")
def get_shared_result(item_id: str):
    try:
        doc = resumes_collection.find_one({"_id": ObjectId(item_id)})
    except InvalidId:
        raise HTTPException(status_code=404, detail="Not found.")

    if not doc:
        raise HTTPException(status_code=404, detail="This shared result doesn't exist or was deleted.")

    result = doc["result"]
    return {
        "filename": doc["filename"],
        "match_percentage": result["match_percentage"],
        "matched_skills": result["matched_skills"],
        "missing_skills_count": len(result["missing_skills"]),
        "created_at": doc["created_at"],
    }