from fastapi import APIRouter, Depends,HTTPException #API router creates different routes for different function 
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Product
from schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"])  #APIRouter is what makes a file a router. Without it, FastAPI has no idea that this file contains endpoints
@router.get("/", response_model=List[ProductOut])   #these lines @ known as decorators
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products
@router.get("/{product_id}", response_model=ProductOut)  #respone model says first checks it with schemas then continue . always router.get and router.post in routrers/product.py or any thing not app.get because app is reserved for main.py
def get_single_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return product