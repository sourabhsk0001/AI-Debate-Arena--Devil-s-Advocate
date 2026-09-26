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


def test_ai_starts_first_and_ai_opening_endpoint(client):
    # Test creating debate where AI presents argument first
    res = client.post("/api/debates", json={
        "topic": "Should AI replace software engineers?",
        "position": "for",
        "mode": "devils_advocate",
        "difficulty": "advanced",
        "max_rounds": 5,
        "ai_starts_first": True
    })
    assert res.status_code == 200
    debate = res.json()
    assert len(debate["messages"]) == 1
    ai_opening = debate["messages"][0]
    assert ai_opening["role"] == "devil_advocate"
    assert "Opening" in ai_opening["content"] or "adversarial" in ai_opening["content"]
    assert ai_opening["evidence"] is not None
    assert len(ai_opening["evidence"]) > 0

    # Test trigger ai-open endpoint on a debate that starts empty
    empty_res = client.post("/api/debates", json={
        "topic": "Universal Basic Income is essential in the era of automation",
        "position": "for",
        "mode": "opponent",
        "difficulty": "intermediate",
        "max_rounds": 3,
        "ai_starts_first": False
    })
    assert empty_res.status_code == 200
    empty_id = empty_res.json()["id"]
    assert len(empty_res.json()["messages"]) == 0

    open_res = client.post(f"/api/debates/{empty_id}/ai-open")
    assert open_res.status_code == 200
    data = open_res.json()
    assert "aiMessage" in data
    assert data["aiMessage"]["role"] == "devil_advocate"
    assert len(data["debate"]["messages"]) == 1

