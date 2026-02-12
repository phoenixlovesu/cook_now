import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_RECIPES, Recipe, Ingredient, NewRecipe } from './mock-recipes';

type RecipesContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: NewRecipe | Recipe) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  toggleIngredient: (recipeId: string, ingredientName: string) => void;
  suggestRecipes: (fridgeItems: string[]) => Recipe[];
  fetchRecipesFromAPI: (query?: string) => Promise<void>;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  /* ===== Add Recipe ===== */
  const addRecipe = (recipe: NewRecipe | Recipe) => {
    setRecipes(prev => {
      if ('id' in recipe) {
        if (prev.some(r => r.id === recipe.id)) return prev;
        return [...prev, recipe];
      }

      const newRecipe: Recipe = {
        ...recipe,
        id: Date.now().toString(),
        source: 'user',
      };

      return [...prev, newRecipe];
    });
  };

  /* ===== Get recipe by ID ===== */
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
                ing.name === ingredientName ? { ...ing, hasIt: !ing.hasIt } : ing
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

  /* ===== Fetch recipes from MealDB API ===== */
  const fetchRecipesFromAPI = async (query?: string) => {
    try {
      const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            query
          )}`
        : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

      const res = await fetch(url);
      const data = await res.json();

      if (!data.meals) return; // no results

      const apiRecipes: Recipe[] = data.meals.map((meal: any) => {
        // Convert MealDB ingredients (up to 20 fields) into array
        const ingredients: Ingredient[] = [];
        for (let i = 1; i <= 20; i++) {
          const name = meal[`strIngredient${i}`];
          if (name && name.trim() !== '') {
            ingredients.push({ name: name.trim(), hasIt: false });
          }
        }

        return {
          id: meal.idMeal,
          name: meal.strMeal,
          ingredients,
          instructions: meal.strInstructions || '',
          link: meal.strSource || meal.strYoutube || undefined,
          image: meal.strMealThumb || undefined,
          source: 'api',
        };
      });

      setRecipes(prev => [...prev, ...apiRecipes]);
    } catch (e) {
      console.log('MealDB fetch error:', e);
    }
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addRecipe,
        getRecipeById,
        toggleIngredient,
        suggestRecipes,
        fetchRecipesFromAPI,
      }}
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

export type { Recipe, Ingredient };







