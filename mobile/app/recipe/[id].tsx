import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '@/data/recipes-context';


export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecipeById, recipes, addRecipe } = useRecipes();

  // Find recipe either saved or in mock
  const recipe = getRecipeById(id || '');

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  // Check if recipe is already saved
  const isSaved = recipes.some(r => r.id === recipe.id);

  return (
    <ScrollView style={styles.container}>
      {/* Optional recipe image */}
      {recipe.image && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{recipe.name}</Text>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map(ing => (
        <Text key={ing.name} style={styles.text}>
          - {ing.name}
        </Text>
      ))}

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.text}>{recipe.instructions}</Text>

      {/* Recipe Link */}
      {recipe.link && (
        <TouchableOpacity
          onPress={() => recipe.link && Linking.openURL(recipe.link)}
        >
          <Text style={styles.link}>View Recipe Online</Text>
        </TouchableOpacity>
      )}

      {/* Save button if not already saved */}
      {!isSaved && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => addRecipe(recipe)}
        >
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


