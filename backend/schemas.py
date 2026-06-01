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