import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecipes, Recipe } from '@/data/recipes-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { recipes } = useRecipes();
  const router = useRouter();

  // Handler for Add Recipe button
  const handleAddRecipe = () => {
    router.push('/(tabs)/add-recipe');
  };

  // Render each recipe card
  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })}
    >
      <Text style={styles.recipeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Recipes</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recipes yet.</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddRecipe}
          >
            <Text style={styles.addButtonText}>Add Recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={item => item.id}
          renderItem={renderRecipe}
          contentContainerStyle={styles.list}
        />
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  },
});



