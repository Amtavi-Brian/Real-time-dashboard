"""Tests for authentication endpoints."""


def test_login_success(client):
    response = client.post("/auth/login", json={"email": "admin@columbus.co.gh", "password": "secret123"})
    assert response.status_code == 200
    body = response.json()
    assert body["user"]["role"] == "ADMIN"
    assert body["access_token"]


def test_login_invalid_password(client):
    response = client.post("/auth/login", json={"email": "admin@columbus.co.gh", "password": "wrong"})
    assert response.status_code == 401


def test_login_unknown_user(client):
    response = client.post("/auth/login", json={"email": "ghost@columbus.co.gh", "password": "secret123"})
    assert response.status_code == 401
