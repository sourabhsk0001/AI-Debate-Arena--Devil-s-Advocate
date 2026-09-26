from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/topics", tags=["Topics"])

class TopicOption(BaseModel):
    id: str
    title: str
    category: str
    description: str
    difficulty: str
    recommended_rounds: int
    for_stance_summary: str
    against_stance_summary: str

FEATURED_TOPICS: List[TopicOption] = [
    TopicOption(
        id="ai-regulation",
        title="Governments Should Heavily Regulate Frontier AI Models",
        category="Technology & Governance",
        description="Debate whether existential risk, algorithmic bias, and labor dislocation justify stringent state oversight of advanced artificial intelligence.",
        difficulty="standard",
        recommended_rounds=3,
        for_stance_summary="Unchecked AI risks catastrophic systemic failure, mass technological unemployment, and weaponized misinformation.",
        against_stance_summary="Heavy regulation stifles open-source innovation, cements Big Tech monopolies, and hands competitive advantage to authoritarian regimes."
    ),
    TopicOption(
        id="ubi-automation",
        title="Universal Basic Income is Essential in the Era of AI",
        category="Economics & Society",
        description="Assess whether unconditional periodic cash payments are the only viable antidote to structural technological displacement.",
        difficulty="brutal",
        recommended_rounds=3,
        for_stance_summary="UBI preserves consumer demand, eradicates extreme poverty, and decouples human dignity from precarious wage labor.",
        against_stance_summary="The astronomical fiscal burden demands hyperinflationary deficit spending or punitive taxes that disincentivize productive work."
    ),
    TopicOption(
        id="social-media-minors",
        title="Social Media Access Should Be Banned for Minors Under 16",
        category="Youth & Mental Health",
        description="Confront the adolescent mental health epidemic, addictive algorithmic loops, and children's digital autonomy.",
        difficulty="standard",
        recommended_rounds=3,
        for_stance_summary="Empirical evidence links prolonged screen time to soaring anxiety, depression, sleep deprivation, and cyberbullying among adolescents.",
        against_stance_summary="Bans breach youth privacy through invasive digital ID surveillance and cut teens off from essential educational and peer support networks."
    ),
    TopicOption(
        id="nuclear-energy",
        title="Nuclear Energy is Indispensable for Global Decarbonization",
        category="Energy & Climate",
        description="Argue whether baseload nuclear power is superior or inferior to 100% renewable grids coupled with utility storage.",
        difficulty="friendly",
        recommended_rounds=3,
        for_stance_summary="Nuclear delivers clean, zero-carbon 24/7 power with the lowest land and raw material footprint per gigawatt-hour.",
        against_stance_summary="Exorbitant capital costs, decade-long reactor build times, and unresolved toxic waste storage make nuclear economically non-viable compared to solar and wind."
    ),
    TopicOption(
        id="remote-work",
        title="Companies Must Grant Employees a Legal Right to Remote Work",
        category="Work & Culture",
        description="Scrutinize employee autonomy and work-life balance against corporate cohesion and serendipitous innovation.",
        difficulty="standard",
        recommended_rounds=3,
        for_stance_summary="Remote flexibility slashes grueling commutes, enhances worker satisfaction, lowers housing stress, and expands global talent pools.",
        against_stance_summary="In-person collaboration fuels spontaneous creativity, junior mentorship, company culture, and sustains urban commercial vitality."
    )
]

@router.get("", response_model=List[TopicOption])
async def get_featured_topics():
    return FEATURED_TOPICS
