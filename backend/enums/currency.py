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

    USD = "USD"  # US Dollar
    EUR = "EUR"  # Euro
    GBP = "GBP"  # British Pound
    JPY = "JPY"  # Japanese Yen
    CHF = "CHF"  # Swiss Franc
    CAD = "CAD"  # Canadian Dollar
    AUD = "AUD"  # Australian Dollar
    NZD = "NZD"  # New Zealand Dollar

    CNY = "CNY"  # Chinese Yuan
    HKD = "HKD"  # Hong Kong Dollar
    SGD = "SGD"  # Singapore Dollar
    KRW = "KRW"  # South Korean Won
    INR = "INR"  # Indian Rupee
    TWD = "TWD"  # New Taiwan Dollar
    THB = "THB"  # Thai Baht
    MYR = "MYR"  # Malaysian Ringgit
    IDR = "IDR"  # Indonesian Rupiah
    PHP = "PHP"  # Philippine Peso
    VND = "VND"  # Vietnamese Dong
    PKR = "PKR"  # Pakistani Rupee
    BDT = "BDT"  # Bangladeshi Taka

    SEK = "SEK"  # Swedish Krona
    NOK = "NOK"  # Norwegian Krone
    DKK = "DKK"  # Danish Krone
    PLN = "PLN"  # Polish Zloty
    CZK = "CZK"  # Czech Koruna
    HUF = "HUF"  # Hungarian Forint
    RON = "RON"  # Romanian Leu
    BGN = "BGN"  # Bulgarian Lev
    ISK = "ISK"  # Icelandic Krona
    TRY = "TRY"  # Turkish Lira
    UAH = "UAH"  # Ukrainian Hryvnia

    MXN = "MXN"  # Mexican Peso
    BRL = "BRL"  # Brazilian Real
    ARS = "ARS"  # Argentine Peso
    CLP = "CLP"  # Chilean Peso
    COP = "COP"  # Colombian Peso
    PEN = "PEN"  # Peruvian Sol
    UYU = "UYU"  # Uruguayan Peso

    ZAR = "ZAR"  # South African Rand
    NGN = "NGN"  # Nigerian Naira
    EGP = "EGP"  # Egyptian Pound
    MAD = "MAD"  # Moroccan Dirham
    KES = "KES"  # Kenyan Shilling

    AED = "AED"  # UAE Dirham
    SAR = "SAR"  # Saudi Riyal
    QAR = "QAR"  # Qatari Riyal
    ILS = "ILS"  # Israeli New Shekel
    KWD = "KWD"  # Kuwaiti Dinar
    BHD = "BHD"  # Bahraini Dinar