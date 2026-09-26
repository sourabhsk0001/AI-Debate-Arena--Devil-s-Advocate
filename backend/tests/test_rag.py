def test_rag_search_endpoint_and_corpus(client):
    # 1. Test POST /api/rag/search for remote work
    res1 = client.post("/api/rag/search", json={
        "topic": "Remote work is better than working from the office",
        "query": "productivity collaboration Stanford",
        "limit": 3
    })
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["count"] > 0
    first_doc = data1["results"][0]
    assert "source" in first_doc
    assert "chunk" in first_doc
    assert "Stanford" in first_doc["source"] or "Harvard" in first_doc["source"] or "Goldman" in first_doc["source"] or "NBER" in first_doc["source"]

    # 2. Test POST /api/rag/search for AI replacement
    res2 = client.post("/api/rag/search", json={
        "topic": "Should AI replace software engineers?",
        "query": "coding code generation accuracy",
        "limit": 3
    })
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["count"] > 0

    # 3. Test GET /api/rag/search query param interface
    res3 = client.get("/api/rag/search?query=energy&topic=clean+energy")
    assert res3.status_code == 200
    assert res3.json()["count"] > 0
