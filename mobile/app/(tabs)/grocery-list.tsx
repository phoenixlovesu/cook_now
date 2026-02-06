import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/theme';
import { useRecipes } from '@/app/data/recipes-context';
import { useRouter } from 'expo-router';

/**
 * GroceryListScreen
 * Displays all ingredients from recipes the user has saved or added
 * Ingredients are grouped per recipe for better organization
 * Future features:
 * - Checklist toggle per ingredient
 * - Date picker for planned cooking
 * - "Missing ingredients" highlight for fridge tab integration
 */
export default function GroceryListScreen() {
  const router = useRouter();
  const { recipes } = useRecipes(); // Get saved recipes from context

   // Map recipes to a grocery list format
  const groceryData = recipes.map((r) => ({
    recipe: r.name,
    ingredients: r.ingredients.split('\n'), // assuming multiline ingredients
  }));

  // State for tracking checked ingredients (inline checklist)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Toggle checklist item
  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // === Render empty state if no recipes ====
  if (recipes.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Grocery List</Text>
        <Text style={styles.emptyText}>Your grocery list is empty!</Text>
        <Text style={styles.emptyHint}>Add recipes from Home to start building your grocery list.</Text>
        <Pressable style={styles.addButton} onPress={() => router.push('/add-recipe')}>
          <Text style={styles.addButtonText}>Add Recipe</Text>
        </Pressable>
      </SafeAreaView>
    );
  }


  return (
    // SafeAreaView ensures content is visible on phones with notches/islands
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {/* FlatList handles scrolling of all recipes */}
      <FlatList
        data={groceryData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <Text style={styles.title}>Grocery List</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            {/* Recipe name */}
            <Text style={styles.recipeName}>{item.recipe}</Text>

            {/* Ingredients for this recipe */}
            {item.ingredients.map((ingredient, idx) => {
              const key = `${item.recipe}-${idx}`; // unique key for checklist
              const checked = !!checkedItems[key];

              return (
                <Pressable
                  key={key}
                  onPress={() => toggleItem(key)}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
                >
                  {/* Simple checkbox indicator */}
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
                  <Text style={[styles.ingredientText, checked && styles.ingredientChecked]}>
                    {ingredient}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

/* ======== Styles ============ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
    color: Colors.light.text,
    textAlign: 'center',
  },
    emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  emptyHint: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
    addButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  addButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  recipeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  ingredientChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
});
