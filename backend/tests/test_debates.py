def test_create_get_list_delete_debate(client):
    # 1. Create debate session
    payload = {
        "topic": "Remote work is better than working from the office",
        "position": "for",
        "mode": "devils_advocate",
        "difficulty": "intermediate",
        "max_rounds": 5
    }
    create_res = client.post("/api/debates", json=payload)
    assert create_res.status_code == 200
    debate = create_res.json()
    assert debate["topic"] == payload["topic"]
    assert debate["position"] == "for"
    assert debate["mode"] == "devils_advocate"
    assert debate["max_rounds"] == 5
    assert debate["current_round"] == 1
    assert debate["status"] == "active"
    debate_id = debate["id"]

    # 2. Get debate by ID
    get_res = client.get(f"/api/debates/{debate_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == debate_id

    # 3. List debates
    list_res = client.get("/api/debates")
    assert list_res.status_code == 200
    debates_list = list_res.json()
    assert any(d["id"] == debate_id for d in debates_list)

    # 4. Delete debate
    del_res = client.delete(f"/api/debates/{debate_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

    # 5. Verify deleted
    get_after = client.get(f"/api/debates/{debate_id}")
    assert get_after.status_code == 404
