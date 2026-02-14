from fastapi import FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import hashlib
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="CL Messenger API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserRegister(BaseModel):
    username: str
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    avatar: str
    stars: int
    isOnline: bool
    isAdmin: bool
    createdAt: str

class MessageCreate(BaseModel):
    receiverId: str
    text: str

class MessageResponse(BaseModel):
    id: str
    senderId: str
    senderName: str
    receiverId: str
    text: str
    timestamp: str
    isRead: bool

class ConversationResponse(BaseModel):
    id: str
    participants: List[str]
    lastMessage: Optional[str]
    lastMessageTime: Optional[str]
    unreadCount: int

# ==================== HELPERS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id: str) -> str:
    # Simple token: user_id + timestamp hash
    data = f"{user_id}:{datetime.now(timezone.utc).isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()[:32] + f"_{user_id}"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = credentials.credentials
    # Extract user_id from token
    if "_" not in token:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = token.split("_", 1)[1]
    
    # Check if token exists in DB
    token_doc = await db.tokens.find_one({"token": token, "userId": user_id})
    if not token_doc:
        raise HTTPException(status_code=401, detail="Token expired or invalid")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# ==================== WEBSOCKET MANAGER ====================

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        # Update user online status
        await db.users.update_one({"id": user_id}, {"$set": {"isOnline": True}})
        logger.info(f"User {user_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        logger.info(f"User {user_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to {user_id}: {e}")

manager = ConnectionManager()

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=dict)
async def register(data: UserRegister):
    # Check if username exists
    existing = await db.users.find_one({"username": data.username.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Имя пользователя уже занято")
    
    user_id = str(uuid.uuid4())[:8]
    now = datetime.now(timezone.utc).isoformat()
    
    user = {
        "id": user_id,
        "username": data.username.lower(),
        "password": hash_password(data.password),
        "name": data.name or data.username,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={data.username}",
        "stars": 1000,
        "isOnline": False,
        "isAdmin": data.username.lower() == "admin",
        "createdAt": now
    }
    
    await db.users.insert_one(user)
    
    # Generate token
    token = generate_token(user_id)
    await db.tokens.insert_one({"token": token, "userId": user_id, "createdAt": now})
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "username": user["username"],
            "name": user["name"],
            "avatar": user["avatar"],
            "stars": user["stars"],
            "isOnline": True,
            "isAdmin": user["isAdmin"],
            "createdAt": now
        }
    }

@api_router.post("/auth/login", response_model=dict)
async def login(data: UserLogin):
    user = await db.users.find_one({
        "username": data.username.lower(),
        "password": hash_password(data.password)
    }, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=401, detail="Неверное имя пользователя или пароль")
    
    # Generate new token
    token = generate_token(user["id"])
    now = datetime.now(timezone.utc).isoformat()
    await db.tokens.insert_one({"token": token, "userId": user["id"], "createdAt": now})
    
    # Update online status
    await db.users.update_one({"id": user["id"]}, {"$set": {"isOnline": True}})
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "name": user["name"],
            "avatar": user["avatar"],
            "stars": user["stars"],
            "isOnline": True,
            "isAdmin": user.get("isAdmin", False),
            "createdAt": user["createdAt"]
        }
    }

@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    await db.tokens.delete_many({"userId": current_user["id"]})
    await db.users.update_one({"id": current_user["id"]}, {"$set": {"isOnline": False}})
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# ==================== USER ROUTES ====================

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: dict = Depends(get_current_user)):
    users = await db.users.find(
        {"id": {"$ne": current_user["id"]}},
        {"_id": 0, "password": 0}
    ).to_list(100)
    return users

@api_router.get("/users/online", response_model=List[UserResponse])
async def get_online_users(current_user: dict = Depends(get_current_user)):
    users = await db.users.find(
        {"isOnline": True, "id": {"$ne": current_user["id"]}},
        {"_id": 0, "password": 0}
    ).to_list(100)
    return users

@api_router.get("/users/search/{query}", response_model=List[UserResponse])
async def search_users(query: str, current_user: dict = Depends(get_current_user)):
    users = await db.users.find(
        {
            "$and": [
                {"id": {"$ne": current_user["id"]}},
                {"$or": [
                    {"username": {"$regex": query, "$options": "i"}},
                    {"name": {"$regex": query, "$options": "i"}}
                ]}
            ]
        },
        {"_id": 0, "password": 0}
    ).to_list(20)
    return users

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)

# ==================== MESSAGE ROUTES ====================

@api_router.post("/messages", response_model=MessageResponse)
async def send_message(data: MessageCreate, current_user: dict = Depends(get_current_user)):
    # Check if receiver exists
    receiver = await db.users.find_one({"id": data.receiverId}, {"_id": 0})
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    message_id = str(uuid.uuid4())[:12]
    now = datetime.now(timezone.utc).isoformat()
    
    message = {
        "id": message_id,
        "senderId": current_user["id"],
        "senderName": current_user["name"],
        "receiverId": data.receiverId,
        "text": data.text,
        "timestamp": now,
        "isRead": False
    }
    
    await db.messages.insert_one(message)
    
    # Send via WebSocket if receiver is online
    await manager.send_personal_message({
        "type": "new_message",
        "message": message
    }, data.receiverId)
    
    return MessageResponse(**message)

@api_router.get("/messages/{user_id}", response_model=List[MessageResponse])
async def get_messages(user_id: str, current_user: dict = Depends(get_current_user)):
    # Get all messages between current user and specified user
    messages = await db.messages.find({
        "$or": [
            {"senderId": current_user["id"], "receiverId": user_id},
            {"senderId": user_id, "receiverId": current_user["id"]}
        ]
    }, {"_id": 0}).sort("timestamp", 1).to_list(100)
    
    # Mark messages as read
    await db.messages.update_many(
        {"senderId": user_id, "receiverId": current_user["id"], "isRead": False},
        {"$set": {"isRead": True}}
    )
    
    return messages

@api_router.get("/conversations", response_model=List[dict])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    # Get all unique conversations
    pipeline = [
        {"$match": {
            "$or": [
                {"senderId": current_user["id"]},
                {"receiverId": current_user["id"]}
            ]
        }},
        {"$sort": {"timestamp": -1}},
        {"$group": {
            "_id": {
                "$cond": [
                    {"$eq": ["$senderId", current_user["id"]]},
                    "$receiverId",
                    "$senderId"
                ]
            },
            "lastMessage": {"$first": "$text"},
            "lastMessageTime": {"$first": "$timestamp"},
            "unreadCount": {
                "$sum": {
                    "$cond": [
                        {"$and": [
                            {"$eq": ["$receiverId", current_user["id"]]},
                            {"$eq": ["$isRead", False]}
                        ]},
                        1,
                        0
                    ]
                }
            }
        }}
    ]
    
    conversations = await db.messages.aggregate(pipeline).to_list(50)
    
    # Get user info for each conversation
    result = []
    for conv in conversations:
        user = await db.users.find_one({"id": conv["_id"]}, {"_id": 0, "password": 0})
        if user:
            result.append({
                "user": user,
                "lastMessage": conv["lastMessage"],
                "lastMessageTime": conv["lastMessageTime"],
                "unreadCount": conv["unreadCount"]
            })
    
    return result

# ==================== WEBSOCKET ROUTE ====================

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    # Validate token
    if "_" not in token:
        await websocket.close(code=4001)
        return
    
    user_id = token.split("_", 1)[1]
    token_doc = await db.tokens.find_one({"token": token, "userId": user_id})
    
    if not token_doc:
        await websocket.close(code=4001)
        return
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            elif message_data.get("type") == "typing":
                # Notify receiver about typing
                receiver_id = message_data.get("receiverId")
                if receiver_id:
                    await manager.send_personal_message({
                        "type": "typing",
                        "senderId": user_id
                    }, receiver_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await db.users.update_one({"id": user_id}, {"$set": {"isOnline": False}})
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(user_id)

# ==================== STATUS ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "CL Messenger API v1.0", "status": "running"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("username", unique=True)
    await db.users.create_index("id", unique=True)
    await db.messages.create_index([("senderId", 1), ("receiverId", 1)])
    await db.messages.create_index("timestamp")
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
