import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { AssetFilters } from '@/types/assets';
import { useDebounce } from '@/hooks/use-debounce';
import { Search } from 'lucide-react';

interface AssetFiltersProps {
  filters: AssetFilters;
  onFilterChange: (filters: AssetFilters) => void;
}

export default function AssetFiltersComponent({
  filters,
  onFilterChange,
}: AssetFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AssetFilters>(filters);
  const debouncedFilters = useDebounce(localFilters, 1500);

  // Update local state when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Submit filters when debounced value changes
  useEffect(() => {
    // onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('adsdsa');
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
            value={localFilters.keyword || ''}
            onChange={handleInputChange}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
