from enum import Enum


class Currency(str, Enum):
    """
    Currencies currently supported by FinSight.

    Using an enum prevents inconsistent database and API values such as:
    - "usd"
    - "US Dollars"
    - "$"
    - "USD "

    Additional ISO currency codes can be added later without changing
    the rest of the currency-conversion architecture.
    """

    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    JPY = "JPY"
    CAD = "CAD"
    AUD = "AUD"
    CHF = "CHF"