from database import SessionLocal, engine
from models import Base, Product

Base.metadata.create_all(bind=engine)

db = SessionLocal()

products = [
    Product(
        name="Blue T-Shirt",
        description="A clean and comfortable blue t-shirt",
        price=29.99,
        image_url="https://picsum.photos/300/200?random=1",
        stock=50
    ),
    Product(
        name="Black Jeans",
        description="Classic black jeans for everyday wear",
        price=59.99,
        image_url="https://picsum.photos/300/200?random=2",
        stock=30
    ),
    Product(
        name="White Sneakers",
        description="Fresh white sneakers for any occasion",
        price=89.99,
        image_url="https://picsum.photos/300/200?random=3",
        stock=20
    ),
]

db.add_all(products)
db.commit()
db.close()

print("Done! 3 products added.")