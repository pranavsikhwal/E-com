from fastapi import APIRouter, Depends,HTTPException #API router creates different routes for different function 
from sqlalchemy.orm import Session
from typing import List
import math
from database import get_db
from models import Product
from schemas import ProductOut,PaginatedResponse

router = APIRouter(prefix="/products", tags=["products"])  #APIRouter is what makes a file a router. Without it, FastAPI has no idea that this file contains endpoints
@router.get("/", response_model=PaginatedResponse)   #these lines @ known as decorators
def get_all_products(search: str = None, page: int = 1,
    limit: int = 6, db: Session = Depends(get_db)):
    query = db.query(Product)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    total = query.count()
    total_pages = math.ceil(total / limit)
    offset = (page - 1) * limit

    products = query.offset(offset).limit(limit).all()

    return {
        "products": products,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }

@router.get("/{product_id}", response_model=ProductOut)  #respone model says first checks it with schemas then continue . always router.get and router.post in routrers/product.py or any thing not app.get because app is reserved for main.py
def get_single_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product