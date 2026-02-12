import { PLACE_CATEGORIES, type CategoryKey } from '../types/types';
import { X } from 'lucide-react';

interface NearbyCategoriesProps {
  selectedCategory: CategoryKey | null;
  onCategorySelect: (category: CategoryKey) => void;
  onClearCategory: () => void;
}

export function NearbyCategories({
  selectedCategory,
  onCategorySelect,
  onClearCategory,
}: NearbyCategoriesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 items-center">
      {(Object.keys(PLACE_CATEGORIES) as CategoryKey[]).map((key) => {
        const category = PLACE_CATEGORIES[key];
        const isSelected = selectedCategory === key;

        return (
          <button
            key={key}
            onClick={() => onCategorySelect(key)}
            className="px-4 py-2 rounded-xl transition-colors whitespace-nowrap text-sm font-medium shadow-md"
            style={{
              backgroundColor: isSelected ? '#ffa500' : 'white',
              color: isSelected ? 'white' : '#374151',
            }}
          >
            {category.label}
          </button>
        );
      })}
      
      {selectedCategory && (
        <button
          onClick={onClearCategory}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors flex-shrink-0"
          title="Clear selection"
        >
          <X size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
}
