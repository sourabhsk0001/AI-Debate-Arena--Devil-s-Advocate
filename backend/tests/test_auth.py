import uuid

def test_auth_register_and_login(client):
    test_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    test_password = "SecurePassword123!"

    # 1. Register
    reg_res = client.post("/api/auth/register", json={
        "name": "Test Debater",
        "email": test_email,
        "password": test_password
    })
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == test_email

    # 2. Duplicate Register
    dup_res = client.post("/api/auth/register", json={
        "name": "Duplicate Debater",
        "email": test_email,
        "password": test_password
    })
    assert dup_res.status_code == 400

    # 3. Login
    login_res = client.post("/api/auth/login", json={
        "email": test_email,
        "password": test_password
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["access_token"]
    assert token is not None

    # 4. Authenticated /me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["authenticated"] is True

def test_guest_login(client):
    res = client.post("/api/auth/guest")
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["name"] == "Guest Debater"
