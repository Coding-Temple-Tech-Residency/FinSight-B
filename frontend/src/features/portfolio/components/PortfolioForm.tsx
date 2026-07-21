import { useState, type FormEvent } from "react";

export type PortfolioFormValues = {
  name: string;
  description: string | null;
};

type PortfolioFormProps = {
  initialName?: string;
  initialDescription?: string | null;
  submitLabel: string;
  isSubmitting: boolean;
  mutationError?: string;
  onSubmit: (values: PortfolioFormValues) => void;
  onCancel?: () => void;
};

const PortfolioForm = ({
  initialName = "",
  initialDescription = "",
  submitLabel,
  isSubmitting,
  mutationError,
  onSubmit,
  onCancel,
}: PortfolioFormProps) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");

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
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);

    if (validationError) {
      setValidationError("");
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value);
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
