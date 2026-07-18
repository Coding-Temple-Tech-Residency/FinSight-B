import os

from fastapi import HTTPException, status
from openai import OpenAI


# Environment variables are read when this module is imported.
# The Docker backend must therefore receive these values through
# docker-compose.yml and must be restarted after .env changes.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")


def get_openai_client() -> OpenAI:
    """
    Creates and returns an authenticated OpenAI client.

    Keeping client creation in one function centralizes configuration
    validation and avoids repeating the same checks in every AI feature.
    """

    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI API key is not configured",
        )

    if not OPENAI_MODEL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI model is not configured",
        )

    return OpenAI(api_key=OPENAI_API_KEY)


def generate_general_chat_response(
    *,
    message: str,
    portfolio_context: str,
) -> str:
    """
    Generates a financial-information response using the user's
    verified FinSight portfolio context.

    The model may use the portfolio data to provide educational,
    portfolio-aware observations and suggestions.

    It must not:
    - guarantee returns;
    - invent holdings or prices;
    - present itself as a licensed financial adviser;
    - instruct the user to make a specific trade without explaining
      uncertainty and limitations.
    """

    client = get_openai_client()

    instructions = """
You are FinSight, a financial education and portfolio-analysis assistant.

You are given verified portfolio data loaded by the backend for the
authenticated user.

Use that information when it is relevant to the user's question.

Rules:
- Provide educational, portfolio-aware observations.
- You may suggest areas the user could review, such as diversification,
  concentration, risk exposure, position sizing, or rebalancing.
- Do not guarantee returns or future market performance.
- Do not claim to be a licensed financial adviser.
- Do not invent holdings, prices, news, sectors, or market events.
- Clearly distinguish facts in the supplied data from general guidance.
- If the stored data is incomplete, say so.
- Avoid absolute commands such as "buy this" or "sell this."
- Prefer wording such as "you may want to review" or
  "one possible consideration is."
- Keep the response concise and practical.
""".strip()

    input_text = f"""
Verified FinSight portfolio context:
{portfolio_context}

User question:
{message}
""".strip()

    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=instructions,
            input=input_text,

            # Disable provider-side response storage because FinSight
            # already stores the generated result in its own database.
            store=False,
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate an AI response",
        ) from error

    generated_text = response.output_text.strip()

    if not generated_text:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider returned an empty response",
        )

    return generated_text


def generate_financial_insight(
    *,
    market_context: str,
    symbol: str | None = None,
    portfolio_name: str | None = None,
) -> str:
    """
    Generates an insight using financial data supplied by the backend.

    The backend, rather than the frontend, builds market_context from
    trusted database records. This reduces the risk that the user can
    manipulate the generated analysis by submitting fake holdings or
    market prices.
    """

    client = get_openai_client()

    # Identify what kind of subject the model is analyzing.
    if symbol:
        subject = f"Stock symbol: {symbol}"
    elif portfolio_name:
        subject = f"Portfolio: {portfolio_name}"
    else:
        subject = "General market context"

    instructions = """
You are FinSight, a financial information assistant.

Analyze only the financial data supplied by the backend.

Requirements:
- Create a concise and neutral summary.
- Identify important trends, concentration, gains, losses, or risks.
- Do not invent prices, holdings, news, or financial events.
- Do not promise returns.
- Do not directly tell the user to buy or sell.
- Mention uncertainty and data limitations when relevant.
- Keep the response under 180 words.
""".strip()

    input_text = f"""
Subject:
{subject}

Verified application data:
{market_context}
""".strip()

    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=instructions,
            input=input_text,
            store=False,
        )

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate AI insight",
        ) from error

    generated_text = response.output_text.strip()

    if not generated_text:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider returned an empty response",
        )

    return generated_text