import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  SUPPORTED_PORTFOLIO_CURRENCIES,
  type PortfolioCurrency,
} from "../../../constants/currencies";

export type PortfolioFormValues = {
  name: string;
  description: string | null;
  currency: PortfolioCurrency;
};

type PortfolioFormProps = {
  initialName?: string;
  initialDescription?: string | null;
  initialCurrency?: string;
  submitLabel: string;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (values: PortfolioFormValues) => void;
  onCancel?: () => void;
};

const isPortfolioCurrency = (value: string): value is PortfolioCurrency => {
  return SUPPORTED_PORTFOLIO_CURRENCIES.some(
    (currency) => currency.code === value,
  );
};

const getInitialCurrency = (value: string): PortfolioCurrency => {
  return isPortfolioCurrency(value) ? value : "USD";
};

const PortfolioForm = ({
  initialName = "",
  initialDescription = "",
  initialCurrency = "USD",
  submitLabel,
  isSubmitting,
  mutationError,
  onSubmit,
  onCancel,
}: PortfolioFormProps) => {
  const [name, setName] = useState(initialName);

  const [description, setDescription] = useState(initialDescription ?? "");

  const [currency, setCurrency] = useState<PortfolioCurrency>(
    getInitialCurrency(initialCurrency),
  );

  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setValidationError("Portfolio name is required.");
      return;
    }

    setValidationError("");

    onSubmit({
      name: trimmedName,
      description: trimmedDescription || null,
      currency,
    });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);

    if (validationError) {
      setValidationError("");
    }
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;

    if (isPortfolioCurrency(selectedCurrency)) {
      setCurrency(selectedCurrency);
    }
  };

  const errorMessage = validationError || mutationError;

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <div className="portfolio-form-field">
        <label htmlFor="portfolio-name">Portfolio name</label>

        <input
          id="portfolio-name"
          name="portfolio-name"
          type="text"
          value={name}
          maxLength={100}
          autoComplete="off"
          disabled={isSubmitting}
          onChange={handleNameChange}
          placeholder="Growth Portfolio"
        />
      </div>

      <div className="portfolio-form-field">
        <label htmlFor="portfolio-currency">Display currency</label>

        <select
          id="portfolio-currency"
          name="portfolio-currency"
          value={currency}
          disabled={isSubmitting}
          onChange={handleCurrencyChange}
        >
          {SUPPORTED_PORTFOLIO_CURRENCIES.map((supportedCurrency) => (
            <option key={supportedCurrency.code} value={supportedCurrency.code}>
              {supportedCurrency.code} — {supportedCurrency.name}
            </option>
          ))}
        </select>

        <p className="metric-label">
          Portfolio values will be displayed using this currency.
        </p>
      </div>

      <div className="portfolio-form-field">
        <div className="portfolio-form-label-row">
          <label htmlFor="portfolio-description">Description</label>

          <span>{description.length}/500</span>
        </div>

        <textarea
          id="portfolio-description"
          name="portfolio-description"
          value={description}
          maxLength={500}
          rows={5}
          disabled={isSubmitting}
          onChange={handleDescriptionChange}
          placeholder="Describe the purpose or strategy of this portfolio..."
        />
      </div>

      {errorMessage && (
        <p className="negative" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}

        <button type="submit" disabled={isSubmitting || !name.trim()}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
