from fastapi import FastAPI
from database import engine, Base
from routes.auth_routes import router as auth_router

# Create all database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="FinSight API", version="1.0.0")

# Register authentication routes
app.include_router(auth_router)

# Health check — confirms the server is running
@app.get("/")
def root():
    return {"status": "FinSight backend is running"}