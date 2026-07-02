from database import SessionLocal, engine
from models import Base, Product

Base.metadata.create_all(bind=engine)

db = SessionLocal()

products = [
     Product(
        name="Blue T-Shirt",
        description="A clean and comfortable blue t-shirt for everyday wear",
        price=299,
        image_url="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400",
        stock=50
    ),
    Product(
        name="Black Jeans",
        description="Classic slim fit black jeans for any occasion",
        price=599,
        image_url="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        stock=30
    ),
    Product(
        name="Red Sneakers",
        description="Clean white sneakers that go with everything",
        price=899,
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        stock=20
    ),
    Product(
        name="Casual Hoodie",
        description="Warm and comfortable hoodie for cold days",
        price=799,
        image_url="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400",
        stock=25
    ),
    Product(
        name="Sports Watch",
        description="Durable sports watch with stopwatch and water resistance",
        price=1299,
        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stock=15
    ),
    Product(
        name="Sunglasses",
        description="UV protected polarized sunglasses for sunny days",
        price=399,
        image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        stock=35
    ),
    Product(
        name="Canvas Backpack",
        description="Spacious canvas backpack for college and travel",
        price=999,
        image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        stock=20
    ),
    Product(
        name="Brown Leather Wallet",
        description="Slim genuine leather wallet with card slots",
        price=499,
        image_url="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
        stock=40
    ),

]

db.add_all(products)
db.commit()
db.close()

print(f"Done! {len(products)} products added.")