def test_courtroom_cases(client):
    res = client.get("/api/courtroom/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 3
    eng_case = next((c for c in cases if "engineering" in c["title"].lower()), None)
    assert eng_case is not None
    assert "Sharma" in eng_case["party_a"]
    assert "Verma" in eng_case["party_b"]


def test_courtroom_simulate_round_1(client):
    payload = {
        "topic": "kya engineering krna sahi hai",
        "round": 1,
        "total_rounds": 3,
        "history": []
    }
    res = client.post("/api/courtroom/simulate-round", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["round"] == 1
    assert data["total_rounds"] == 3
    assert len(data["party_a"]["speech"]) > 20
    assert len(data["party_b"]["speech"]) > 20
    assert len(data["judge_interlocutory"]) > 10
    assert data["verdict"] is None


def test_courtroom_simulate_final_round_verdict(client):
    payload = {
        "topic": "kya engineering krna sahi hai",
        "round": 3,
        "total_rounds": 3,
        "history": [
            {
                "round": 1,
                "party_a": {"speech": "Engineering provides solid foundation..."},
                "party_b": {"speech": "80% engineers unemployable..."}
            },
            {
                "round": 2,
                "party_a": {"speech": "Tier 1 and 2 get high ROI..."},
                "party_b": {"speech": "Tier 3 has severe debt..."}
            }
        ]
    }
    res = client.post("/api/courtroom/simulate-round", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["round"] == 3
    assert data["verdict"] is not None
    verdict = data["verdict"]
    assert "winner" in verdict
    assert 0 <= verdict["party_a_score"] <= 100
    assert 0 <= verdict["party_b_score"] <= 100
    assert len(verdict["ratio_decidendi"]) > 20
    assert len(verdict["order_summary"]) > 20
