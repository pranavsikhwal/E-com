from sqlalchemy import Column, Integer, String, Float,ForeignKey,DateTime
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class Product(Base):
    __tablename__ = "products"  #actual table name in database 

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price       = Column(Float, nullable=False)
    image_url   = Column(String, nullable=True)
    stock       = Column(Integer, default=0)
    
class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
class CartItem(Base):
    __tablename__ = "cart_items"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity   = Column(Integer, default=1)
    
    product    = relationship("Product")
    # when you load a CartItem, also automatically load the related Product
    
class Order(Base):
    __tablename__ = "orders"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    total      = Column(Float, nullable=False)
    status     = Column(String, default="pending")
    created_at = Column(DateTime, server_default=func.now())
    items      = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    id         = Column(Integer, primary_key=True, index=True)
    order_id   = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity   = Column(Integer, nullable=False)
    price      = Column(Float, nullable=False)
    order      = relationship("Order", back_populates="items")
    product    = relationship("Product")