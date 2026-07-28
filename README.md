## Project Information

FinSight is an AI-powered investment intelligence platform that enables investors to monitor portfolios, track stocks, and receive AI-generated financial insights through an intuitive web application. By combining real-time market data, portfolio analytics, and conversational AI, FinSight transforms complex financial information into clear, actionable insights that help users make more informed investment decisions.

**Project Name:** FINSIGHT  
**Team Name:** FINSIGHT B
**Cohort / Sprint:**  TR43
**Team Members:**  
  1. FARAH ALANSARI (FRONTEND)
  2. MOHAMED JALLOH (FRONTEND)
  3. MASOOMA ZAHEDI (BACKEND)
  4. JAHVANTÈ TOTA (BACKEND)
  5. TUTU OKUNDAYE (CYBER-SECURITY) 
**Tech Stack:**
| **Area** | **Technologies** |
| --- | --- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Recharts, React Query |
| **Backend** | Python, FastAPI, PostgreSQL (Supabase free tier), SQLAlchemy, JWT |
| **Data** | See notes below |
| **Cybersecurity** | OAuth 2.0, AES-256, OWASP Top 10 review, secure financial data handling checklist |
| **QA** | Manual testing, Postman (API testing), Playwright (automated end-to-end) |

## Project Overview

- What problem does it solve?
FinSight helps retail and individual investors make more informed investment decisions by bringing together portfolio tracking, stock monitoring, and AI-powered financial analysis in one platform.

Many investors struggle to interpret earnings reports, financial news, and market trends because the information is spread across multiple websites and often written using complex financial terminology. FinSight simplifies this process by organizing investment data into an intuitive dashboard and using AI to generate clear, easy-to-understand insights that help users evaluate their investments more efficiently. This aligns with the project's goal of making institutional-style investment intelligence more accessible to everyday investors.

- Who is the target user?
FinSight is designed for:

- Retail investors managing personal portfolios
- Beginner investors learning the stock market
- Long-term investors who want an organized dashboard
- Active traders who monitor multiple stocks
- Anyone looking for AI-assisted investment research without expensive financial software

The platform aims to provide users with a simple, modern interface for tracking investments while leveraging AI to summarize complex financial information into actionable insights.

- What core features were completed?

- Secure user authentication using JWT
- Portfolio management with performance tracking
- Watchlist management for monitoring favorite stocks
- Interactive dashboard displaying portfolio metrics and visualizations
- Stock search and market data integration
- AI-powered portfolio insights
- AI-generated stock analysis and earnings summaries
- Conversational AI chat for asking questions about stocks and portfolio holdings
- Portfolio allocation and performance charts using Recharts
- Responsive user interface built with React and Tailwind CSS
- Secure backend APIs built with FastAPI and PostgreSQL
- End-to-end deployment using Vercel, Render, and Supabase

These features support the project's objective of combining portfolio tracking, market intelligence, and AI-powered financial analysis into a single application.

## Setup & Documentation

Include any necessary documentation below:

- Setup instructions  
- Required environment variables  
- API documentation (if applicable)  
- Test credentials (if applicable)  
- Deployment link (if available)  

## Notes

List any known limitations, incomplete features, or important technical considerations.

## Development Standards Reminder

All submissions should reflect professional engineering standards:

- Write clean, readable, and modular code  
- Use clear naming conventions  
- Remove unused files, variables, and console logs  
- Follow consistent formatting and linting practices  
- Write meaningful commit messages  
- Keep branches organized and avoid pushing broken code to main  
- Review teammate pull requests respectfully and constructively  

Your repository should be organized, understandable, and demo-ready.

## Intellectual Property Notice

This project was created as part of a Coding Temple Tech Residency. All work produced during the residency is considered the intellectual property of Coding Temple or the sponsoring employer, unless otherwise stated in a signed agreement. By contributing to this project, you acknowledge and agree to these terms.

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your Supabase database URL and JWT secret
3. Never commit `.env` to GitHub
