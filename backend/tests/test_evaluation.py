def test_evaluate_endpoint_and_rubric(client):
    # 1. Create a debate
    create_res = client.post("/api/debates", json={
        "topic": "Artificial intelligence creates more economic opportunity than it displaces",
        "position": "for",
        "mode": "devils_advocate",
        "difficulty": "advanced",
        "max_rounds": 5
    })
    debate_id = create_res.json()["id"]

    # 2. Add an argument
    client.post(f"/api/debates/{debate_id}/messages", json={
        "content": "According to the Stanford AI Index 2024, AI-driven automation augments workers and historically technological transitions generate new industries and employment categories."
    })

    # 3. Trigger manual evaluation / premature conclusion
    eval_res = client.post(f"/api/debates/{debate_id}/evaluate")
    assert eval_res.status_code == 200
    ev = eval_res.json()

    # Verify 5 criteria from Section 16 (0-10 scale)
    assert 0 <= ev["logic"] <= 10
    assert 0 <= ev["evidence"] <= 10
    assert 0 <= ev["rebuttal"] <= 10
    assert 0 <= ev["clarity"] <= 10
    assert 0 <= ev["consistency"] <= 10
    assert 0 <= ev["overall"] <= 10

    assert len(ev["strengths"]) > 0
    assert len(ev["weaknesses"]) > 0
    assert len(ev["improvement_suggestions"]) > 0

    # 4. Fetch evaluation via GET
    get_eval = client.get(f"/api/debates/{debate_id}/evaluation")
    assert get_eval.status_code == 200
    assert get_eval.json()["overall"] == ev["overall"]
