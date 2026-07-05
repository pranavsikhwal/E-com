import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import Base, get_db

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def registered_user(client):
    client.post("/auth/register", json={
        "email": "testuser@gmail.com",
        "password": "testpass123"
    })
    return {"email": "testuser@gmail.com", "password": "testpass123"}


@pytest.fixture
def auth_token(client, registered_user):
    response = client.post("/auth/login", data={
        "username": registered_user["email"],
        "password": registered_user["password"]
    })
    return response.json()["access_token"]


@pytest.fixture
def test_product(client):
    from models import Product
    db = TestingSessionLocal()
    product = Product(
        name="Test Product",
        description="A test product",
        price=99.99,
        image_url="https://example.com/image.jpg",
        stock=10
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    db.close()
    return product