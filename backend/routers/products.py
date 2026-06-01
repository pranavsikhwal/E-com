from fastapi import APIRouter, Depends  #API router creates different routes for different function 
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Product
from schemas import ProductOut

router = APIRouter(prefix="/products", tags=["products"])
@router.get("/", response_model=List[ProductOut])   #these lines @ known as decorators
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products