import os
import json
import logging
from typing import Optional, Dict, Any, List
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db = None
    is_connected: bool = False
    
    # In-memory store fallback (persisted in json file if mongo is offline)
    _memory_users: Dict[str, Dict[str, Any]] = {}
    _memory_debates: Dict[str, Dict[str, Any]] = {}
    _fallback_file: str = "local_storage.json"

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Ping database
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            logger.info("Successfully connected to MongoDB!")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"MongoDB connection failed: {e}. Switching to high-speed local fallback storage.")
            self._load_fallback()

    def _load_fallback(self):
        if os.path.exists(self._fallback_file):
            try:
                with open(self._fallback_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._memory_users = data.get("users", {})
                    self._memory_debates = data.get("debates", {})
            except Exception as e:
                logger.error(f"Error loading local fallback: {e}")

    def _save_fallback(self):
        try:
            with open(self._fallback_file, "w", encoding="utf-8") as f:
                json.dump({
                    "users": self._memory_users,
                    "debates": self._memory_debates
                }, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving local fallback: {e}")

    async def close(self):
        if self.client:
            self.client.close()

db_manager = DatabaseManager()

# Data helper methods that work transparently across MongoDB and Fallback
class StorageService:
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            return await db_manager.db.users.find_one({"email": email})
        return db_manager._memory_users.get(email)

    @staticmethod
    async def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
        if db_manager.is_connected and db_manager.db is not None:
            result = await db_manager.db.users.insert_one(user_data)
            user_data["_id"] = str(result.inserted_id)
            return user_data
        db_manager._memory_users[user_data["email"]] = user_data
        db_manager._save_fallback()
        return user_data

    @staticmethod
    async def save_debate(debate_id: str, debate_data: Dict[str, Any]):
        if db_manager.is_connected and db_manager.db is not None:
            await db_manager.db.debates.update_one(
                {"id": debate_id},
                {"$set": debate_data},
                upsert=True
            )
        else:
            db_manager._memory_debates[debate_id] = debate_data
            db_manager._save_fallback()

    @staticmethod
    async def get_debate(debate_id: str) -> Optional[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            res = await db_manager.db.debates.find_one({"id": debate_id})
            if res and "_id" in res:
                res["_id"] = str(res["_id"])
            return res
        return db_manager._memory_debates.get(debate_id)

    @staticmethod
    async def list_debates(user_id: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        if db_manager.is_connected and db_manager.db is not None:
            query = {"user_id": user_id} if user_id else {}
            cursor = db_manager.db.debates.find(query).sort("created_at", -1).limit(limit)
            debates = []
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                debates.append(doc)
            return debates
        
        all_debates = list(db_manager._memory_debates.values())
        if user_id:
            all_debates = [d for d in all_debates if d.get("user_id") == user_id]
        all_debates.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return all_debates[:limit]

    @staticmethod
    async def delete_debate(debate_id: str) -> bool:
        if db_manager.is_connected and db_manager.db is not None:
            res = await db_manager.db.debates.delete_one({"id": debate_id})
            return res.deleted_count > 0
        if debate_id in db_manager._memory_debates:
            del db_manager._memory_debates[debate_id]
            db_manager._save_fallback()
            return True
        return False

