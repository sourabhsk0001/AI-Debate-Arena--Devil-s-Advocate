def test_debate_message_exchange_and_analysis(client):
    # Create 3-round debate
    create_res = client.post("/api/debates", json={
        "topic": "Remote work increases overall corporate productivity",
        "position": "for",
        "mode": "devils_advocate",
        "difficulty": "intermediate",
        "max_rounds": 3
    })
    assert create_res.status_code == 200
    debate_id = create_res.json()["id"]

    # Round 1: Send user message
    msg_payload = {
        "content": "Remote work increases productivity because employees save hours on commuting and have fewer office distractions."
    }
    msg_res = client.post(f"/api/debates/{debate_id}/messages", json=msg_payload)
    assert msg_res.status_code == 200
    data = msg_res.json()

    assert "debate" in data
    assert "userMessage" in data
    assert "aiMessage" in data

    user_msg = data["userMessage"]
    ai_msg = data["aiMessage"]

    assert user_msg["role"] == "user"
    assert user_msg["content"] == msg_payload["content"]
    assert user_msg["round"] == 1

    assert ai_msg["role"] == "devil_advocate"
    assert ai_msg["round"] == 1
    assert "counter" in ai_msg and ai_msg["counter"] is not None
    assert "counterargument" in ai_msg["counter"]
    assert "question" in ai_msg["counter"]

    assert "analysis" in ai_msg and ai_msg["analysis"] is not None
    assert len(ai_msg["analysis"]["assumptions"]) > 0
    assert len(ai_msg["analysis"]["strengths"]) > 0
    assert len(ai_msg["analysis"]["weaknesses"]) > 0

    assert "evidence" in ai_msg and ai_msg["evidence"] is not None
    assert len(ai_msg["evidence"]) > 0
    assert "Stanford" in ai_msg["evidence"][0]["source"] or "Empirical" in ai_msg["evidence"][0]["title"] or "Research" in ai_msg["evidence"][0]["source"]

    # Debate state check: round should have incremented to 2
    assert data["debate"]["current_round"] == 2
    assert data["debate"]["status"] == "active"

    # Fetch messages list
    list_msgs_res = client.get(f"/api/debates/{debate_id}/messages")
    assert list_msgs_res.status_code == 200
    all_msgs = list_msgs_res.json()
    assert len(all_msgs) == 2


def test_debate_completion_flow(client):
    # Create 1-round debate to test completion & auto-judgment
    create_res = client.post("/api/debates", json={
        "topic": "Universal Basic Income reduces systemic poverty",
        "position": "for",
        "mode": "devils_advocate",
        "difficulty": "intermediate",
        "max_rounds": 1
    })
    debate_id = create_res.json()["id"]

    msg_res = client.post(f"/api/debates/{debate_id}/messages", json={
        "content": "Providing an unconditional cash floor guarantees survival and enables workers to negotiate fair wages."
    })
    assert msg_res.status_code == 200
    data = msg_res.json()

    assert data["debate"]["status"] == "completed"
    assert data["debate"]["evaluation"] is not None
    assert 0 <= data["debate"]["evaluation"]["overall"] <= 10
    assert len(data["debate"]["evaluation"]["strengths"]) > 0
    assert len(data["debate"]["evaluation"]["improvement_suggestions"]) > 0
