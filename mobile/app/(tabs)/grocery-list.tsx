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
  const { recipes } = useRecipes(); // Get saved recipes from context

  /**
   * For now, map recipes to a format suitable for FlatList:
   * Each recipe has a name and a list of ingredients.
   * Later, user can filter only "missing ingredients" if integrating fridge tab.
   */
  const groceryData = recipes.map((r) => ({
    recipe: r.name,
    ingredients: r.ingredients.split('\n'), // assuming ingredients are multiline
  }));

  // State for tracking checked ingredients (inline checklist)
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Toggle checklist item
  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    marginBottom: 24,
    color: Colors.light.text,
    textAlign: 'center',
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
