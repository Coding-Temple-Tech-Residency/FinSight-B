from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes.auth_routes import router as auth_router

# Create all database tables if they don't exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="FinSight API", version="1.0.0")

# CORS configuration — allows frontend to communicate with backend
# Issue #36 — fix: resolve CORS configuration for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    # Allow requests from the frontend development server
    allow_origins=[
        "http://localhost:5173",   # Vite default port
        "http://127.0.0.1:5173",  # Alternative localhost format
    ],
    # Allow cookies and authorization headers to be sent
    allow_credentials=True,
    # Allow all HTTP methods — GET, POST, PUT, DELETE, OPTIONS
    allow_methods=["*"],
    # Allow all headers including Authorization for JWT tokens
    allow_headers=["*"],
)

# Register authentication routes
app.include_router(auth_router)

# Health check — confirms the server is running
@app.get("/")
def root():
    return {"status": "FinSight backend is running"}