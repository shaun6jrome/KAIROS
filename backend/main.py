from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import contextlib
import models, database, runner

models.Base.metadata.create_all(bind=database.engine)

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    scheduler = BackgroundScheduler()
    scheduler.add_job(runner.run_all_probes, 'interval', hours=24)
    scheduler.start()
    yield
    # Shutdown
    scheduler.shutdown()

app = FastAPI(
    title="KAIROS API",
    description="AI Behavioral Monitoring and Drift Detection System",
    version="1.0.0",
    lifespan=lifespan
)

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import baseline, drift, dashboard

app.include_router(baseline.router)
app.include_router(drift.router)
app.include_router(dashboard.router)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "kairos"}
