def test_get_cart_no_token(client):
    response = client.get("/cart/")
    assert response.status_code == 401


def test_add_to_cart_no_token(client):
    response = client.post("/cart/add", json={
        "product_id": 1,
        "quantity": 1
    })
    assert response.status_code == 401


def test_get_cart_with_token(client, auth_token):
    response = client.get("/cart/", headers={
        "Authorization": f"Bearer {auth_token}"
    })
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_add_to_cart(client, auth_token, test_product):
    response = client.post("/cart/add",
        json={
            "product_id": test_product.id,
            "quantity": 1
        },
        headers={
            "Authorization": f"Bearer {auth_token}"
        }
    )
    assert response.status_code == 200
    assert "message" in response.json()


def test_cart_has_item_after_adding(client, auth_token, test_product):
    client.post("/cart/add",
        json={
            "product_id": test_product.id,
            "quantity": 1
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    response = client.get("/cart/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    cart = response.json()
    assert len(cart) > 0


def test_remove_from_cart(client, auth_token, test_product):
    client.post("/cart/add",
        json={
            "product_id": test_product.id,
            "quantity": 1
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    cart = client.get("/cart/",
        headers={"Authorization": f"Bearer {auth_token}"}
    ).json()

    item_id = cart[0]["id"]

    response = client.delete(f"/cart/{item_id}",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert "message" in response.json()