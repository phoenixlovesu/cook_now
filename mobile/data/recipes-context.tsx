import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_RECIPES, Recipe, Ingredient, NewRecipe } from './mock-recipes';

type RecipesContextType = {
  // User-saved recipes (Home, Grocery, Calendar)
  recipes: Recipe[];
  addRecipe: (recipe: Recipe | NewRecipe) => void;

  // API-fetched recipes for search
  apiRecipes: Recipe[];
  fetchRecipesFromAPI: (query?: string) => Promise<void>;

  getRecipeById: (id: string) => Recipe | undefined;
  toggleIngredient: (recipeId: string, ingredientName: string) => void;
};

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [apiRecipes, setApiRecipes] = useState<Recipe[]>([]);

  /* ===== Add recipe to user recipes ===== */
  const addRecipe = (recipe: Recipe | NewRecipe) => {
    setRecipes(prev => {
      if ('id' in recipe && prev.some(r => r.id === recipe.id)) return prev;

      const newRecipe: Recipe = 'id' in recipe
        ? recipe
        : { ...recipe, id: Date.now().toString(), source: 'user' };

      return [...prev, newRecipe];
    });
  };

  /* ===== Get recipe by ID ===== */
  const getRecipeById = (id: string) => {
    return recipes.find(r => r.id === id) || apiRecipes.find(r => r.id === id) || MOCK_RECIPES.find(r => r.id === id);
  };

  /* ===== Fetch & normalize recipes from MealDB API ===== */
  const fetchRecipesFromAPI = async (query?: string) => {
    try {
      const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
        : 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

      const res = await fetch(url);
      const data = await res.json();
      if (!data.meals) return;

      const normalized: Recipe[] = data.meals.map((meal: any) => {
        // Convert ingredients
        const ingredients: Ingredient[] = [];
        for (let i = 1; i <= 20; i++) {
          const name = meal[`strIngredient${i}`];
          if (name && name.trim() !== '') {
            ingredients.push({ name: name.trim(), hasIt: false });
          }
        }

        // Normalize instructions into numbered steps
        let instructions = meal.strInstructions || '';
        instructions = instructions
          .split(/\r?\n/)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .map((s: string, i: number) => `${i + 1}. ${s}`)
          .join('\n');

        return {
          id: `api-${meal.idMeal}`, // prefix API IDs to avoid conflicts
          name: meal.strMeal,
          ingredients,
          instructions,
          link: meal.strSource || meal.strYoutube || undefined,
          image: meal.strMealThumb || undefined,
          source: 'api',
        };
      });

      setApiRecipes(normalized);
    } catch (e) {
      console.log('MealDB fetch error:', e);
    }
  };

  const toggleIngredient = (recipeId: string, ingredientName: string) => {
  setRecipes(prev =>
    prev.map(r => {
      if (r.id !== recipeId) return r;

      return {
        ...r,
        ingredients: r.ingredients.map(i =>
          i.name === ingredientName ? { ...i, hasIt: !i.hasIt } : i
        ),
      };
    })
  );
};


  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addRecipe,
        apiRecipes,
        fetchRecipesFromAPI,
        getRecipeById,
        toggleIngredient,
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





