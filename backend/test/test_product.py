def test_get_all_products(client, test_product):
    response = client.get("/products/")
    assert response.status_code == 200

    data = response.json()
    assert "products" in data
    assert "total" in data
    assert "total_pages" in data
    assert len(data["products"]) > 0


def test_search_products(client, test_product):
    response = client.get("/products/?search=Test")
    assert response.status_code == 200

    data = response.json()
    assert len(data["products"]) > 0
    assert "Test" in data["products"][0]["name"]


def test_search_no_results(client):
    response = client.get("/products/?search=xyznotexist")
    assert response.status_code == 200

    data = response.json()
    assert len(data["products"]) == 0


def test_get_single_product(client, test_product):
    response = client.get(f"/products/{test_product.id}")
    assert response.status_code == 200

    data = response.json()
    assert data["name"] == "Test Product"
    assert data["price"] == 99.99


def test_get_product_not_found(client):
    response = client.get("/products/99999")
    assert response.status_code == 404

    data = response.json()
    assert data["detail"] == "Product not found"


def test_pagination(client, test_product):
    response = client.get("/products/?page=1&limit=6")
    assert response.status_code == 200

    data = response.json()
    assert data["page"] == 1
    assert data["limit"] == 6