import { useState } from "react";

type PortfolioFormProps = {
  initialName?: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
};

const PortfolioForm = ({
  initialName = "",
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: PortfolioFormProps) => {
  const [name, setName] = useState(initialName ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Portfolio name is required.");
      return;
    }

    setError("");
    onSubmit(trimmedName);
  };

  return (
    <form className="portfolio-form" onSubmit={handleSubmit}>
      <label htmlFor="portfolio-name">Portfolio name</label>

      <input
        id="portfolio-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Growth Portfolio"
      />

      {error && <p className="negative">{error}</p>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
