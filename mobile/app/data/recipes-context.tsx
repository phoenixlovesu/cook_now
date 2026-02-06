import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Recipe = {
  name: string;
  ingredients: string;
  instructions: string;
  link?: string;
};

type RecipesContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // start empty, only useradded recipes

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) throw new Error('useRecipes must be used within RecipesProvider');
  return context;
};
