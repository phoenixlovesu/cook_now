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
    # Sort by can_make first, then missing ingredients first
    return sorted(matches, key=lambda x: (not x["can_make"], len(x["missing_ingredients"])))

def get_user_ingredients():
    print("Enter the ingredients you have in your fridge (comma separated):")
    raw_input = input()
    # split by comma and remove extra spaces
    ingredients = [item.strip().lower() for item in raw_input.split(",")]
    return ingredients

if __name__ == "__main__":
    user_ingredients = get_user_ingredients()
    results = match_recipes(user_ingredients, recipes)

    print("\n--- Recipe Suggestions ---\n")
    for r in results:
        print(f"Recipe: {r['recipe']}")
        print(f"Missing Ingredients: {r['missing_ingredients']}")
        print(f"Can make? {'Yes' if r['can_make'] else 'No'}")
        print("------")