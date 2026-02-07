import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes } from '@/data/recipes-context';

export default function GroceryListScreen() {
  const { recipes, toggleIngredient } = useRecipes();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved recipes yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {recipes.map(recipe => (
            <View key={recipe.id} style={styles.recipeCard}>
              <Text style={styles.recipeName}>{recipe.name}</Text>

              {recipe.ingredients.map(ing => (
                <TouchableOpacity
                  key={ing.name}
                  style={styles.ingredientRow}
                  onPress={() => toggleIngredient(recipe.id, ing.name)}
                >
                  <Text style={styles.checkbox}>
                    {ing.hasIt ? '✅' : '⬜'}
                  </Text>
                  <Text style={styles.ingredientName}>{ing.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  recipeCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
  },
  ingredientName: {
    fontSize: 16,
  },
  emptyContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
