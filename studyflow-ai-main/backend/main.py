from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Input model
class UserInput(BaseModel):
    name: str
    subject: str
    hoursPerWeek: int
    deadline: str
    availability: list[str]
    learningStyle: str

# ✅ Test route
@app.get("/")
def home():
    return {"message": "Backend is running!"}

# ✅ POST route for schedule
@app.post("/schedule")
def generate_schedule(user: UserInput):
    # Map availability to days
    day_map = {
        "Mon": "Monday",
        "Wed": "Wednesday",
        "Sat": "Saturday"
    }

    # Generate realistic schedule
    schedule = []
    for i, avail in enumerate(user.availability):
        day = avail.split()[0]  # e.g., "Mon" from "Mon 18-20"
        time = avail.split()[1]  # e.g., "18-20"

        title = ["Study", "Review", "Practice"][i % 3] + " " + user.subject
        schedule.append({
            "title": title,
            "day": day_map.get(day, day),
            "time": time
        })

    return {"schedule": schedule}