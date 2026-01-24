import json

# Load recipes
with open("data/recipes.json") as f:
    recipes = json.load(f)

def match_recipes(user_ingredients, recipes):
    matches = []
    for recipe in recipes:
        missing = set(recipe["ingredients"]) - set(user_ingredients)
        matches.append({
            "recipe": recipe["title"],
            "missing_ingredients": list(missing),
            "can_make": len(missing) == 0
        })
    # Sort by least missing ingredients first
    return sorted(matches, key=lambda x: len(x["missing_ingredients"]))

# Example usage
if __name__ == "__main__":
    user_ingredients = ["pasta", "bell pepper", "zucchini", "olive oil", "garlic", "eggs"]
    results = match_recipes(user_ingredients, recipes)

    for r in results:
        print(f"Recipe: {r['recipe']}")
        print(f"Missing: {r['missing_ingredients']}")
        print(f"Can make? {'Yes' if r['can_make'] else 'No'}")
        print("------")