from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from google import genai
import os
from dotenv import load_dotenv

from database import get_db
from models import Product

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

router = APIRouter(prefix="/ai", tags=["ai"])


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    products = db.query(Product).all()

    product_list = "\n".join([
        f"- {p.name}: ₹{p.price}, Stock: {p.stock}, Description: {p.description}"
        for p in products
    ])

    system_prompt = f"""
You are a helpful shopping assistant for an ecommerce store.
You help customers find products, answer questions about pricing,
stock availability, and make recommendations.

Here are the current products available in our store:
{product_list}

Be friendly, concise and helpful. Answer only questions related to
the store and its products. If asked about something unrelated,
politely redirect the conversation back to shopping.
"""

    history_text = ""
    for msg in request.history[-6:]:
        role = "Customer" if msg.role == "user" else "Assistant"
        history_text += f"{role}: {msg.content}\n"

    full_prompt = f"{system_prompt}\n\nConversation so far:\n{history_text}\nCustomer: {request.message}\nAssistant:"

    response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=full_prompt,
    )

    return {"reply": response.text}