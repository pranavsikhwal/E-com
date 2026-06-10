from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import products
from routers import auth,cart
Base.metadata.create_all(bind=engine)   #it will create the table if not exist and check everytime wenever we run this 

app = FastAPI()   #it creates backend app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(auth.router)
app.include_router(cart.router)