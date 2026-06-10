from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import CartItem, Product
from schemas import CartItemOut, CartAddRequest
from auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=List[CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return items
  
@router.post("/add")
def add_to_cart(request: CartAddRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == request.product_id).first()

    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == request.product_id
    ).first()

    if existing_item:
        existing_item.quantity += request.quantity
        db.commit()
        return {"message": "Quantity updated"}

    new_item = CartItem(
        user_id=current_user.id,
        product_id=request.product_id,
        quantity=request.quantity
    )

    db.add(new_item)
    db.commit()
    return {"message": "Product added to cart"}

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}