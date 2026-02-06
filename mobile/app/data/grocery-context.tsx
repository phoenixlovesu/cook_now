import { createContext, useContext, useState, ReactNode } from 'react';

type GroceryGroup = {
  recipeName: string;
  items: string[];
};

type GroceryContextType = {
  groceryGroups: GroceryGroup[];
  addMissingItems: (recipeName: string, items: string[]) => void;
  toggleItem: (recipeName: string, item: string) => void;
};

const GroceryContext = createContext<GroceryContextType | null>(null);

/* ======== PROVIDER ========= */

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [groceryGroups, setGroceryGroups] = useState<GroceryGroup[]>([]);

  // Add missing ingredients for a recipe
  const addMissingItems = (recipeName: string, items: string[]) => {
    setGroceryGroups(prev => {
      const existing = prev.find(g => g.recipeName === recipeName);

      if (existing) {
        return prev.map(group =>
          group.recipeName === recipeName
            ? {
                ...group,
                items: Array.from(new Set([...group.items, ...items])),
              }
            : group
        );
      }

      return [...prev, { recipeName, items }];
    });
  };

  // Remove item when checked off
  const toggleItem = (recipeName: string, item: string) => {
    setGroceryGroups(prev =>
      prev
        .map(group =>
          group.recipeName === recipeName
            ? {
                ...group,
                items: group.items.filter(i => i !== item),
              }
            : group
        )
        .filter(group => group.items.length > 0)
    );
  };

  return (
    <GroceryContext.Provider
      value={{ groceryGroups, addMissingItems, toggleItem }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

// hook
export function useGrocery() {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within GroceryProvider');
  }
  return context;
}
