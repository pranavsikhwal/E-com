 #model and schema should always match on field names:
from pydantic import BaseModel

class ProductOut(BaseModel):
    id:          int
    name:        str
    description: str | None
    price:       float
    image_url:   str | None
    stock:       int

    class Config:
        from_attributes = True
        #class Config  is the most important part. Without from_attributes = True, Pydantic can't read SQLAlchemy objects. SQLAlchemy gives you a Product object from the database. Pydantic needs to read its attributes and convert it into JSON. This  makes that conversion possible.Without it you'd get an error every time your endpoint tries to return data.
        
class UserCreate(BaseModel):
    email:    str
    password: str


class LoginOut(BaseModel):
    access_token: str
    token_type:   str   #Token type is always "bearer" — it's a standard convention that tells the frontend how to use the token.
    
class CartItemOut(BaseModel):
    id:         int
    quantity:   int
    product:    ProductOut
# when the cart endpoint returns data, it returns the full product details nested inside each cart item
    class Config:
        from_attributes = True
        # Add this when schema reads data FROM the database (SQLAlchemy objects)
#→ Don't add this when schema reads data from user input (JSON from frontend
#Why? → SQLAlchemy gives objects, Pydantic expects dictionaries
       #from_attributes = True lets Pydantic read object attributes too
       
       
class CartAddRequest(BaseModel):
    product_id: int
    quantity:   int = 1