from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Order, OrderItem, CartItem
from schemas import OrderOut
from auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/place")
def place_order(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    try:
        new_order = Order(
            user_id=current_user.id,
            total=round(total, 2),
            status="pending"
        )
        db.add(new_order)
        db.flush()

        for item in cart_items:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.product.price
            )
            db.add(order_item)

        for item in cart_items:
            db.delete(item)

        db.commit()

        return {"message": "Order placed successfully", "order_id": new_order.id}

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Order failed. Please try again.")


@router.get("/my", response_model=List[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()

    return orders