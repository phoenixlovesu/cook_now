// mobile/data/spoonacular.ts
const API_KEY = 'YOUR_SPOONACULAR_KEY';

export async function searchRecipes(query: string) {
  const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${API_KEY}`);
  return res.json(); // returns { results: [...] }
}

export async function getRecipeDetails(id: number) {
  const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
  return res.json(); // returns full recipe info
}
