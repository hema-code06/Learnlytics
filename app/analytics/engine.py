from datetime import datetime, timedelta
from statistics import mean
from collections import defaultdict


def calculate_daily_streak(entries):

    if not entries:
        return 0

    today = datetime.utcnow().date()

    day_topics = defaultdict(set)

    for e in entries:
        day_topics[e.created_at.date()].add(e.topic)

    streak = 0
    current = today

    while True:

        topics_today = len(day_topics.get(current, []))

        if topics_today >= 1:
            streak += 1
            current -= timedelta(days=1)
        else:
            break

    return streak


def calculate_consistency_score(entries):
    if not entries:
        return 0

    days = set()

    for e in entries:
        days.add(e.created_at.date())
    total_days = (datetime.utcnow().date() - min(days)).days + 1
    active_days = len(days)
    score = (active_days/total_days)*100

    return round(score, 2)


def study_time(entries, mode="daily"):
    result = defaultdict(float)

    for e in entries:

        d = e.created_at

        if mode == "daily":
            key = d.date()

        elif mode == "weekly":
            key = f"{d.year}-W{d.isocalendar()[1]}"

        elif mode == "monthly":
            key = f"{d.year}-{d.month}"

        result[key] += e.hours

    return dict(result)


def topic_breakdown(entries):

    topic_hours = defaultdict(float)

    for e in entries:
        topic_hours[e.topic] += e.hours

    return dict(topic_hours)


def weekly_learning_pattern(entries):

    weekday_hours = defaultdict(float)

    for e in entries:
        weekday = e.created_at.strftime("%A")
        weekday_hours[weekday] += e.hours

    return dict(weekday_hours)


def monthly_average_performance(entries):

    monthly = defaultdict(list)

    for e in entries:
        key = f"{e.created_at.year}-{e.created_at.month}"
        monthly[key].append(e.hours)

    return {k: round(mean(v), 2) for k, v in monthly.items()}


def detect_achievements(entries):

    topic_projects = defaultdict(int)

    badges = []

    for e in entries:

        if e.project_name:
            topic_projects[e.topic] += 1

    for topic, count in topic_projects.items():

        if count >= 2:
            badges.append(
                {
                    "topic": topic,
                    "badge": "Project Builder",
                    "description": f"Completed 2+ projects in {topic}"
                }
            )

    return badges


def smart_insights(entries):

    if not entries:
        return []

    insights = []

    avg_hours = mean([e.hours for e in entries])

    if avg_hours >= 5:
        insights.append("High productivity learning sessions.")

    if avg_hours < 2:
        insights.append("Try increasing daily learning time.")

    topic_count = len(set([e.topic for e in entries]))

    if topic_count >= 5:
        insights.append("You are exploring many topics.")

    return insights
