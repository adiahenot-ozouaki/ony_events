import { Minus, Plus } from 'lucide-react';
import { useQuantityInput } from './useQuantityInput';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  size?: 'sm' | 'md';
}

/**
 * Sélecteur de quantité avec boutons +/- pour les petits ajustements, et un
 * champ éditable pour taper directement un grand nombre (ex. 500) sans
 * cliquer 500 fois. La saisie n'est validée qu'à la perte de focus ou sur
 * Entrée ; une valeur invalide revient à la dernière valeur correcte.
 */
export function QuantityInput({ value, onChange, min = 1, size = 'md' }: QuantityInputProps) {
  const { draft, setDraft, commit } = useQuantityInput({ value, min, onChange });

  const isSmall = size === 'sm';
  const buttonPadding = isSmall ? 'p-2' : 'p-3';
  const iconSize = isSmall ? 14 : 16;

  return (
    <div className="flex items-center border border-border rounded-md">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`${buttonPadding} hover:text-[var(--gold)] transition-colors`}
        aria-label="Diminuer la quantité"
      >
        <Minus size={iconSize} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        className={`${isSmall ? 'w-14 text-sm' : 'w-16'} text-center bg-transparent focus:outline-none`}
        aria-label="Quantité"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={`${buttonPadding} hover:text-[var(--gold)] transition-colors`}
        aria-label="Augmenter la quantité"
      >
        <Plus size={iconSize} />
      </button>
    </div>
  );
}