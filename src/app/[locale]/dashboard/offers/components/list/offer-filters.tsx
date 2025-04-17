import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { OfferFilters } from '@/types/offers';
import { useDebounce } from '@/hooks/use-debounce';
import { Search } from 'lucide-react';

interface OfferFiltersProps {
  filters: OfferFilters;
  onFilterChange: (filters: OfferFilters) => void;
}

export default function OfferFiltersComponent({
  filters,
  onFilterChange,
}: OfferFiltersProps) {
  const [localFilters, setLocalFilters] = useState<OfferFilters>(filters);
  const debouncedFilters = useDebounce(localFilters, 1500);

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Submit filters when debounced value changes
  useEffect(() => {
    onFilterChange(debouncedFilters);
    console.log(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="keyword"
            name="keyword"
            placeholder="Search..."
            onChange={(e) => {
              handleInputChange(e);
            }}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
