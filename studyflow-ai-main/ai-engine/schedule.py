import json
from datetime import datetime, timedelta

def load_user_data(file_path="user_data.json"):
    with open(file_path) as f:
        return json.load(f)

def generate_schedule(user):
    schedule = []
    total_hours = sum(g["hoursPerWeek"] for g in user["goals"])
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    # Simple distribution
    for goal in user["goals"]:
        daily_hours = goal["hoursPerWeek"] / 7
        for day in days:
            if f"{day} " in " ".join(user["availability"]):
                schedule.append({
                    "title": f"Study {goal['subject']}",
                    "start": f"2025-04-07T18:00:00",  # Placeholder
                    "end": f"2025-04-07T19:00:00",
                    "subject": goal["subject"],
                    "completed": False
                })
    return schedule[:5]  # Return first 5 blocks for demo

if __name__ == "__main__":
    user = load_user_data()
    plan = generate_schedule(user)
    print(json.dumps(plan, indent=2))