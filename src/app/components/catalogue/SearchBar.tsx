import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-xl mx-auto mb-10 relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un produit..."
        className="w-full pl-11 pr-4 py-3 bg-white rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
      />
    </div>
  );
}