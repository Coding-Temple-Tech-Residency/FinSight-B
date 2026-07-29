# FinSight

> **AI-Powered Investment Intelligence Platform**

FinSight is an AI-powered investment intelligence platform that enables investors to monitor portfolios, track stocks, and receive AI-generated financial insights through an intuitive web application.

By combining real-time market data, portfolio analytics, and conversational AI, FinSight transforms complex financial information into clear, actionable insights that help users make more informed investment decisions.

---

# Project Information

| | |
|---|---|
| **Project Name** | FinSight |
| **Team Name** | FinSight B |
| **Cohort** | TR43 |
| **Duration** | 8-Week Sprint |

## Team Members

| Name | Role |
|------|------|
| Farah Alansari | Frontend Developer |
| Mohamed Jalloh | Frontend Developer |
| Masooma Zahedi | Backend Developer |
| Jahvantè Tota | Backend Developer |
| Tutu Okundaye | Cybersecurity |

---

# Tech Stack

| Area | Technologies |
|------|--------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Query, Recharts |
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL (Supabase), JWT Authentication |
| **Data** | Market APIs, Portfolio Analytics |
| **Cybersecurity** | OAuth 2.0, AES-256 Encryption, OWASP Top 10 Review, Secure Financial Data Handling |
| **QA** | Manual Testing, Postman, Playwright |

---

# Project Overview

## Problem Statement

FinSight helps retail and individual investors make more informed investment decisions by bringing together portfolio tracking, stock monitoring, and AI-powered financial analysis in one platform.

Many investors struggle to interpret earnings reports, financial news, and market trends because information is spread across multiple websites and often written using complex financial terminology.

FinSight simplifies this process by organizing investment data into an intuitive dashboard and using AI to generate clear, easy-to-understand insights that help users evaluate their investments more efficiently.

---

## Target Users

FinSight is designed for:

- Retail investors managing personal portfolios
- Beginner investors learning the stock market
- Long-term investors building wealth
- Active traders monitoring multiple stocks
- Anyone looking for AI-assisted investment research without expensive financial software

The platform provides a simple, modern interface for tracking investments while leveraging AI to summarize complex financial information into actionable insights.

---

## Core Features

### Authentication

- Secure user registration and login
- JWT-based authentication
- Protected routes

### Portfolio Management

- Create and manage investment portfolios
- Track portfolio performance
- View portfolio allocation
- Performance analytics

### Watchlist

- Search for stocks
- Save favorite companies
- Monitor market movements

### Dashboard

- Portfolio summary
- Performance metrics
- Interactive charts
- Market overview

### AI Features

- AI-generated portfolio insights
- AI stock analysis
- Earnings report summaries
- Conversational AI assistant
- Natural language investment questions

### Data Visualization

- Portfolio allocation charts
- Performance charts
- Responsive dashboard analytics using Recharts

### Infrastructure

- FastAPI backend
- PostgreSQL database
- React + TypeScript frontend
- Responsive design with Tailwind CSS
- Deployment using Vercel, Render, and Supabase

---
---

## Setup Instructions

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/Coding-Temple-Tech-Residency/FinSight-B.git
cd FinSight-B/backend
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in the backend folder (see Required Environment Variables below)

5. Run the backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup
1. Navigate to frontend folder:
```bash
cd Frontend
npm install
```

2. Create `.env` file in the Frontend folder:

3. Run the frontend:
```bash
npm run dev
```

---

## Required Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| DATABASE_URL | Supabase PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT token signing |
| JWT_ALGORITHM | HS256 |
| JWT_EXPIRE_MINUTES | Token expiry in minutes (60) |
| ALPHA_VANTAGE_API_KEY | Alpha Vantage API key for stock data |
| OPENAI_API_KEY | OpenAI API key for AI insights and chat |
| OPENAI_MODEL | OpenAI model name (gpt-5-mini) |
| FINNHUB_API_KEY | Finnhub API key for stock search and trending |

### Frontend (`Frontend/.env`)
| Variable | Description |
|----------|-------------|
| VITE_API_BASE_URL | Backend API base URL |

---

## API Documentation

Full API documentation available via Swagger UI:
- Local: `http://localhost:8000/docs`
- Production: `https://finsight-b.onrender.com/docs`

---

## Deployment

| Service | URL |
|---------|-----|
| Frontend | https://finsight-b.vercel.app |
| Backend | https://finsight-b.onrender.com |
| API Docs | https://finsight-b.onrender.com/docs |
| Database | Supabase (PostgreSQL) |

---

## Notes & Known Limitations

- **Render Free Tier**: Backend spins down after 15 minutes of inactivity. First request may take 30-60 seconds. Open the app a few minutes before demos to warm up the server.
- **Alpha Vantage Rate Limits**: Free tier allows 25 API calls per day.
- **JWT Token Expiry**: Tokens expire after 60 minutes — users need to log in again after expiry.
- **AI Insights**: Requires valid OpenAI API key with sufficient credits.
- **Secrets**: Never commit `.env` files to GitHub. Use `.env.example` as a template.


## Intellectual Property Notice

This project was created as part of a Coding Temple Tech Residency. All work produced during the residency is considered the intellectual property of Coding Temple or the sponsoring employer, unless otherwise stated in a signed agreement. By contributing to this project, you acknowledge and agree to these terms.
