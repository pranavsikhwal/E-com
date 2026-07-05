def test_register(client):
    response = client.post("/auth/register", json={
        "email": "newuser@gmail.com",
        "password": "newpass123"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Account created successfully"


def test_register_duplicate_email(client, registered_user):
    response = client.post("/auth/register", json={
        "email": registered_user["email"],
        "password": "anypassword"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client, registered_user):
    response = client.post("/auth/login", data={
        "username": registered_user["email"],
        "password": registered_user["password"]
    })
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    response = client.post("/auth/login", data={
        "username": registered_user["email"],
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_wrong_email(client):
    response = client.post("/auth/login", data={
        "username": "nobody@gmail.com",
        "password": "anypassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_token_is_string(client, registered_user):
    response = client.post("/auth/login", data={
        "username": registered_user["email"],
        "password": registered_user["password"]
    })
    token = response.json()["access_token"]
    assert isinstance(token, str)
    assert len(token) > 0