from sqlalchemy import create_engine
#this create database infrastructure
from sqlalchemy.ext.declarative import declarative_base
#this creates Base which will be inherited by models.py
from sqlalchemy.orm import sessionmaker
#this creates session 
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shop.db")
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db(): #one session per API request  
    db = SessionLocal()
    try:
        yield db #Give this db session to FastAPI route
    finally:
        db.close()
        
        
        
 

