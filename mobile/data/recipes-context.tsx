import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_RECIPES, Recipe, Ingredient, NewRecipe } from './mock-recipes';

type RecipesContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: NewRecipe | Recipe) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  toggleIngredient: (recipeId: string, ingredientName: string) => void;
  suggestRecipes: (fridgeItems: string[]) => Recipe[];
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  // Start empty to show empty state on home
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  /* ===== Add Recipe ===== */
const addRecipe = (recipe: NewRecipe | Recipe) => {
  setRecipes(prev => {
    // If recipe already has an id (ex: from mock recipes)
    if ('id' in recipe) {
      if (prev.some(r => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    }

    // User-created recipe → generate simple ID
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
    };

    return [...prev, newRecipe];
  });
};


// Find recipe by ID across saved + mock recipes
const getRecipeById = (id: string) =>
  recipes.find(r => r.id === id) || MOCK_RECIPES.find(r => r.id === id);

  /* ===== Toggle ingredient checkbox ===== */
  const toggleIngredient = (recipeId: string, ingredientName: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              ingredients: recipe.ingredients.map(ing =>
                ing.name === ingredientName
                  ? { ...ing, hasIt: !ing.hasIt }
                  : ing
              ),
            }
          : recipe
      )
    );
  };

  /* ===== Suggest recipes based on fridge items ===== */
const suggestRecipes = (fridgeItems: string[]) => {
  return MOCK_RECIPES.filter(recipe =>
    recipe.ingredients.some(ing =>
      fridgeItems.includes(ing.name.toLowerCase())
    )
  );
};

  return (
    <RecipesContext.Provider
      value={{ recipes, addRecipe, getRecipeById, toggleIngredient, suggestRecipes }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

/* ===== Hook for easier usage ===== */
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) throw new Error('useRecipes must be used within RecipesProvider');
  return context;
};

export type {Recipe, Ingredient };






